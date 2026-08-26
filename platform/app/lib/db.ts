import postgres from "postgres";

// Single Postgres client for the platform's serverless routes. DATABASE_URL is a
// Vercel env var pointing at the Covate database on Supabase; guarded so
// build/typecheck don't need it.
//
// It must be the *transaction* pooler string (port 6543): each Vercel invocation is
// its own short-lived process, so a direct connection per request would exhaust the
// database's connection slots. Transaction pooling in turn forbids prepared
// statements, hence `prepare: false` — without it every query fails once a
// connection is reused for a different statement.
let _sql: ReturnType<typeof postgres> | null = null;

export function db() {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  _sql = postgres(url, {
    prepare: false,
    // One socket per warm instance; Vercel gives concurrency by adding instances.
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    // Encrypt, but don't verify: Supabase's pooler presents a self-signed chain.
    ssl: "require",
  });
  return _sql;
}
