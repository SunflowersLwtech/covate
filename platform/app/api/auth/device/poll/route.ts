import { NextRequest, NextResponse } from "next/server";
import {
  DEVICE_CODE_COOKIE,
  SESSION_COOKIE,
  deviceAuthConfigured,
  pollDeviceFlow,
  signSession,
} from "../../../../lib/auth";
import { upsertPlatformUser } from "../../../../lib/users";

export const dynamic = "force-dynamic";

// Has the user finished authorizing on GitHub? Called on a timer by the sign-in page.
export async function POST(req: NextRequest) {
  if (!deviceAuthConfigured()) {
    return NextResponse.json({ status: "not_configured" }, { status: 503 });
  }
  const deviceCode = req.cookies.get(DEVICE_CODE_COOKIE)?.value;
  if (!deviceCode) return NextResponse.json({ status: "expired" });

  let result;
  try {
    result = await pollDeviceFlow(deviceCode);
  } catch {
    return NextResponse.json({ status: "pending" });
  }

  if (result.status !== "authorized") {
    const res = NextResponse.json(result);
    // A terminal answer means this code will never work again — drop it so the page
    // starts a fresh one instead of polling a dead code.
    if (result.status === "expired" || result.status === "denied") {
      res.cookies.delete(DEVICE_CODE_COOKIE);
    }
    return res;
  }

  try {
    const userId = await upsertPlatformUser(result.user);
    const res = NextResponse.json({ status: "authorized", login: result.user.login });
    res.cookies.set(SESSION_COOKIE, await signSession(userId), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    res.cookies.delete(DEVICE_CODE_COOKIE);
    return res;
  } catch {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
