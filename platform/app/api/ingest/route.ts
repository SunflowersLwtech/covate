import { db } from "../../lib/db";
import { normalizeAnswer, parseIngestBody, sessionTimes, type IncomingAnswer } from "../../lib/ingest";

// POST /api/ingest — the opt-in Covate MCP sync client posts one completed
// learning_session here. Auth: `Authorization: Bearer <sync_token>` (the per-user
// token from the dashboard). Idempotent on (user_id, client_id) so re-syncs don't
// duplicate. This is the hosted ledger's ingestion path; the MCP never calls it
// unless the user has linked an account and configured the token.
//
// Timestamps are ISO 8601 (or, from older clients, Unix seconds and a zoneless local
// time) and answers are option text (or a letter label); lib/ingest.ts reads both.
// Input Postgres refuses (a timestamp it can't read, text it can't store) is the
// client's mistake and gets a 400, and every write for a session happens in one
// transaction, so a refused re-sync leaves the previous copy whole.
//
// Ceilings. Every answer is its own insert, so without them one token could post
// an arbitrarily large session, or post forever, and keep the (metered) database
// busy the whole time:
//   - the body is at most 256 KB, checked before anything touches the database;
//   - a session carries at most 200 answers;
//   - a token gets at most 240 requests per clock hour. `covate.platform_sync`
//     re-posts up to 200 stored sessions on every run, so the ceiling sits above
//     one full run rather than at the 60/hour first proposed for it.
const MAX_BODY_BYTES = 256 * 1024;
const MAX_ANSWERS = 200;
const MAX_REQUESTS_PER_HOUR = 240;

type IncomingSession = {
  client_id: string;
  project?: string;
  change_summary?: string;
  started_at?: unknown;
  completed_at?: unknown;
  answers?: IncomingAnswer[];
};

// Postgres's own verdict on input that passed our checks: a timestamp it cannot read
// (month 13, a +25:00 offset), or text it cannot store (a NUL byte that got past the
// parser, an unpaired surrogate in an option, which jsonb reports as 22P02).
const BAD_DATETIME = new Set(["22007", "22008", "22009"]);
const BAD_TEXT = new Set(["22021", "22P02", "22P05"]);

function bearer(req: Request): string | null {
  const h = req.headers.get("authorization") ?? "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

export async function POST(req: Request) {
  const token = bearer(req);
  if (!token) return Response.json({ error: "missing sync token" }, { status: 401 });

  const tooLarge = Response.json({ error: `body too large (max ${MAX_BODY_BYTES} bytes)` }, { status: 413 });
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return tooLarge;
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return Response.json({ error: "unreadable body" }, { status: 400 });
  }
  // The header is optional (chunked uploads omit it), so the bytes are counted too.
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) return tooLarge;

  let body: IncomingSession;
  try {
    body = parseIngestBody(raw) as IncomingSession;
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (!body?.client_id) return Response.json({ error: "client_id required" }, { status: 400 });

  const incoming = Array.isArray(body.answers) ? body.answers : [];
  if (incoming.length > MAX_ANSWERS) {
    return Response.json({ error: `too many answers (max ${MAX_ANSWERS})` }, { status: 413 });
  }
  const times = sessionTimes(body.started_at, body.completed_at);
  if ("invalid" in times) {
    return Response.json({ error: `${times.invalid} must be an ISO 8601 timestamp` }, { status: 400 });
  }
  const { startedAt, completedAt } = times;
  const answers = incoming.map(normalizeAnswer);
  const total = incoming.length;
  const correct = answers.filter((a) => a?.is_correct === true).length;

  let sql;
  try {
    sql = db();
  } catch {
    return Response.json({ error: "platform not configured" }, { status: 503 });
  }

  // Auth: resolve the user from the sync token.
  const users = (await sql`select id from platform_user where sync_token = ${token} limit 1`) as { id: string }[];
  if (users.length === 0) return Response.json({ error: "invalid sync token" }, { status: 403 });
  const userId = users[0].id;

  // Count this request against the token's hour before doing any work for it.
  const windowRows = (await sql`
    insert into ingest_window (user_id, window_start, requests)
    values (${userId}, date_trunc('hour', now()), 1)
    on conflict (user_id, window_start) do update set requests = ingest_window.requests + 1
    returning requests
  `) as { requests: number }[];
  const requests = windowRows[0].requests;
  if (requests === 1) {
    await sql`delete from ingest_window where user_id = ${userId} and window_start < date_trunc('hour', now())`;
  }
  if (requests > MAX_REQUESTS_PER_HOUR) {
    const retryAfter = 3600 - (Math.floor(Date.now() / 1000) % 3600);
    return Response.json(
      { error: `rate limit: at most ${MAX_REQUESTS_PER_HOUR} syncs per hour` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let sessionId: string;
  try {
    sessionId = await sql.begin(async (tx) => {
      // Idempotent upsert of the session.
      //
      // The `::text::` on the timestamps is load-bearing. The driver asks Postgres to
      // describe each parameter and then applies its own serializer for the type that
      // comes back: a timestamptz-described parameter is pushed through
      // `new Date(x).toISOString()`, which silently truncates anything finer than a
      // millisecond. Describing the parameter as text hands the client's string to
      // Postgres untouched and lets Postgres do the parsing.
      const sessRows = (await tx`
        insert into learning_session
          (user_id, client_id, project, change_summary, question_count, correct_count, started_at, completed_at, synced_at)
        values
          (${userId}, ${body.client_id}, ${body.project ?? null}, ${body.change_summary ?? null},
           ${total}, ${correct}, ${startedAt}::text::timestamptz,
           ${completedAt}::text::timestamptz, now())
        on conflict (user_id, client_id) do update set
          project = excluded.project,
          change_summary = excluded.change_summary,
          question_count = excluded.question_count,
          correct_count = excluded.correct_count,
          completed_at = excluded.completed_at,
          synced_at = now()
        returning id
      `) as { id: string }[];
      const id = sessRows[0].id;

      // Replace this session's answers (idempotent re-sync). Remember the topics this
      // session used to touch so their rollups get recomputed even if the answers changed.
      const prevTopicRows = (await tx`
        select distinct topic from quiz_answer where session_id = ${id} and topic is not null
      `) as { topic: string }[];
      const touchedTopics = new Set<string>(prevTopicRows.map((r) => r.topic));

      await tx`delete from quiz_answer where session_id = ${id}`;
      for (const a of answers) {
        if (!a) continue;
        // `options` is already a JSON string, so it goes in as text and Postgres parses
        // it — same reason as the timestamps above: a jsonb-described parameter would be
        // JSON.stringify'd by the driver and land as a jsonb *string* of JSON.
        await tx`
          insert into quiz_answer
            (session_id, user_id, question, options, correct_answer, user_answer, is_correct, explanation, topic, concept)
          values
            (${id}, ${userId}, ${a.question}, ${JSON.stringify(a.options ?? null)}::text::jsonb,
             ${a.correct_answer}, ${a.user_answer}, ${a.is_correct},
             ${a.explanation}, ${a.topic}, ${a.concept})
        `;
        if (a.topic) touchedTopics.add(a.topic);
      }

      // Recompute the rollup for every topic this sync touched, straight from quiz_answer.
      // Incrementing here would double-count: the MCP client re-posts every stored session
      // on each run, and the answers above are deleted-and-reinserted on a re-sync.
      for (const topic of touchedTopics) {
        await tx`
          insert into topic_progress (user_id, topic, total_answered, total_correct, last_seen)
          select ${userId}, ${topic}, count(*), count(*) filter (where is_correct), max(created_at)
            from quiz_answer where user_id = ${userId} and topic = ${topic}
          on conflict (user_id, topic) do update set
            total_answered = excluded.total_answered,
            total_correct = excluded.total_correct,
            last_seen = excluded.last_seen
        `;
      }
      // A topic can lose its last answer (edited quiz, removed session) — don't leave an
      // empty row behind for the progress chart to render.
      await tx`delete from topic_progress where user_id = ${userId} and total_answered = 0`;
      return id;
    });
  } catch (e) {
    const code = (e as { code?: string }).code ?? "";
    if (BAD_DATETIME.has(code)) {
      return Response.json({ error: "started_at / completed_at is not a valid timestamp" }, { status: 400 });
    }
    if (BAD_TEXT.has(code)) {
      return Response.json({ error: "the session holds text the ledger cannot store" }, { status: 400 });
    }
    throw e;
  }

  return Response.json({ ok: true, session_id: sessionId, answers: total, correct });
}
