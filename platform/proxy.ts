import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, LOCALES } from "./app/i18n/messages";

// Locale routing without a locale in the URL. Every page lives under app/[locale]
// and is prerendered once per locale; this rewrites the public path onto the tree
// the visitor's cookie selects. Crawlers and first-time visitors carry no cookie
// and get English, so the canonical URLs never change meaning.
//
// A prefixed path that reaches us from outside (someone typed /zh-CN/learn) is not
// canonical: strip the prefix, remember the choice in the cookie, and redirect.
//
// Both targets keep the request's raw origin: request.url, which next.config.ts
// (skipProxyUrlNormalize) leaves as the server saw it, not request.nextUrl, which
// renames loopback hosts to localhost. Next's router compares a rewrite with the raw
// bound host; under `next start -H 127.0.0.1` the localhost rewrite counted as
// external, came back through here as /en/... and was redirected to / forever.
const COOKIE_OPTIONS = { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" as const };

export function proxy(request: NextRequest) {
  const url = new URL(request.url);
  // Next's RSC cache-busting param; normalization used to strip it before we saw it.
  url.searchParams.delete("_rsc");
  const { pathname } = url;

  const prefixed = LOCALES.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (prefixed) {
    url.pathname = pathname.slice(prefixed.length + 1) || "/";
    const res = NextResponse.redirect(url, 307);
    res.cookies.set(LOCALE_COOKIE, prefixed, COOKIE_OPTIONS);
    return res;
  }

  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookie) ? cookie : DEFAULT_LOCALE;
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Pages only: not API routes, Next internals, metadata routes or any file with an extension.
  matcher: ["/((?!api/|_next/|_vercel/|opengraph-image|twitter-image|.*\\..*).*)"],
};
