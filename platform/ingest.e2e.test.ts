// End to end: sessions the Covate MCP really stores, synced by its own sync command
// (`python -m covate.platform_sync`) to the real /api/ingest handler, read back from
// Postgres. Before the wire format was pinned down, every real session got a 500 here
// while hand-built test sessions passed.
//
// Needs a throwaway local Postgres and a Python with covate installed:
//   INGEST_E2E_DATABASE_URL=postgres://postgres@127.0.0.1:5432/covate_e2e \
//   COVATE_PYTHON=../.venv/bin/python npm run test:ingest
// Skipped when either is unset. It applies db/schema.sql and creates (then deletes)
// one user; it refuses any database that isn't on this machine.
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const DATABASE_URL = process.env.INGEST_E2E_DATABASE_URL;
const PYTHON = process.env.COVATE_PYTHON;
const REPO = fileURLToPath(new URL("..", import.meta.url));
const FIXTURE = join(REPO, "tests", "fixtures", "real_session");
const skip = !DATABASE_URL || !PYTHON ? "set INGEST_E2E_DATABASE_URL and COVATE_PYTHON" : false;

if (DATABASE_URL && !["localhost", "127.0.0.1", "[::1]"].includes(new URL(DATABASE_URL).hostname)) {
  throw new Error("INGEST_E2E_DATABASE_URL must be a local throwaway database");
}

type SessionRow = {
  question_count: number;
  correct_count: number;
  started_at: Date | null;
  completed_at: Date | null;
};
type AnswerRow = { question: string; user_answer: string | null; correct_answer: string | null; is_correct: boolean | null };

describe("sync from the MCP to the ledger", { skip }, () => {
  let sql: ReturnType<typeof postgres>;
  let server: Server;
  let url: string;
  let userId: string;
  let token: string;
  const scratch = mkdtempSync(join(tmpdir(), "covate-ingest-e2e-"));

  before(async () => {
    process.env.DATABASE_URL = DATABASE_URL;
    sql = postgres(DATABASE_URL!, { max: 1, onnotice: () => {} });
    await sql.unsafe(readFileSync(new URL("./db/schema.sql", import.meta.url), "utf8"));
    const [user] = await sql<{ id: string; sync_token: string }[]>`
      insert into platform_user (github_id, github_login)
      values (${-Math.floor(Math.random() * 1e12)}, 'ingest-e2e')
      returning id, sync_token`;
    userId = user.id;
    token = user.sync_token;

    // The route handler as Next calls it: a web Request in, a Response out. An
    // exception becomes an empty 500, which is what the client saw in production.
    const { POST } = await import("./app/api/ingest/route");
    server = createServer(async (req, res) => {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk as Buffer);
      const headers = new Headers();
      for (const [name, value] of Object.entries(req.headers)) if (typeof value === "string") headers.set(name, value);
      let response: Response;
      try {
        response =
          req.method === "POST" && req.url === "/api/ingest"
            ? await POST(
                new Request(`http://127.0.0.1${req.url}`, {
                  method: "POST",
                  headers,
                  body: Buffer.concat(chunks),
                }),
              )
            : new Response("not found", { status: 404 });
      } catch {
        response = new Response("", { status: 500 });
      }
      res.writeHead(response.status, { "content-type": response.headers.get("content-type") ?? "text/plain" });
      res.end(Buffer.from(await response.arrayBuffer()));
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  after(async () => {
    server?.close();
    if (userId) await sql`delete from platform_user where id = ${userId}`;
    await sql?.end();
    rmSync(scratch, { recursive: true, force: true });
  });

  // Asynchronous on purpose: the ingest server runs in this process, and a blocking
  // spawn would keep it from answering the child it is waiting for.
  function python(args: string[], env: Record<string, string> = {}) {
    return new Promise<{ status: number; stdout: string; stderr: string }>((resolve) => {
      execFile(PYTHON!, args, { cwd: REPO, env: { ...process.env, ...env }, timeout: 90_000 }, (error, stdout, stderr) => {
        const code = error ? (typeof error.code === "number" ? error.code : -1) : 0;
        resolve({ status: code, stdout, stderr });
      });
    });
  }

  /** `python -m covate.platform_sync <project>`, the command a user runs. */
  async function syncProject(project: string, env: Record<string, string> = {}) {
    const run = await python(["-m", "covate.platform_sync", project], { COVATE_SYNC_URL: url, COVATE_SYNC_TOKEN: token, ...env });
    return { ...run, result: run.stdout.trim() ? JSON.parse(run.stdout) : null };
  }

  async function session(clientId: string) {
    const [row] = await sql<SessionRow[]>`
      select question_count, correct_count, started_at, completed_at
        from learning_session where user_id = ${userId} and client_id = ${clientId}`;
    const answers = await sql<AnswerRow[]>`
      select a.question, a.user_answer, a.correct_answer, a.is_correct
        from quiz_answer a join learning_session s on s.id = a.session_id
       where s.user_id = ${userId} and s.client_id = ${clientId}
       order by a.question`;
    return { row, answers };
  }

  async function postBody(body: unknown) {
    const res = await fetch(`${url}/api/ingest`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    return { status: res.status, json: await res.json().catch(() => null) };
  }

  it("syncs a session the CLI recorded for a real user", async () => {
    const project = join(scratch, "real");
    mkdirSync(join(project, ".mcp-sidecar"), { recursive: true });
    cpSync(FIXTURE, join(project, ".mcp-sidecar", "sessions"), { recursive: true, filter: (f) => !f.endsWith("legacy_ingest_body.json") });

    // The session was recorded on a machine running UTC+8; sync there too.
    const run = await syncProject(project, { TZ: "Asia/Singapore" });
    assert.deepEqual(run.result, { synced: 1, failed: 0, errors: [] }, run.stdout + run.stderr);
    assert.equal(run.status, 0);

    const { row, answers } = await session("1792690295_25edc417");
    assert.equal(row.question_count, 3);
    assert.equal(row.correct_count, 2);
    assert.equal(row.started_at?.toISOString(), "2026-10-22T17:31:35.152Z");
    assert.equal(row.completed_at?.toISOString(), "2026-10-22T17:32:17.297Z");
    assert.deepEqual(
      answers.map((a) => [a.user_answer, a.correct_answer, a.is_correct]),
      [
        ["Nothing", "A max attempt count", false],
        ["503", "503", true],
        ["To spread load", "To spread load", true],
      ],
    );
    const [progress] = await sql`select total_answered, total_correct from topic_progress where user_id = ${userId} and topic = 'logic'`;
    assert.deepEqual({ ...progress }, { total_answered: 3, total_correct: 2 });

    // Syncing again replaces the session rather than adding to it.
    assert.deepEqual((await syncProject(project, { TZ: "Asia/Singapore" })).result, { synced: 1, failed: 0, errors: [] });
    assert.equal((await session("1792690295_25edc417")).answers.length, 3);
  });

  it("syncs a session recorded through the MCP tool and the quiz page's submit", async () => {
    const project = join(scratch, "fresh");
    const recorded = await python(["tests/e2e/record_session.py", project, "A,C,C"]);
    assert.equal(recorded.status, 0, recorded.stderr);
    const { session_id } = JSON.parse(recorded.stdout);

    const run = await syncProject(project);
    assert.deepEqual(run.result, { synced: 1, failed: 0, errors: [] }, run.stdout + run.stderr);

    const { row, answers } = await session(session_id);
    assert.equal(row.question_count, 3);
    assert.equal(row.correct_count, 2);
    assert.ok(row.started_at && row.completed_at && row.started_at <= row.completed_at, "both timestamps, in order");
    assert.ok(Date.now() - row.completed_at.getTime() < 10 * 60_000, "completed just now");
    assert.deepEqual(
      answers.map((a) => [a.user_answer, a.correct_answer, a.is_correct]),
      [
        ["C) New feature", "B) Bug fix", false],
        ["503", "503", true],
        ["To spread load", "To spread load", true],
      ],
    );
  });

  it("accepts what a client from before the fix sends, and stores it the same way", async () => {
    const legacy = JSON.parse(readFileSync(join(FIXTURE, "legacy_ingest_body.json"), "utf8"));
    const { status, json } = await postBody({ ...legacy, client_id: "legacy-client" });
    assert.equal(status, 200, JSON.stringify(json));
    assert.equal(json.correct, 2);

    const { row, answers } = await session("legacy-client");
    assert.equal(row.started_at?.toISOString(), "2026-10-22T17:31:35.152Z");
    assert.ok(row.completed_at, "naive local time is kept (read in the database's zone)");
    assert.deepEqual(
      answers.map((a) => [a.user_answer, a.is_correct]),
      [
        ["Nothing", false],
        ["503", true],
        ["To spread load", true],
      ],
    );
  });

  it("answers an unreadable timestamp with a 400 and stores nothing", async () => {
    for (const started_at of ["not a time", "2026-13-45T00:00:00Z"]) {
      const { status, json } = await postBody({ client_id: `bad-${started_at}`, started_at, answers: [] });
      assert.equal(status, 400, `${started_at}: ${JSON.stringify(json)}`);
      assert.equal((await session(`bad-${started_at}`)).row, undefined);
    }
  });
});
