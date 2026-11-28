import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { installUmamiFilter, UMAMI_BEFORE_SEND, UMAMI_NOT_FOUND_ATTR } from "./app/lib/umamiFilter";

// Anything typed or pasted into the address bar becomes a path, and proxy.ts
// sends every unknown path to the localized not-found page. On another of our
// sites Umami held a not-found path that was an account's email address and
// password. These tests hold together the filter that records such a view as
// "/404", the marker on the not-found page it looks for, and the tag that
// installs it; everything else keeps its query and fragment, as /privacy says.
//
// That not-found page arrives with an empty body and is built in the browser,
// where a <script> React creates never runs, so the filter cannot be an inline
// script: UmamiTag installs it when its module loads and renders the tag.

const read = (rel: string) => readFileSync(join(import.meta.dirname, rel), "utf8");
const SITE = "https://covate.org";
type Payload = Record<string, unknown>;
type Hook = (type: string, payload: Payload | null) => Payload | null;

/** A window whose document has the not-found marker while `page.notFound` is true. */
function hook(page = { notFound: false }): Hook {
  const win: Record<string, unknown> = {
    document: {
      querySelector: (selector: string) => (selector === `[${UMAMI_NOT_FOUND_ATTR}]` && page.notFound ? {} : null),
    },
  };
  installUmamiFilter(win, UMAMI_BEFORE_SEND, UMAMI_NOT_FOUND_ATTR);
  return win[UMAMI_BEFORE_SEND] as Hook;
}

// The shape of what was pasted into another of our sites' address bar.
const PASTED = `${SITE}/${encodeURIComponent("账号：someone@example.com 密码：Hunter2!")}?x=1#frag`;

test("on the not-found page a pasted address is recorded as /404 with the title 404, and so is the next view's referrer", () => {
  const page = { notFound: true };
  const send = hook(page);
  const view = send("event", { url: PASTED, title: "Page not found — Covate", referrer: "" })!;
  assert.equal(view.url, `${SITE}/404`, "a pasted email address and password reach Umami as the not-found page's path");
  assert.equal(view.title, "404");
  page.notFound = false;
  const next = send("event", { url: `${SITE}/learn`, title: "Learn", referrer: PASTED })!;
  assert.equal(next.url, `${SITE}/learn`);
  assert.equal(next.title, "Learn");
  assert.equal(next.referrer, `${SITE}/404`, "the not-found page's pasted path comes back as the next view's referrer");
});

test("on the not-found page even a path made of route characters is /404, and is /404 as the next referrer", () => {
  const page = { notFound: true };
  const send = hook(page);
  assert.equal(send("event", { url: `${SITE}/hunter2-secret?x=1`, title: "x", referrer: "" })!.url, `${SITE}/404`);
  page.notFound = false;
  assert.equal(send("event", { url: `${SITE}/`, title: "Covate", referrer: `${SITE}/hunter2-secret?x=1` })!.referrer, `${SITE}/404`);
});

test("without the marker, a path no page of ours has is still /404, as the page and as a referrer", () => {
  for (const path of ["/someone@example.com", "/密码", "/Learn", "/a%20b", "/a.b", "/%E0%A4%A"]) {
    const out = hook()("event", { url: `${SITE}${path}`, title: "t", referrer: "" })!;
    assert.equal(out.url, `${SITE}/404`, path);
    assert.equal(out.title, "404", path);
    const ref = hook()("event", { url: `${SITE}/learn`, title: "Learn", referrer: `${SITE}${path}?q=1` })!;
    assert.equal(ref.referrer, `${SITE}/404`, `${path}: a pasted path reaches Umami as a referrer the filter never saw as a view`);
  }
});

test("real pages keep their path, query, fragment and title, and another site's referrer is left alone", () => {
  for (const path of ["/", "/learn", "/learn/what-is-vibe-coding#why", "/dashboard?error=denied", "/privacy/ms", "/terms?utm_source=x"]) {
    const out = hook()("event", { url: `${SITE}${path}`, title: "Page", referrer: "https://www.google.com/Search/Some%20Thing?q=covate" })!;
    assert.equal(out.url, `${SITE}${path}`, path);
    assert.equal(out.title, "Page", path);
    assert.equal(out.referrer, "https://www.google.com/Search/Some%20Thing?q=covate");
  }
  const own = hook()("event", { url: `${SITE}/learn`, title: "Learn", referrer: `${SITE}/learn/what-is-vibe-coding?x=1#y` })!;
  assert.equal(own.referrer, `${SITE}/learn/what-is-vibe-coding?x=1#y`, "a real page of ours as the referrer is sent as it is");
});

test("an address that cannot be read is not sent, a payload with no address passes, and a hook that throws sends nothing", () => {
  const send = hook();
  assert.equal(send("event", { url: "not a url", referrer: "" }), null);
  assert.deepEqual(send("identify", { website: "w", data: { a: 1 } }), { website: "w", data: { a: 1 } });
  const throwing = {
    get url(): string {
      throw new Error("boom");
    },
    referrer: PASTED,
  };
  assert.equal(send("event", throwing), null);
});

test("the not-found page renders the marker", () => {
  assert.match(
    read("app/[locale]/not-found.tsx"),
    /<div hidden \{\.\.\.\{ \[UMAMI_NOT_FOUND_ATTR\]: "" \}\} \/>/,
    "without the marker a pasted path with only route characters reaches Umami from the not-found page",
  );
});

test("UmamiTag installs the filter when its module loads, then renders the tag that names it", () => {
  const tag = read("app/_components/UmamiTag.tsx");
  assert.ok(tag.startsWith('"use client";'), "the filter must be installed in the browser: UmamiTag is a client module");
  const installAt = tag.search(/^if \(typeof window !== "undefined"\) \{\n  installUmamiFilter\(window as unknown as Record<string, unknown>, UMAMI_BEFORE_SEND, UMAMI_NOT_FOUND_ATTR\);/m);
  const componentAt = tag.indexOf("export function UmamiTag()");
  assert.ok(installAt > 0, "the filter must be installed at module scope, before React renders anything");
  assert.ok(componentAt > installAt, "the install must come before the component that renders the tag");
  const script = tag.slice(tag.indexOf("<Script", componentAt), tag.indexOf("/>", componentAt));
  assert.ok(script.includes('src="https://fluentdojo.com/umami/script.js"'), "no Umami tag in UmamiTag");
  assert.ok(script.includes("data-before-send={UMAMI_BEFORE_SEND}"), "without data-before-send a pasted path reaches Umami");
  assert.ok(script.includes('data-domains="covate.org,www.covate.org"'), "the runtime host gate must stay on the tag");
  assert.ok(!script.includes("data-exclude-search") && !script.includes("data-exclude-hash"), "/privacy says the query and fragment are kept: change both together");
});

test("the layout renders UmamiTag behind the production gate, and no other Umami tag", () => {
  const layout = read("app/[locale]/layout.tsx");
  assert.ok(layout.includes('{process.env.VERCEL_ENV === "production" ? <UmamiTag /> : null}'), "the layout must render UmamiTag in production builds only");
  assert.ok(!layout.includes("umami/script.js\""), "a second Umami tag in the layout would load the tracker without the filter");
  assert.ok(!/__html:\s*UMAMI_/.test(layout), "an inline filter script never runs on the client-built not-found page");
});
