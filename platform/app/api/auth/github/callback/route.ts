import { NextRequest, NextResponse } from "next/server";
import {
  authConfigured,
  exchangeCodeForUser,
  OAUTH_STATE_COOKIE,
  SESSION_COOKIE,
  signSession,
} from "../../../../lib/auth";
import { db } from "../../../../lib/db";
import { SITE } from "../../../../layout";

export const dynamic = "force-dynamic";

// GitHub OAuth callback: verify state, exchange the code, upsert the platform_user,
// and set the signed session cookie.
export async function GET(req: NextRequest) {
  if (!authConfigured()) {
    return NextResponse.redirect(`${SITE}/dashboard?error=not_configured`);
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = req.cookies.get(OAUTH_STATE_COOKIE)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(`${SITE}/dashboard?error=bad_state`);
  }

  try {
    const gh = await exchangeCodeForUser(code);

    // Upsert the user by github_id; keep sync_token stable across logins.
    const sql = db();
    const rows = (await sql`
      insert into platform_user (github_id, github_login, email, name, avatar_url)
      values (${gh.id}, ${gh.login}, ${gh.email}, ${gh.name}, ${gh.avatar_url})
      on conflict (github_id) do update
        set github_login = excluded.github_login,
            email = excluded.email,
            name = excluded.name,
            avatar_url = excluded.avatar_url,
            updated_at = now()
      returning id
    `) as unknown as Array<{ id: string }>;

    const userId = rows[0]?.id;
    if (!userId) throw new Error("upsert returned no id");

    const res = NextResponse.redirect(`${SITE}/dashboard`);
    res.cookies.set(SESSION_COOKIE, await signSession(userId), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    res.cookies.delete(OAUTH_STATE_COOKIE);
    return res;
  } catch {
    return NextResponse.redirect(`${SITE}/dashboard?error=login_failed`);
  }
}
