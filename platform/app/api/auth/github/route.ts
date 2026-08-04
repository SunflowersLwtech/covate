import { NextResponse } from "next/server";
import { authConfigured, githubAuthorizeUrl, OAUTH_STATE_COOKIE } from "../../../lib/auth";
import { SITE } from "../../../layout";

export const dynamic = "force-dynamic";

// Start the GitHub OAuth login flow: set a state cookie and redirect to GitHub.
export async function GET() {
  if (!authConfigured()) {
    return NextResponse.redirect(`${SITE}/dashboard?error=not_configured`);
  }
  const state = crypto.randomUUID();
  const res = NextResponse.redirect(githubAuthorizeUrl(state));
  res.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
