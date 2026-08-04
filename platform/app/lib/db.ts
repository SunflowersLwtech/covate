import { neon } from "@neondatabase/serverless";

// Single Neon (Postgres) HTTP client for the platform's serverless routes.
// DATABASE_URL is a Vercel env var, wired to the Covate platform's Neon database
// (provisioned separately — see PLATFORM.md). Guarded so build/typecheck don't need it.
let _sql: ReturnType<typeof neon> | null = null;

export function db() {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  _sql = neon(url);
  return _sql;
}
