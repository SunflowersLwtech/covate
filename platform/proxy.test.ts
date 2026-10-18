// Unit tests for proxy.ts. Run with `npm run test:proxy` (node:test via tsx).
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NextRequest, type NextResponse } from "next/server";
import { config, proxy } from "./proxy";
import { LOCALE_COOKIE, LOCALES } from "./app/i18n/messages";

const ORIGIN = "http://localhost:3000";

function request(path: string, init: { cookie?: string; origin?: string } = {}) {
  const headers = new Headers();
  if (init.cookie) headers.set("cookie", init.cookie);
  return new NextRequest(new URL(path, init.origin ?? ORIGIN), { headers });
}

/** Where Next would serve a rewrite from, or null if the response is not a rewrite. */
function rewriteTarget(res: NextResponse): URL | null {
  const target = res.headers.get("x-middleware-rewrite");
  return target ? new URL(target) : null;
}

function assertRewrite(res: NextResponse, expectedPath: string, origin = ORIGIN) {
  assert.equal(res.headers.get("location"), null, "a rewrite must not also redirect");
  const target = rewriteTarget(res);
  assert.ok(target, "expected a rewrite");
  // Same-origin rewrites are served internally without re-entering the proxy;
  // a different origin would make Next fetch it as an external URL.
  assert.equal(target.origin, origin);
  assert.equal(target.pathname + target.search, expectedPath);
  assert.equal(res.cookies.get(LOCALE_COOKIE), undefined, "a rewrite must not touch the cookie");
}

function assertRedirect(res: NextResponse, expectedPath: string, locale: string) {
  assert.equal(res.status, 307);
  assert.equal(rewriteTarget(res), null, "a redirect must not also rewrite");
  const location = new URL(res.headers.get("location")!, ORIGIN);
  assert.equal(location.pathname + location.search, expectedPath);
  const cookie = res.cookies.get(LOCALE_COOKIE);
  assert.ok(cookie, "the redirect must remember the locale");
  assert.equal(cookie.value, locale);
  assert.equal(cookie.path, "/");
  assert.equal(cookie.maxAge, 60 * 60 * 24 * 365);
  assert.equal(cookie.sameSite, "lax");
}

describe("proxy: canonical (unprefixed) paths are rewritten, never redirected", () => {
  it("root without a cookie serves English", () => {
    assertRewrite(proxy(request("/")), "/en");
  });

  for (const locale of LOCALES) {
    it(`root with the ${locale} cookie serves ${locale}`, () => {
      assertRewrite(proxy(request("/", { cookie: `${LOCALE_COOKIE}=${locale}` })), `/${locale}`);
    });
  }

  it("an unknown cookie value falls back to English", () => {
    assertRewrite(proxy(request("/", { cookie: `${LOCALE_COOKIE}=fr` })), "/en");
  });

  it("a page path keeps its path and query", () => {
    assertRewrite(proxy(request("/learn/what-is-vibe-coding?ref=x")), "/en/learn/what-is-vibe-coding?ref=x");
    assertRewrite(
      proxy(request("/learn", { cookie: `${LOCALE_COOKIE}=zh-CN` })),
      "/zh-CN/learn",
    );
  });

  it("a path that only starts with a locale's letters is not prefixed", () => {
    assertRewrite(proxy(request("/english")), "/en/english");
  });

  it("the rewrite stays on the request's own origin, whatever host it arrived on", () => {
    for (const origin of ["http://127.0.0.1:3000", "http://localhost:3100", "https://covate.org"]) {
      const req = request("/learn", { origin });
      // nextUrl normalizes loopback hosts (127.0.0.1 -> localhost); Next compares against that.
      assertRewrite(proxy(req), "/en/learn", req.nextUrl.origin);
    }
  });
});

describe("proxy: an externally typed prefixed path redirects once and sets the cookie", () => {
  for (const locale of LOCALES) {
    it(`/${locale}/learn -> /learn with ${locale}`, () => {
      assertRedirect(proxy(request(`/${locale}/learn`)), "/learn", locale);
    });

    it(`/${locale} -> / with ${locale}`, () => {
      assertRedirect(proxy(request(`/${locale}`)), "/", locale);
    });
  }

  it("keeps the query string", () => {
    assertRedirect(proxy(request("/zh-CN/learn?ref=x")), "/learn?ref=x", "zh-CN");
  });

  it("the prefix in the URL wins over an existing cookie", () => {
    assertRedirect(proxy(request("/zh-CN/learn", { cookie: `${LOCALE_COOKIE}=en` })), "/learn", "zh-CN");
  });

  it("the redirect target is canonical: following it rewrites instead of redirecting again", () => {
    for (const locale of LOCALES) {
      const first = proxy(request(`/${locale}/learn`));
      const location = new URL(first.headers.get("location")!, ORIGIN);
      const second = proxy(request(location.pathname + location.search, { cookie: `${LOCALE_COOKIE}=${locale}` }));
      assertRewrite(second, `/${locale}/learn`);
    }
  });
});

describe("proxy: the rewritten /<locale>/... request", () => {
  // proxy() cannot tell its own rewrite target from a typed-in prefixed URL; both are
  // /<locale>/... . If that request ever reached it a second time, rewrite + redirect
  // would alternate forever (/ -> rewrite /en -> 307 / -> ...). Next serves same-origin
  // rewrites without re-running the proxy, which is what the origin check above pins.
  it("would be redirected back to where it came from", () => {
    const rewritten = rewriteTarget(proxy(request("/learn")))!;
    assertRedirect(proxy(request(rewritten.pathname)), "/learn", "en");
  });
});

describe("proxy: matcher", () => {
  const matcher = new RegExp(`^${config.matcher[0]}$`);

  it("runs on pages, including prefixed ones", () => {
    for (const path of ["/", "/learn", "/learn/what-is-vibe-coding", "/en", "/zh-CN/learn", "/dashboard"]) {
      assert.ok(matcher.test(path), path);
    }
  });

  it("skips API routes, Next internals, metadata routes and files", () => {
    for (const path of [
      "/api/ingest",
      "/_next/static/chunks/app.js",
      "/_vercel/insights/script.js",
      "/opengraph-image",
      "/twitter-image",
      "/robots.txt",
      "/sitemap.xml",
      "/icon.png",
      "/version.json",
    ]) {
      assert.ok(!matcher.test(path), path);
    }
  });
});
