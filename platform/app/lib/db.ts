import postgres from "postgres";

// Single Postgres client for the platform's serverless routes. DATABASE_URL is a
// Vercel env var pointing at the Covate database on Neon; guarded so
// build/typecheck don't need it.
//
// It must be Neon's *pooled* connection string (the `-pooler` host): each Vercel
// invocation is its own short-lived process, so a direct connection per request
// would exhaust the database's connection slots. The pooler runs in transaction
// mode, so a connection can be handed to a different backend between statements;
// `prepare: false` keeps the driver from relying on a prepared statement that the
// next backend has never seen.
let _sql: ReturnType<typeof postgres> | null = null;

// Only a local development database is loopback. Every hosted database resolves
// to a real hostname, so production always takes the verified-TLS branch.
function isLoopback(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
  } catch {
    return false;
  }
}

export function db() {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  _sql = postgres(url, {
    prepare: false,
    // One socket per warm instance; Vercel gives concurrency by adding instances.
    max: 1,
    idle_timeout: 20,
    // Neon scales the compute to zero after 5 idle minutes; the first query after
    // that waits for it to start, which is usually well under a second.
    connect_timeout: 10,
    // Verify the chain and the hostname. Neon's certificate is issued by a public
    // CA that Node already trusts, so nothing is pinned. This option wins over any
    // `sslmode` in the URL (postgres.js reads the URL's only when this is unset).
    ssl: isLoopback(url) ? false : "verify-full",
  });
  return _sql;
}
