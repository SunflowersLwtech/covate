// Unit tests for the ops surface (app/api/ops/v1, app/lib/ops.ts). Run with
// `npm run test:ops` (node:test via tsx). The database is a recording fake, so these
// also prove what never reaches it; ops.e2e.test.ts runs the same routes on Postgres.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join, relative, sep } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { setOpsSqlForTests } from "./app/lib/ops";

const require = createRequire(import.meta.url);
// Next's own route ordering and matching, so the tests resolve a path to a route file
// the way the server does: static segments first, then [id], then the catch-all.
const { getSortedRoutes } = require("next/dist/shared/lib/router/utils/sorted-routes") as {
  getSortedRoutes: (routes: string[]) => string[];
};
const { getRouteRegex } = require("next/dist/shared/lib/router/utils/route-regex") as {
  getRouteRegex: (route: string) => { re: RegExp };
};

const TOKEN = "t".repeat(40);
const ALICE = "6f1c2d3e-4a5b-4c6d-8e7f-0a1b2c3d4e5f";
const SYNC_TOKEN = "f00dfeedf00dfeedf00dfeedf00dfeedf00dfeedf00dfeed";
const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] as const;
type Method = (typeof METHODS)[number];

// ── the fake database ──────────────────────────────────────────────────────────

type Call = { text: string; values: unknown[] };
type Responder = (text: string, values: unknown[]) => unknown[] | Error;

let calls: Call[] = [];
let respond: Responder = () => [];

function fakeSql(strings: TemplateStringsArray, ...values: unknown[]) {
  const text = strings.join("$").replace(/\s+/g, " ").trim();
  calls.push({ text, values });
  const result = respond(text, values);
  return result instanceof Error ? Promise.reject(result) : Promise.resolve(result);
}

function aliceRow(overrides: Record<string, unknown> = {}) {
  return {
    id: ALICE,
    email: "Alice@Example.com",
    name: "Alice",
    github_login: "alice",
    plan: "paid",
    created_at: new Date("2026-08-04T10:00:00Z"),
    updated_at: new Date("2026-10-01T10:00:00Z"),
    sessions: 3,
    answers: 12,
    last_synced_at: new Date("2026-10-20T01:02:03Z"),
    // A driver row may carry more than the query named; none of it may leave.
    sync_token: SYNC_TOKEN,
    avatar_url: "https://avatars.example/alice",
    ...overrides,
  };
}

/** The usual database: counters at 1 read, `rows` for the account query. */
function database(rows: unknown[], counters = { minute: 1, day: 1 }): Responder {
  return (text) => {
    if (text.startsWith("insert into ops_window")) {
      return [
        { bucket: "minute", requests: counters.minute },
        { bucket: "day", requests: counters.day },
      ];
    }
    if (text.startsWith("select u.id")) return rows;
    return [];
  };
}

const ofKind = (prefix: string) => calls.filter((c) => c.text.startsWith(prefix));

// ── routing, as Next does it ───────────────────────────────────────────────────

const APP = fileURLToPath(new URL("./app", import.meta.url));
const OPS_DIR = join(APP, "api", "ops", "v1");

function routeFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return routeFiles(full);
    return entry.name === "route.ts" ? [full] : [];
  });
}

const ROUTES = new Map(
  routeFiles(OPS_DIR).map((file) => [`/${relative(APP, file).split(sep).slice(0, -1).join("/")}`, file]),
);
const SORTED = getSortedRoutes([...ROUTES.keys()]);

/** The route file Next would run for this path, and its params. */
function resolve(path: string): { route: string; file: string; params: Record<string, string> } {
  const pathname = new URL(path, "http://x").pathname;
  for (const route of SORTED) {
    const match = getRouteRegex(route).re.exec(pathname);
    if (!match) continue;
    const params: Record<string, string> = {};
    const names = [...route.matchAll(/\[\[?(?:\.\.\.)?([^\]]+)\]\]?/g)].map((m) => m[1]);
    names.forEach((name, i) => {
      if (match[i + 1] !== undefined) params[name] = decodeURIComponent(match[i + 1]);
    });
    return { route, file: ROUTES.get(route)!, params };
  }
  throw new Error(`no ops route serves ${pathname}`);
}

type Handler = (req: Request, ctx: { params: Promise<Record<string, unknown>> }) => Promise<Response>;

async function send(
  method: Method,
  path: string,
  init: { token?: string | null; actor?: string | null; body?: unknown; raw?: string; headers?: Record<string, string> } = {},
): Promise<{ status: number; body: any; text: string; headers: Headers }> {
  const full = `/api/ops/v1${path}`;
  const { file, params } = resolve(full);
  const mod = (await import(pathToFileURL(file).href)) as Record<string, unknown>;
  const handler = mod[method] as Handler | undefined;
  // Next answers 405 for a method the route file does not export.
  assert.equal(typeof handler, "function", `${relative(APP, file)} exports no ${method}: Next would answer 405`);
  const headers = new Headers(init.headers);
  const token = init.token === undefined ? TOKEN : init.token;
  if (token !== null) headers.set("authorization", `Bearer ${token}`);
  const actor = init.actor === undefined ? "weiliu" : init.actor;
  if (actor !== null) headers.set("x-ops-actor", actor);
  headers.set("x-request-id", "req-1");
  let body: string | undefined;
  if (init.raw !== undefined) body = init.raw;
  else if (init.body !== undefined) body = JSON.stringify(init.body);
  if (body !== undefined) headers.set("content-type", "application/json");
  const req = new Request(`http://127.0.0.1${full}`, { method, headers, body });
  // The catch-all's param is an array in Next; the handlers that read params take a string.
  const res = await handler!(req, { params: Promise.resolve(params) });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null, text, headers: res.headers };
}

function assertError(res: { status: number; body: any }, status: number, code: string) {
  assert.equal(res.status, status, JSON.stringify(res.body));
  assert.equal(res.body.ok, false);
  assert.equal(res.body.error.code, code);
  assert.equal(typeof res.body.error.message, "string");
}

const lookup = (email: unknown, init: Parameters<typeof send>[2] = {}) =>
  send("POST", "/users/lookup", { body: { email }, ...init });

// The writes and listings the console can ask for (products-admin src/adapters/http.ts),
// plus every other method on the routes that do exist.
const NOT_OFFERED: [Method, string][] = [
  ["POST", `/users/${ALICE}/plan`],
  ["POST", `/users/${ALICE}/block`],
  ["POST", `/users/${ALICE}/quota`],
  ["POST", `/users/${ALICE}/credits`],
  ["POST", "/pools/default/reset"],
  ["GET", "/pools"],
  ["GET", "/pools?day=2026-10-29"],
  ["POST", `/users/${ALICE}`],
  ["PUT", `/users/${ALICE}`],
  ["PATCH", `/users/${ALICE}`],
  ["DELETE", `/users/${ALICE}`],
  ["OPTIONS", `/users/${ALICE}`],
  ["GET", "/users/lookup"],
  ["PUT", "/users/lookup"],
  ["DELETE", "/users/lookup"],
  ["OPTIONS", "/users/lookup"],
  ["POST", "/health"],
  ["DELETE", "/health"],
  ["GET", "/users"],
  ["GET", ""],
  ["GET", "/"],
  ["POST", "/anything/else"],
];

beforeEach(() => {
  process.env.OPS_TOKEN = TOKEN;
  delete process.env.OPS_READS_PER_DAY;
  calls = [];
  respond = database([aliceRow()]);
  setOpsSqlForTests(() => fakeSql as never);
});

afterEach(() => {
  setOpsSqlForTests(null);
  delete process.env.OPS_TOKEN;
  delete process.env.OPS_READS_PER_DAY;
});

// ── tests ──────────────────────────────────────────────────────────────────────

describe("ops: the route table", () => {
  it("has the three reads and one catch-all, in Next's order", () => {
    assert.deepEqual(SORTED, [
      "/api/ops/v1/health",
      "/api/ops/v1/users/lookup",
      "/api/ops/v1/users/[id]",
      "/api/ops/v1/[[...rest]]",
    ]);
  });

  it("every route file answers every method itself, so Next never answers 405", async () => {
    for (const file of ROUTES.values()) {
      const mod = (await import(pathToFileURL(file).href)) as Record<string, unknown>;
      for (const method of METHODS) {
        assert.equal(typeof mod[method], "function", `${relative(APP, file)} ${method}`);
      }
    }
  });
});

describe("ops: the token comes before anything else", () => {
  const EVERY_ROUTE: [Method, string, unknown?][] = [
    ["GET", "/health"],
    ["POST", "/users/lookup", { email: "alice@example.com" }],
    ["GET", `/users/${ALICE}`],
    ["POST", `/users/${ALICE}/plan`, { plan: "paid", days: 30, reason: "x" }],
    ["GET", "/pools"],
  ];

  it("is off (503 ops_disabled) when OPS_TOKEN is unset or shorter than 32 characters", async () => {
    for (const value of [undefined, "", " ".repeat(40), "s".repeat(31), ` ${"s".repeat(31)} `]) {
      if (value === undefined) delete process.env.OPS_TOKEN;
      else process.env.OPS_TOKEN = value;
      for (const [method, path, body] of EVERY_ROUTE) {
        // Even the right-looking token cannot open a surface that is off.
        assertError(await send(method, path, { body, token: value?.trim() || "x" }), 503, "ops_disabled");
      }
    }
    assert.equal(calls.length, 0, "a disabled surface touched the database");
  });

  it("refuses a missing, wrong or malformed token with 401, and never reaches the database", async () => {
    const wrong = [null, "", "nope", TOKEN.slice(0, -1), `${TOKEN}x`, TOKEN.toUpperCase()];
    for (const token of wrong) {
      for (const [method, path, body] of EVERY_ROUTE) {
        assertError(await send(method, path, { body, token }), 401, "unauthorized");
      }
    }
    for (const authorization of [`Basic ${TOKEN}`, `Bearer ${TOKEN} extra`, TOKEN, `Bearer`]) {
      assertError(await send("GET", "/health", { token: null, headers: { authorization } }), 401, "unauthorized");
    }
    // A fragment that would be a 400 and an id that would be a 404 are still 401 first.
    assertError(await lookup("@example.com", { token: "nope" }), 401, "unauthorized");
    assertError(await send("GET", "/users/not-a-uuid", { token: "nope" }), 401, "unauthorized");
    assert.equal(calls.length, 0, "an unauthenticated request touched the database");
  });

  it("accepts the bearer scheme in any case", async () => {
    const res = await send("GET", "/health", { token: null, headers: { authorization: `bearer ${TOKEN}` } });
    assert.equal(res.status, 200);
  });
});

describe("ops: health", () => {
  it("says what the surface does and which build it runs, without touching the database", async () => {
    process.env.COVATE_BUILD_SHA = "0123456789ab";
    try {
      const res = await send("GET", "/health", { actor: null });
      assert.equal(res.status, 200);
      assert.equal(res.body.ok, true);
      assert.equal(res.body.data.product, "covate");
      assert.equal(res.body.data.release, "0123456789ab");
      assert.deepEqual(res.body.data.capabilities, ["users.search", "users.read"]);
      assert.deepEqual(res.body.data.read_limits, { per_minute: 60, per_day: 500 });
      assert.equal(res.headers.get("cache-control"), "no-store");
      assert.equal(calls.length, 0);
    } finally {
      delete process.env.COVATE_BUILD_SHA;
    }
  });
});

describe("ops: writes and everything else under /api/ops/v1 answer 404", () => {
  for (const [method, path] of NOT_OFFERED) {
    it(`${method} ${path || "(base)"}`, async () => {
      const res = await send(method, path, { body: method === "GET" || method === "OPTIONS" ? undefined : { reason: "x", plan: "paid", days: 30, blocked: true, delta: 5, limit: 9, window: "day" } });
      assertError(res, 404, "not_found");
      assert.equal(calls.length, 0, "a refused route touched the database");
    });
  }

  it("never with a code the console reads as 'nobody found'", async () => {
    for (const [method, path] of NOT_OFFERED) {
      const res = await send(method, path, { body: method === "GET" || method === "OPTIONS" ? undefined : { reason: "x" } });
      assert.ok(!["user_not_found", "invalid_user_id"].includes(res.body.error.code), `${method} ${path}`);
    }
  });

  it("still asks for the token first", async () => {
    for (const [method, path] of NOT_OFFERED) {
      assertError(await send(method, path, { token: "nope" }), 401, "unauthorized");
    }
  });
});

describe("ops: POST /users/lookup", () => {
  it("answers the accounts with exactly this address, case-insensitively, and never the sync token", async () => {
    const res = await lookup("  ALICE@example.COM ");
    assert.equal(res.status, 200, res.text);
    assert.deepEqual(res.body, {
      ok: true,
      data: [
        {
          id: ALICE,
          email: "Alice@Example.com",
          name: "Alice",
          github_login: "alice",
          plan: "paid",
          created_at: "2026-08-04T10:00:00.000Z",
          updated_at: "2026-10-01T10:00:00.000Z",
          sessions: 3,
          answers: 12,
          last_synced_at: "2026-10-20T01:02:03.000Z",
        },
      ],
    });
    assert.ok(!res.text.includes(SYNC_TOKEN), "the sync token left the server");
    assert.ok(!res.text.includes("sync_token"));
    const [select] = ofKind("select u.id");
    assert.ok(select.text.includes("where lower(u.email) = $"), select.text);
    assert.ok(!/\blike\b|ilike|~/i.test(select.text), "the lookup must be an equality");
    assert.ok(!select.text.includes("sync_token"), "the query reads the sync token");
    assert.deepEqual(select.values, ["alice@example.com", 10]);
  });

  it("answers every account sharing the address (email is not unique)", async () => {
    const BOB = "0b0b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b0b";
    respond = database([aliceRow(), aliceRow({ id: BOB, github_login: "alice-work" })]);
    const res = await lookup("alice@example.com");
    assert.equal(res.status, 200);
    assert.deepEqual(
      res.body.data.map((u: { id: string }) => u.id),
      [ALICE, BOB],
    );
    const [insert] = ofKind("insert into ops_read_audit");
    assert.deepEqual(insert.values, ["weiliu", "req-1", "users.lookup", null, `{${ALICE},${BOB}}`]);
  });

  it("refuses fragments and wildcards with 400 before the database", async () => {
    for (const email of [
      "alice",
      "@example.com",
      "alice@",
      "example.com",
      "alice@example",
      "%@example.com",
      "a%@example.com",
      "*@example.com",
      "alice@*.com",
      "alice@@example.com",
      "al ice@example.com",
      `${"a".repeat(250)}@example.com`,
    ]) {
      assertError(await lookup(email), 400, "invalid_email");
    }
    for (const email of [undefined, null, 42, ["alice@example.com"], { $ne: "" }]) {
      assertError(await lookup(email), 400, "email_required");
    }
    assertError(await send("POST", "/users/lookup", { raw: "not json" }), 400, "invalid_body");
    assertError(await send("POST", "/users/lookup", { raw: "" }), 400, "invalid_body");
    assertError(
      await send("POST", "/users/lookup", { raw: JSON.stringify({ email: "alice@example.com", pad: "x".repeat(5000) }) }),
      400,
      "invalid_body",
    );
    assert.equal(calls.length, 0, "a refused lookup touched the database");
  });

  it("needs X-Ops-Actor, for the audit", async () => {
    for (const actor of [null, "", "   ", "a".repeat(65), "tab\there"]) {
      assertError(await lookup("alice@example.com", { actor }), 400, "actor_required");
    }
    assert.equal(calls.length, 0);
  });

  it("nobody found: 404 user_not_found, audited as a digest of the address, never the address", async () => {
    respond = database([]);
    const res = await lookup("Nobody@Example.net");
    assertError(res, 404, "user_not_found");
    const [insert] = ofKind("insert into ops_read_audit");
    assert.ok(insert, "a lookup that found nobody left no trace");
    const digest = createHash("sha256").update("nobody@example.net").digest("hex");
    assert.deepEqual(insert.values, ["weiliu", "req-1", "users.lookup", `sha256:${digest}`, "{}"]);
    for (const c of calls.filter((c) => !c.text.startsWith("select u.id"))) {
      assert.ok(!JSON.stringify(c.values).toLowerCase().includes("nobody@example.net"), c.text);
    }
  });

  it("someone found: the audit names the accounts the answer showed", async () => {
    await lookup("alice@example.com");
    const [insert] = ofKind("insert into ops_read_audit");
    assert.deepEqual(insert.values, ["weiliu", "req-1", "users.lookup", null, `{${ALICE}}`]);
  });

  it("an answer that could not be audited is not given", async () => {
    respond = (text, values) =>
      text.startsWith("insert into ops_read_audit") ? new Error("audit insert failed") : database([aliceRow()])(text, values);
    const res = await lookup("alice@example.com");
    assertError(res, 500, "internal_error");
    assert.ok(!res.text.toLowerCase().includes("alice"), "data left without an audit row");
    assert.ok(!res.text.includes("audit insert failed"), "internal error text leaked");
  });

  it("does not leak a database error's text", async () => {
    respond = () => new Error('relation "platform_user" does not exist at alice@example.com');
    const res = await lookup("alice@example.com");
    assertError(res, 500, "internal_error");
    assert.ok(!res.text.includes("relation"), res.text);
  });
});

describe("ops: GET /users/{id}", () => {
  it("answers one account by uuid, never the sync token", async () => {
    const res = await send("GET", `/users/${ALICE.toUpperCase()}`);
    assert.equal(res.status, 200, res.text);
    assert.equal(res.body.data.id, ALICE);
    assert.equal(res.body.data.plan, "paid");
    assert.ok(!res.text.includes(SYNC_TOKEN));
    assert.ok(!("sync_token" in res.body.data));
    const [select] = ofKind("select u.id");
    assert.deepEqual(select.values, [ALICE], "the id is matched lowercased");
    const [insert] = ofKind("insert into ops_read_audit");
    assert.deepEqual(insert.values, ["weiliu", "req-1", "users.read", ALICE, `{${ALICE}}`]);
  });

  it("a malformed id is 404 invalid_user_id, before the database", async () => {
    for (const id of ["abc", "123", ALICE.replaceAll("-", ""), `${ALICE}0`, "alice@example.com", "%2e%2e"]) {
      assertError(await send("GET", `/users/${encodeURIComponent(id)}`), 404, "invalid_user_id");
    }
    assert.equal(calls.length, 0);
  });

  it("an unknown id is 404 user_not_found, and the read is audited", async () => {
    respond = database([]);
    assertError(await send("GET", `/users/${ALICE}`), 404, "user_not_found");
    const [insert] = ofKind("insert into ops_read_audit");
    assert.deepEqual(insert.values, ["weiliu", "req-1", "users.read", ALICE, "{}"]);
  });
});

describe("ops: read limits", () => {
  it("every read is counted before the account query", async () => {
    await lookup("alice@example.com");
    await send("GET", `/users/${ALICE}`);
    const order = calls.map((c) => c.text.split(" ").slice(0, 3).join(" "));
    assert.deepEqual(order, [
      "insert into ops_window",
      "delete from ops_window",
      "delete from ops_read_audit",
      "select u.id, u.email,",
      "insert into ops_read_audit",
      "insert into ops_window",
      "delete from ops_window",
      "delete from ops_read_audit",
      "select u.id, u.email,",
      "insert into ops_read_audit",
    ]);
  });

  it("the 61st read in a minute is 429 rate_limited, and reads nothing", async () => {
    respond = database([aliceRow()], { minute: 61, day: 61 });
    for (const res of [await lookup("alice@example.com"), await send("GET", `/users/${ALICE}`)]) {
      assertError(res, 429, "rate_limited");
      const retry = Number(res.headers.get("retry-after"));
      assert.ok(retry >= 1 && retry <= 60, String(retry));
    }
    assert.equal(ofKind("select u.id").length, 0);
    assert.equal(ofKind("insert into ops_read_audit").length, 0);
  });

  it("the 60th read in a minute still answers", async () => {
    respond = database([aliceRow()], { minute: 60, day: 60 });
    assert.equal((await lookup("alice@example.com")).status, 200);
  });

  it("past OPS_READS_PER_DAY (default 500) reads are 429 daily_read_limit", async () => {
    respond = database([aliceRow()], { minute: 5, day: 501 });
    assertError(await lookup("alice@example.com"), 429, "daily_read_limit");
    respond = database([aliceRow()], { minute: 5, day: 500 });
    assert.equal((await lookup("alice@example.com")).status, 200);
    process.env.OPS_READS_PER_DAY = "0";
    respond = database([aliceRow()], { minute: 1, day: 1 });
    assertError(await send("GET", `/users/${ALICE}`), 429, "daily_read_limit");
    process.env.OPS_READS_PER_DAY = "nonsense";
    assert.equal((await send("GET", `/users/${ALICE}`)).status, 200, "an unreadable setting falls back to 500");
  });

  it("past windows are deleted only when a new one starts", async () => {
    respond = database([aliceRow()], { minute: 2, day: 2 });
    await lookup("alice@example.com");
    assert.equal(ofKind("delete from").length, 0);
  });
});
