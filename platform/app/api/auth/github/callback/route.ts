import { NextRequest, NextResponse } from "next/server";
import {
  webAuthConfigured,
  exchangeCodeForUser,
  OAUTH_STATE_COOKIE,
  SESSION_COOKIE,
  signSession,
} from "../../../../lib/auth";
import { upsertPlatformUser } from "../../../../lib/users";
import { SITE } from "../../../../layout";

export const dynamic = "force-dynamic";

// GitHub OAuth callback: verify state, exchange the code, upsert the platform_user,
// and set the signed session cookie.
export async function GET(req: NextRequest) {
  if (!webAuthConfigured()) {
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

    const userId = await upsertPlatformUser(gh);

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
