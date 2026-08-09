import { NextResponse } from "next/server";
import { DEVICE_CODE_COOKIE, deviceAuthConfigured, startDeviceFlow } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

// Begin a device-flow sign-in: the browser shows the user a short code, GitHub does
// the authenticating. The device_code is the thing an attacker would want, so it goes
// into an httpOnly cookie rather than back to the page — the client only ever sees
// the code the human is meant to read out.
export async function POST() {
  if (!deviceAuthConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  try {
    const dc = await startDeviceFlow();
    const res = NextResponse.json({
      user_code: dc.user_code,
      verification_uri: dc.verification_uri,
      interval: dc.interval,
      expires_in: dc.expires_in,
    });
    res.cookies.set(DEVICE_CODE_COOKIE, dc.device_code, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: dc.expires_in,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "github_unavailable" }, { status: 502 });
  }
}
