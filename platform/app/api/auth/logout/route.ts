import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "../../../lib/auth";
import { SITE } from "../../../lib/site";

export const dynamic = "force-dynamic";

// Clear the session cookie and return home.
export async function GET() {
  const res = NextResponse.redirect(`${SITE}/`);
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
