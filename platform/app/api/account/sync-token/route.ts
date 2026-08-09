import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "../../../lib/auth";
import { db } from "../../../lib/db";

export const dynamic = "force-dynamic";

// The sync token is the credential the MCP sync client uses to POST to /api/ingest.
// It used to be printed exactly once, inside the dashboard's empty state, and became
// unrecoverable the moment the first session synced. These two handlers fix that:
//   GET  — show me my token again (signed-in session only, never in page HTML)
//   POST — rotate it, which immediately invalidates the old one at /api/ingest
// Both are session-cookie authenticated; the token itself is never accepted as auth here,
// so a leaked token cannot be used to read or rotate itself.

async function currentUser(): Promise<string | null> {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value);
}

function noStore(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  const userId = await currentUser();
  if (!userId) return noStore({ error: "not signed in" }, 401);

  let sql;
  try {
    sql = db();
  } catch {
    return noStore({ error: "platform not configured" }, 503);
  }
  const rows = (await sql`select sync_token from platform_user where id = ${userId}`) as { sync_token: string }[];
  if (!rows[0]) return noStore({ error: "no such user" }, 404);
  return noStore({ token: rows[0].sync_token });
}

export async function POST() {
  const userId = await currentUser();
  if (!userId) return noStore({ error: "not signed in" }, 401);

  let sql;
  try {
    sql = db();
  } catch {
    return noStore({ error: "platform not configured" }, 503);
  }
  // Same shape as the column default, so a rotated token is indistinguishable from a fresh one.
  const rows = (await sql`
    update platform_user
       set sync_token = encode(gen_random_bytes(24), 'hex'),
           updated_at = now()
     where id = ${userId}
    returning sync_token
  `) as { sync_token: string }[];
  if (!rows[0]) return noStore({ error: "no such user" }, 404);
  return noStore({ token: rows[0].sync_token, rotated: true });
}
