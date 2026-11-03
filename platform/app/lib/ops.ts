import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { BlockList, isIP } from "node:net";
import { db } from "./db";

// The products console's door into covate: `/api/ops/v1` (app/api/ops/v1).
//
// Read-only. covate is being folded into FoldRender, so the console only gets to
// find an account by its whole email address or its id and see its plan; there is
// no write route of any kind, and every other path or method under /api/ops/v1
// answers 404 (not 405), so a console that asks for a write learns it does not exist.
//
// Only the console host's own address may call it (`checkSource`, env
// `OPS_ALLOWED_IPS`), checked before anything else, so a token that leaks is no use
// from anywhere else. The console holds this surface's own token (Vercel env
// `OPS_TOKEN`, 32+ characters, or the surface is off: 503), checked next: an
// unauthenticated request never reaches the database, so it cannot wake Neon.
//
// Reads of personal data leave a row in ops_read_audit (who asked, for what, which
// accounts the answer showed; an address that matched nobody is kept only as a
// sha256). Every read is also counted in ops_window: at most 60 a minute and
// OPS_READS_PER_DAY (default 500) a day for the whole surface. There is one token,
// so the surface's limit is the token's limit.

export const CAPABILITIES = ["users.search", "users.read"] as const;

const MIN_TOKEN_LENGTH = 32;
const READS_PER_MINUTE = 60;
const DEFAULT_READS_PER_DAY = 500;
const MAX_BODY_BYTES = 4096;
const MAX_ACCOUNTS = 10;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// A whole address: something, one @, a domain with a dot. `%` and `*` are refused so
// nobody mistakes the lookup for a pattern match (it is an equality either way).
const WHOLE_EMAIL = /^[^\s@%*]+@[^\s@%*]+\.[^\s@%*]+$/;
// Printable ASCII: the console's actor names are 1-64 characters and travel in a header.
const ACTOR = /^[\x20-\x7e]{1,64}$/;

class OpsError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string = code,
    readonly retryAfter?: number,
  ) {
    super(message);
  }
}

function refuse(status: number, code: string, message?: string, retryAfter?: number): never {
  throw new OpsError(status, code, message, retryAfter);
}

type Sql = ReturnType<typeof db>;
let sqlSource: () => Sql = db;

/** Tests hand in a fake client; everything else uses lib/db. */
export function setOpsSqlForTests(source: (() => Sql) | null): void {
  sqlSource = source ?? db;
}

function sql(): Sql {
  try {
    return sqlSource();
  } catch {
    refuse(503, "not_configured", "the database is not configured");
  }
}

const sha256 = (text: string) => createHash("sha256").update(text).digest();

/** The console host's public egress (aws-sin's static IPv4 and its IPv6). */
const CONSOLE_ADDRESSES = "43.217.12.182";

function allowedSources(): BlockList {
  const raw = (process.env.OPS_ALLOWED_IPS ?? "").trim() || CONSOLE_ADDRESSES;
  const list = new BlockList();
  for (const entry of raw.split(",").map((part) => part.trim())) {
    const family = isIP(entry);
    // Exact addresses only; an entry that does not parse (a CIDR, a typo) is skipped
    // rather than widening anything.
    if (family && !entry.includes("%")) list.addAddress(entry, family === 6 ? "ipv6" : "ipv4");
  }
  return list;
}

/**
 * The address Vercel saw the request come from. `x-vercel-forwarded-for` is set by
 * Vercel and a visitor's own value is replaced; `x-real-ip` likewise. `x-forwarded-for`
 * is never read: it is the one a proxy (or a visitor, off Vercel) can write. Only the
 * first entry counts.
 */
function sourceOf(req: Request): string {
  const vercel = req.headers.get("x-vercel-forwarded-for");
  return (vercel !== null ? vercel.split(",")[0] : (req.headers.get("x-real-ip") ?? "")).trim();
}

/**
 * Only the console's own addresses (env `OPS_ALLOWED_IPS`, exact IPv4/IPv6,
 * comma-separated; unset means the console host) may use this surface. First of all,
 * before the token: a refused request costs this check and nothing else. Compared as
 * parsed addresses: IPv6 case and zero compression do not matter, and `::ffff:a.b.c.d`
 * is a.b.c.d.
 */
function checkSource(req: Request): void {
  const source = sourceOf(req);
  const family = isIP(source);
  if (!family || source.includes("%") || !allowedSources().check(source, family === 6 ? "ipv6" : "ipv4")) {
    refuse(403, "source_not_allowed", "this address may not use the ops surface");
  }
}

/**
 * Bearer token check, before anything but the source. Compared as digests, so the time taken
 * says nothing about the token or its length.
 */
function checkToken(req: Request): void {
  const expected = (process.env.OPS_TOKEN ?? "").trim();
  if (expected.length < MIN_TOKEN_LENGTH) refuse(503, "ops_disabled", "the ops surface is off");
  const presented = (req.headers.get("authorization") ?? "").match(/^Bearer\s+(\S+)\s*$/i)?.[1] ?? "";
  const same = timingSafeEqual(sha256(presented), sha256(expected));
  if (!presented || !same) refuse(401, "unauthorized");
}

function json(status: number, body: unknown, retryAfter?: number): Response {
  const headers: Record<string, string> = { "Cache-Control": "no-store" };
  if (retryAfter !== undefined) headers["Retry-After"] = String(retryAfter);
  return Response.json(body, { status, headers });
}

/** Every route: source, then token, then the work; failures in the contract's envelope. */
export async function handle(req: Request, work: () => Promise<unknown> | unknown): Promise<Response> {
  try {
    checkSource(req);
    checkToken(req);
    return json(200, { ok: true, data: await work() });
  } catch (error) {
    if (error instanceof OpsError) {
      return json(error.status, { ok: false, error: { code: error.code, message: error.message } }, error.retryAfter);
    }
    // Only the error's class and code: a driver error carries the query's parameters,
    // which here is someone's email address.
    const e = error as { name?: unknown; code?: unknown };
    console.error("ops: internal error", { name: e?.name, code: e?.code });
    return json(500, { ok: false, error: { code: "internal_error", message: "internal error" } });
  }
}

/** Anything under /api/ops/v1 that is not a read this surface offers. */
export function noRoute(req: Request): Promise<Response> {
  return handle(req, () =>
    refuse(404, "not_found", "covate's ops surface is read-only: GET /health, POST /users/lookup, GET /users/{id}"),
  );
}

// ── Reads ────────────────────────────────────────────────────────────────────────

export function health() {
  return {
    product: "covate",
    // Baked in at build time by next.config.ts, the same value /version.json serves.
    release: process.env.COVATE_BUILD_SHA ?? "unknown",
    capabilities: [...CAPABILITIES],
    quota_windows: [],
    read_limits: { per_minute: READS_PER_MINUTE, per_day: readsPerDay() },
  };
}

function readsPerDay(): number {
  const raw = (process.env.OPS_READS_PER_DAY ?? "").trim();
  const n = Number(raw);
  return raw !== "" && Number.isInteger(n) && n >= 0 ? n : DEFAULT_READS_PER_DAY;
}

type Caller = { actor: string; requestId: string };

function caller(req: Request): Caller {
  const actor = (req.headers.get("x-ops-actor") ?? "").trim();
  if (!ACTOR.test(actor)) refuse(400, "actor_required", "send X-Ops-Actor");
  const requestId = (req.headers.get("x-request-id") ?? "").trim().slice(0, 128) || randomUUID();
  return { actor, requestId };
}

async function emailFrom(req: Request): Promise<string> {
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) refuse(400, "invalid_body", "body too large");
  let text: string;
  try {
    text = await req.text();
  } catch {
    refuse(400, "invalid_body", "unreadable body");
  }
  if (Buffer.byteLength(text, "utf8") > MAX_BODY_BYTES) refuse(400, "invalid_body", "body too large");
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    refuse(400, "invalid_body", "send JSON");
  }
  const email = (body as { email?: unknown } | null)?.email;
  if (typeof email !== "string") refuse(400, "email_required", 'send {"email": "<whole address>"}');
  const whole = email.trim();
  if (whole.length > 254 || !WHOLE_EMAIL.test(whole)) {
    refuse(400, "invalid_email", "a whole address: no fragments, no wildcards");
  }
  return whole.toLowerCase();
}

/**
 * Count one read against the minute and the day, in the database so every Vercel
 * instance shares it (the ingest_window pattern). Clock windows: a burst across a
 * minute boundary can see up to twice the per-minute figure.
 */
async function countRead(): Promise<void> {
  const q = sql();
  const rows = (await q`
    insert into ops_window (bucket, window_start, requests)
    values ('minute', date_trunc('minute', now()), 1), ('day', date_trunc('day', now()), 1)
    on conflict (bucket, window_start) do update set requests = ops_window.requests + 1
    returning bucket, requests
  `) as unknown as { bucket: string; requests: number }[];
  const minute = rows.find((r) => r.bucket === "minute")?.requests ?? Infinity;
  const day = rows.find((r) => r.bucket === "day")?.requests ?? Infinity;
  if (minute === 1) {
    await q`
      delete from ops_window
       where (bucket = 'minute' and window_start < date_trunc('minute', now()))
          or (bucket = 'day' and window_start < date_trunc('day', now()))
    `;
  }
  if (day === 1) {
    // The read audit is kept for a year.
    await q`delete from ops_read_audit where at < now() - interval '365 days'`;
  }
  const now = Math.floor(Date.now() / 1000);
  if (minute > READS_PER_MINUTE) refuse(429, "rate_limited", "too many reads this minute", 60 - (now % 60));
  if (day > readsPerDay()) refuse(429, "daily_read_limit", "the surface's reads for today are used up", 86400 - (now % 86400));
}

type AccountRow = {
  id: string;
  email: string | null;
  name: string | null;
  github_login: string;
  plan: string;
  created_at: Date | string;
  updated_at: Date | string;
  sessions: number;
  answers: number;
  last_synced_at: Date | string | null;
};

const iso = (v: Date | string | null | undefined) => (v instanceof Date ? v.toISOString() : v ?? null);

/** What the console sees of an account: named fields only, never the sync token. */
function account(row: AccountRow) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    github_login: row.github_login,
    plan: row.plan,
    created_at: iso(row.created_at),
    updated_at: iso(row.updated_at),
    sessions: row.sessions,
    answers: row.answers,
    last_synced_at: iso(row.last_synced_at),
  };
}

async function audit(c: Caller, action: "users.lookup" | "users.read", target: string | null, ids: string[]) {
  // The ids come from the database's own uuid column; the array literal is assembled
  // as text and cast, the same way the ingest route passes jsonb.
  await sql()`
    insert into ops_read_audit (actor, request_id, action, target, user_ids)
    values (${c.actor}, ${c.requestId}, ${action}, ${target}, ${`{${ids.join(",")}}`}::text::uuid[])
  `;
}

/** POST /users/lookup: the accounts with exactly this address, case-insensitively. */
export async function lookupUsers(req: Request) {
  const who = caller(req);
  const email = await emailFrom(req);
  await countRead();
  const rows = (await sql()`
    select u.id, u.email, u.name, u.github_login, u.plan, u.created_at, u.updated_at,
           s.sessions, s.last_synced_at, a.answers
      from platform_user u
      cross join lateral (
        select count(*)::int as sessions, max(synced_at) as last_synced_at
          from learning_session where user_id = u.id) s
      cross join lateral (select count(*)::int as answers from quiz_answer where user_id = u.id) a
     where lower(u.email) = ${email}
     order by u.created_at
     limit ${MAX_ACCOUNTS}
  `) as unknown as AccountRow[];
  const ids = rows.map((r) => r.id);
  // Nobody found: keep only a digest of the address, never the address itself.
  await audit(who, "users.lookup", ids.length ? null : `sha256:${sha256(email).toString("hex")}`, ids);
  if (rows.length === 0) refuse(404, "user_not_found", "no account has this address");
  return rows.map(account);
}

/** GET /users/{id}: one account by its uuid. */
export async function readUser(req: Request, id: string) {
  const who = caller(req);
  if (!UUID.test(id)) refuse(404, "invalid_user_id", "not a user id");
  const userId = id.toLowerCase();
  await countRead();
  const rows = (await sql()`
    select u.id, u.email, u.name, u.github_login, u.plan, u.created_at, u.updated_at,
           s.sessions, s.last_synced_at, a.answers
      from platform_user u
      cross join lateral (
        select count(*)::int as sessions, max(synced_at) as last_synced_at
          from learning_session where user_id = u.id) s
      cross join lateral (select count(*)::int as answers from quiz_answer where user_id = u.id) a
     where u.id = ${userId}
  `) as unknown as AccountRow[];
  await audit(who, "users.read", userId, rows.map((r) => r.id));
  if (rows.length === 0) refuse(404, "user_not_found", "no such account");
  return account(rows[0]);
}
