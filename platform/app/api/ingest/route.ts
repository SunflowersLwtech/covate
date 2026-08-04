import { db } from "../../lib/db";

// POST /api/ingest — the opt-in Covate MCP sync client posts one completed
// learning_session here. Auth: `Authorization: Bearer <sync_token>` (the per-user
// token from the dashboard). Idempotent on (user_id, client_id) so re-syncs don't
// duplicate. This is the paid platform's ingestion path; the free MCP never calls it
// unless the user has linked an account and configured the token.

type IncomingAnswer = {
  question: string;
  options?: unknown;
  correct_answer?: string;
  user_answer?: string;
  is_correct?: boolean;
  explanation?: string;
  topic?: string;
  concept?: string;
};

type IncomingSession = {
  client_id: string;
  project?: string;
  change_summary?: string;
  started_at?: string;
  completed_at?: string;
  answers?: IncomingAnswer[];
};

function bearer(req: Request): string | null {
  const h = req.headers.get("authorization") ?? "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

export async function POST(req: Request) {
  const token = bearer(req);
  if (!token) return Response.json({ error: "missing sync token" }, { status: 401 });

  let body: IncomingSession;
  try {
    body = (await req.json()) as IncomingSession;
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (!body?.client_id) return Response.json({ error: "client_id required" }, { status: 400 });

  const answers = Array.isArray(body.answers) ? body.answers : [];
  const total = answers.length;
  const correct = answers.filter((a) => a.is_correct === true).length;

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

  // Idempotent upsert of the session.
  const sessRows = (await sql`
    insert into learning_session
      (user_id, client_id, project, change_summary, question_count, correct_count, started_at, completed_at, synced_at)
    values
      (${userId}, ${body.client_id}, ${body.project ?? null}, ${body.change_summary ?? null},
       ${total}, ${correct}, ${body.started_at ?? null}, ${body.completed_at ?? null}, now())
    on conflict (user_id, client_id) do update set
      project = excluded.project,
      change_summary = excluded.change_summary,
      question_count = excluded.question_count,
      correct_count = excluded.correct_count,
      completed_at = excluded.completed_at,
      synced_at = now()
    returning id
  `) as { id: string }[];
  const sessionId = sessRows[0].id;

  // Replace this session's answers (idempotent re-sync).
  await sql`delete from quiz_answer where session_id = ${sessionId}`;
  for (const a of answers) {
    if (!a?.question) continue;
    await sql`
      insert into quiz_answer
        (session_id, user_id, question, options, correct_answer, user_answer, is_correct, explanation, topic, concept)
      values
        (${sessionId}, ${userId}, ${a.question}, ${JSON.stringify(a.options ?? null)},
         ${a.correct_answer ?? null}, ${a.user_answer ?? null}, ${a.is_correct ?? null},
         ${a.explanation ?? null}, ${a.topic ?? null}, ${a.concept ?? null})
    `;
    if (a.topic) {
      await sql`
        insert into topic_progress (user_id, topic, total_answered, total_correct, last_seen)
        values (${userId}, ${a.topic}, 1, ${a.is_correct ? 1 : 0}, now())
        on conflict (user_id, topic) do update set
          total_answered = topic_progress.total_answered + 1,
          total_correct = topic_progress.total_correct + ${a.is_correct ? 1 : 0},
          last_seen = now()
      `;
    }
  }

  return Response.json({ ok: true, session_id: sessionId, answers: total, correct });
}
