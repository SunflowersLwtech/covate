// GitHub OAuth + signed-cookie session for the Covate Learning Platform dashboard.
// All env-gated: the app builds and deploys without these set; auth simply stays
// "not configured" until DATABASE_URL + the GitHub OAuth app credentials + SESSION_SECRET
// are wired into Vercel. Uses Web Crypto (Edge-compatible) — no extra dependencies.

import { SITE } from "../layout";

const CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

export const SESSION_COOKIE = "covate_session";
export const OAUTH_STATE_COOKIE = "covate_oauth_state";

/** Whether the GitHub OAuth login flow is fully configured (env present). */
export function authConfigured(): boolean {
  return Boolean(CLIENT_ID && CLIENT_SECRET && SESSION_SECRET);
}

const CALLBACK_URL = `${SITE}/api/auth/github/callback`;

/** Build the GitHub authorize URL to redirect the user to. */
export function githubAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID ?? "",
    redirect_uri: CALLBACK_URL,
    scope: "read:user user:email",
    state,
    allow_signup: "true",
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export type GithubUser = {
  id: number;
  login: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
};

/** Exchange an OAuth code for the authenticated GitHub user. */
export async function exchangeCodeForUser(code: string): Promise<GithubUser> {
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: CALLBACK_URL,
    }),
  });
  const tokenJson = (await tokenRes.json()) as { access_token?: string; error?: string };
  if (!tokenJson.access_token) {
    throw new Error(`GitHub token exchange failed: ${tokenJson.error ?? "no access_token"}`);
  }
  const token = tokenJson.access_token;

  const userRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "covate" },
  });
  if (!userRes.ok) throw new Error(`GitHub /user failed: ${userRes.status}`);
  const user = (await userRes.json()) as GithubUser & { email: string | null };

  // Public email may be null; fetch the primary verified email if the scope allows.
  let email = user.email;
  if (!email) {
    try {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "covate" },
      });
      if (emailRes.ok) {
        const emails = (await emailRes.json()) as Array<{ email: string; primary: boolean; verified: boolean }>;
        email = emails.find((e) => e.primary && e.verified)?.email ?? emails.find((e) => e.verified)?.email ?? null;
      }
    } catch {
      // best-effort; email stays null
    }
  }

  return { id: user.id, login: user.login, email, name: user.name, avatar_url: user.avatar_url };
}

// --- Signed-cookie session (HMAC-SHA256 over the platform_user id) ---

async function hmac(value: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SESSION_SECRET ?? ""),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return Buffer.from(new Uint8Array(sig)).toString("base64url");
}

/** Produce the signed session cookie value for a platform_user id. */
export async function signSession(userId: string): Promise<string> {
  const sig = await hmac(userId);
  return `${userId}.${sig}`;
}

/** Verify a session cookie value, returning the platform_user id or null. */
export async function verifySession(cookieValue: string | undefined): Promise<string | null> {
  if (!cookieValue || !SESSION_SECRET) return null;
  const idx = cookieValue.lastIndexOf(".");
  if (idx <= 0) return null;
  const userId = cookieValue.slice(0, idx);
  const sig = cookieValue.slice(idx + 1);
  const expected = await hmac(userId);
  // constant-time-ish compare
  if (sig.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0 ? userId : null;
}
