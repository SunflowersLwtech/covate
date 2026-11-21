import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";
import sitemap from "./app/sitemap";
import { GET as llms } from "./app/llms.txt/route";
import { GET as full } from "./app/llms-full.txt/route";
import { SITE } from "./app/lib/site";

const root = join(import.meta.dirname, "app");
// Authenticated ledger and the catch-all notFound page are not public content.
const excluded = new Set(["/dashboard", "/[...rest]"]);
function pages(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return pages(join(dir, entry.name));
    if (entry.name !== "page.tsx") return [];
    const path = "/" + relative(root, dir).split(/[\\/]/).filter((part) => part !== "[locale]" && !part.startsWith("(")).join("/");
    return excluded.has(path) ? [] : [path];
  });
}

function assertCoverage(paths: string[], urls: string[], bodies: string[]) {
  assert.ok(paths.length, "public page discovery must not be empty");
  for (const path of paths) {
    assert.ok(!path.includes("["), `expand dynamic public route: ${path}`);
    const url = SITE + (path === "/" ? "" : path);
    assert.ok(urls.includes(url), `sitemap missing ${url}`);
    for (const [index, body] of bodies.entries()) {
      const links: string[] = body.match(/https:\/\/[^\s)]+/g) ?? [];
      assert.ok(links.includes(url), `llms file ${index + 1} missing ${url}`);
    }
  }
}

test("every public page is in the sitemap and both absolute-URL llms directories", async () => {
  const entries = sitemap();
  const paths = pages(root);
  assertCoverage(paths, entries.map((entry) => entry.url), await Promise.all([llms(), full()].map((response) => response.text())));
  assert.equal(entries.length, paths.length);
  for (const entry of entries) {
    assert.equal(new URL(entry.url).origin, SITE);
    assert.ok(!/^\/(en|zh-CN)(\/|$)/.test(new URL(entry.url).pathname));
    assert.match(String(entry.lastModified), /^\d{4}-\d{2}-\d{2}$/);
  }
  for (const path of excluded) assert.ok(!entries.some((entry) => entry.url === SITE + path));
  assert.equal(entries.find((entry) => entry.url === SITE + "/privacy/ms")?.lastModified, "2026-11-12");
  assert.equal(entries.find((entry) => entry.url === SITE + "/privacy")?.lastModified, "2026-11-12");
  assert.equal(entries.find((entry) => entry.url === SITE + "/terms")?.lastModified, "2026-09-03");
});

test("coverage rejects empty discovery, omitted pages and relative-only links", () => {
  assert.throws(() => assertCoverage([], [], []), /must not be empty/);
  assert.throws(() => assertCoverage(["/new"], [], []), /sitemap missing/);
  assert.throws(() => assertCoverage(["/new"], [SITE + "/new"], ["/new"]), /llms file 1 missing/);
  assert.throws(() => assertCoverage(["/[slug]"], [], []), /expand dynamic/);
});

test("public pages overriding social metadata keep the share image", () => {
  for (const path of pages(root)) {
    const source = readFileSync(join(root, "[locale]", path, "page.tsx"), "utf8");
    if (source.includes("openGraph:")) assert.match(source, /openGraph:\s*\{\s*images:/, path);
    if (source.includes("twitter:")) assert.match(source, /twitter:\s*\{\s*images:/, path);
  }
});
