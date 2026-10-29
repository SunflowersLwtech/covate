// End to end: the ops routes against a real Postgres with db/schema.sql applied.
// Proves on the database what ops.test.ts proves on a fake: the lookup is a
// case-insensitive equality, nothing secret comes back, the write routes are 404,
// reads change no product table, and every read leaves exactly one audit row.
//
// Needs a throwaway local Postgres:
//   OPS_E2E_DATABASE_URL=postgres://postgres@127.0.0.1:5432/covate_e2e npm run test:ops
// Skipped when unset. It applies db/schema.sql (twice: it must be idempotent), creates
// and deletes three users, and empties ops_window and ops_read_audit. It refuses any
// database that isn't on this machine.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { after, before, describe, it } from "node:test";
import postgres from "postgres";

const DATABASE_URL = process.env.OPS_E2E_DATABASE_URL;
const skip = !DATABASE_URL ? "set OPS_E2E_DATABASE_URL" : false;

if (DATABASE_URL && !["localhost", "127.0.0.1", "[::1]"].includes(new URL(DATABASE_URL).hostname)) {
  throw new Error("OPS_E2E_DATABASE_URL must be a local throwaway database");
}

const TOKEN = "e".repeat(40);
const ACTOR = "ops-e2e";
const PRODUCT_TABLES = ["platform_user", "learning_session", "quiz_answer", "topic_progress", "ingest_window"];
const ACCOUNT_FIELDS = [
  "answers",
  "created_at",
  "email",
  "github_login",
  "id",
  "last_synced_at",
  "name",
  "plan",
  "sessions",
  "updated_at",
];

type Handler = (req: Request, ctx: { params: Promise<Record<string, unknown>> }) => Promise<Response>;
type User = { id: string; sync_token: string };

describe("ops surface on Postgres", { skip }, () => {
  let sql: ReturnType<typeof postgres>;
  let alice: User;
  let aliceWork: User;
  let bob: User;
  let before0: Record<string, unknown>;
  let routes: { lookup: Handler; user: Handler; rest: Handler };
  let requestNo = 0;

  async function call(handler: Handler, method: string, path: string, body?: unknown, params: Record<string, unknown> = {}) {
    const headers = new Headers({
      authorization: `Bearer ${TOKEN}`,
      "x-ops-actor": ACTOR,
      "x-request-id": `e2e-${++requestNo}`,
    });
    if (body !== undefined) headers.set("content-type", "application/json");
    const req = new Request(`http://127.0.0.1/api/ops/v1${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const res = await handler(req, { params: Promise.resolve(params) });
    const text = await res.text();
    return { status: res.status, body: JSON.parse(text), text };
  }

  const lookup = (email: string) => call(routes.lookup, "POST", "/users/lookup", { email });
  const read = (id: string) => call(routes.user, "GET", `/users/${id}`, undefined, { id });

  /** Row count and a digest of every row, per product table. */
  async function snapshot() {
    const out: Record<string, unknown> = {};
    for (const table of PRODUCT_TABLES) {
      const [row] = await sql.unsafe(
        `select count(*)::int as n, coalesce(md5(string_agg(t::text, '|' order by t::text)), '') as digest from ${table} t`,
      );
      out[table] = row;
    }
    return out;
  }

  async function auditRows() {
    return sql<{ actor: string; request_id: string; action: string; target: string | null; user_ids: string[] }[]>`
      select actor, request_id, action, target, user_ids::text[] as user_ids from ops_read_audit order by id`;
  }

  async function makeUser(login: string, email: string, plan: "free" | "paid"): Promise<User> {
    const [user] = await sql<User[]>`
      insert into platform_user (github_id, github_login, email, name, plan)
      values (${-Math.floor(Math.random() * 1e12)}, ${login}, ${email}, ${login}, ${plan})
      returning id, sync_token`;
    return user;
  }

  before(async () => {
    process.env.DATABASE_URL = DATABASE_URL;
    process.env.OPS_TOKEN = TOKEN;
    delete process.env.OPS_READS_PER_DAY;
    sql = postgres(DATABASE_URL!, { max: 1, onnotice: () => {} });
    const schema = readFileSync(new URL("./db/schema.sql", import.meta.url), "utf8");
    await sql.unsafe(schema);
    await sql.unsafe(schema);
    await sql`delete from ops_window`;
    await sql`delete from ops_read_audit`;

    alice = await makeUser("ops-e2e-alice", "Alice.Ops@Example.com", "paid");
    aliceWork = await makeUser("ops-e2e-alice-work", "alice.ops@example.com", "free");
    bob = await makeUser("ops-e2e-bob", "bob.ops@example.org", "free");
    const [session] = await sql<{ id: string }[]>`
      insert into learning_session (user_id, client_id, question_count, correct_count)
      values (${alice.id}, 'ops-e2e-1', 2, 1) returning id`;
    for (const correct of [true, false]) {
      await sql`
        insert into quiz_answer (session_id, user_id, question, is_correct, topic)
        values (${session.id}, ${alice.id}, 'q', ${correct}, 'sql')`;
    }

    routes = {
      lookup: (await import("./app/api/ops/v1/users/lookup/route")).POST as Handler,
      user: (await import("./app/api/ops/v1/users/[id]/route")).GET as Handler,
      rest: (await import("./app/api/ops/v1/[[...rest]]/route")).POST as Handler,
    };
    before0 = await snapshot();
  });

  after(async () => {
    if (!sql) return;
    for (const user of [alice, aliceWork, bob]) {
      if (user) await sql`delete from platform_user where id = ${user.id}`;
    }
    await sql`delete from ops_window`;
    await sql`delete from ops_read_audit`;
    await sql.end();
  });

  it("the schema applied twice: the ops tables exist", async () => {
    const [row] = await sql`select to_regclass('ops_window')::text as w, to_regclass('ops_read_audit')::text as a`;
    assert.deepEqual({ ...row }, { w: "ops_window", a: "ops_read_audit" });
  });

  it("finds every account with the address, case-insensitively, with named fields only", async () => {
    const res = await lookup("  ALICE.OPS@example.COM ");
    assert.equal(res.status, 200, res.text);
    assert.deepEqual(
      res.body.data.map((u: { id: string }) => u.id),
      [alice.id, aliceWork.id],
    );
    for (const user of res.body.data) assert.deepEqual(Object.keys(user).sort(), ACCOUNT_FIELDS);
    const [first, second] = res.body.data;
    assert.equal(first.email, "Alice.Ops@Example.com");
    assert.equal(first.plan, "paid");
    assert.equal(first.sessions, 1);
    assert.equal(first.answers, 2);
    assert.ok(!Number.isNaN(Date.parse(first.last_synced_at)), first.last_synced_at);
    assert.equal(second.sessions, 0);
    assert.equal(second.answers, 0);
    assert.equal(second.last_synced_at, null);
    for (const user of [alice, aliceWork, bob]) assert.ok(!res.text.includes(user.sync_token), "a sync token left");
  });

  it("is an equality, not a substring or prefix match", async () => {
    for (const email of ["lice.ops@example.com", "alice.ops@example.co", "alice.ops@example.com.au", "alice_ops@example.com"]) {
      const res = await lookup(email);
      assert.equal(res.status, 404, `${email}: ${res.text}`);
      assert.equal(res.body.error.code, "user_not_found");
    }
  });

  it("nobody found: the audit keeps a digest, the address appears nowhere", async () => {
    const res = await lookup("Nobody.Ops@Example.net");
    assert.equal(res.status, 404);
    assert.equal(res.body.error.code, "user_not_found");
    const last = (await auditRows()).at(-1)!;
    const digest = createHash("sha256").update("nobody.ops@example.net").digest("hex");
    assert.deepEqual({ ...last }, { actor: ACTOR, request_id: `e2e-${requestNo}`, action: "users.lookup", target: `sha256:${digest}`, user_ids: [] });
    const [{ n }] = await sql`select count(*)::int as n from ops_read_audit a where lower(a::text) like '%nobody%'`;
    assert.equal(n, 0);
  });

  it("reads one account by id; an unknown id is user_not_found", async () => {
    const res = await read(bob.id.toUpperCase());
    assert.equal(res.status, 200, res.text);
    assert.equal(res.body.data.id, bob.id);
    assert.deepEqual(Object.keys(res.body.data).sort(), ACCOUNT_FIELDS);
    assert.ok(!res.text.includes(bob.sync_token));
    const missing = await read("00000000-0000-4000-8000-000000000000");
    assert.equal(missing.status, 404);
    assert.equal(missing.body.error.code, "user_not_found");
  });

  it("the console's writes are 404 and change nothing", async () => {
    for (const [path, body] of [
      [`/users/${alice.id}/plan`, { plan: "free", days: 30, reason: "e2e" }],
      [`/users/${alice.id}/block`, { blocked: true, reason: "e2e" }],
      [`/users/${alice.id}/quota`, { limit: 1, window: "day", reason: "e2e" }],
      [`/users/${alice.id}/credits`, { delta: 5, reason: "e2e" }],
      ["/pools/default/reset", { reason: "e2e" }],
    ] as const) {
      const res = await call(routes.rest, "POST", path, body, { rest: path.split("/").slice(1) });
      assert.equal(res.status, 404, `${path}: ${res.text}`);
      assert.equal(res.body.error.code, "not_found");
    }
    const [row] = await sql`select plan from platform_user where id = ${alice.id}`;
    assert.equal(row.plan, "paid");
  });

  it("no product table changed; each read left exactly one audit row", async () => {
    assert.deepEqual(await snapshot(), before0);
    const rows = await auditRows();
    assert.deepEqual(
      rows.map((r) => [r.action, r.request_id]),
      [
        ["users.lookup", "e2e-1"],
        ["users.lookup", "e2e-2"],
        ["users.lookup", "e2e-3"],
        ["users.lookup", "e2e-4"],
        ["users.lookup", "e2e-5"],
        ["users.lookup", "e2e-6"],
        ["users.read", "e2e-7"],
        ["users.read", "e2e-8"],
      ],
    );
    assert.ok(rows.every((r) => r.actor === ACTOR));
    assert.deepEqual(rows[0].user_ids, [alice.id, aliceWork.id]);
    assert.equal(rows[0].target, null);
    assert.deepEqual({ target: rows[6].target, user_ids: rows[6].user_ids }, { target: bob.id, user_ids: [bob.id] });
  });

  it("counts reads in the minute and the day, shared by every instance", async () => {
    await sql`delete from ops_window`;
    await read(bob.id);
    await read(bob.id);
    const counters = await sql`select bucket, requests from ops_window order by bucket`;
    // Two reads, unless the minute (or the day) rolled over between them.
    for (const row of counters) assert.ok(row.requests === 2 || row.requests === 1, JSON.stringify(row));
    assert.deepEqual(
      counters.map((r) => r.bucket),
      ["day", "minute"],
    );
  });

  it("the 61st read in a minute is refused and reads nothing", async () => {
    // This minute and the next, so a minute boundary mid-test cannot reset it.
    await sql`
      insert into ops_window (bucket, window_start, requests)
      values ('minute', date_trunc('minute', now()), 60), ('minute', date_trunc('minute', now()) + interval '1 minute', 60)
      on conflict (bucket, window_start) do update set requests = 60`;
    const audited = (await auditRows()).length;
    const res = await lookup("alice.ops@example.com");
    assert.equal(res.status, 429, res.text);
    assert.equal(res.body.error.code, "rate_limited");
    assert.equal((await auditRows()).length, audited);
    await sql`delete from ops_window where bucket = 'minute'`;
  });

  it("past the day's reads, refused", async () => {
    await sql`
      insert into ops_window (bucket, window_start, requests)
      values ('day', date_trunc('day', now()), 500), ('day', date_trunc('day', now()) + interval '1 day', 500)
      on conflict (bucket, window_start) do update set requests = 500`;
    const res = await read(bob.id);
    assert.equal(res.status, 429, res.text);
    assert.equal(res.body.error.code, "daily_read_limit");
    await sql`delete from ops_window`;
  });
});
