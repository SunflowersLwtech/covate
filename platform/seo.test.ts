import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";
import ts from "typescript";
import sitemap from "./app/sitemap";
import { GET as llms } from "./app/llms.txt/route";
import { GET as full } from "./app/llms-full.txt/route";
import { SITE } from "./app/lib/site";
import { NOVEMBER_CONTENT_UPDATED } from "./app/lib/content-dates";

const root = join(import.meta.dirname, "app");
// Authenticated ledger and the catch-all notFound page are not public content.
const excluded = new Set(["/dashboard", "/[...rest]"]);
function pages(dir: string, appRoot = root): { path: string; file: string }[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return pages(join(dir, entry.name), appRoot);
    if (entry.name !== "page.tsx") return [];
    const path = "/" + relative(appRoot, dir).split(/[\\/]/).filter((part) => part !== "[locale]" && !part.startsWith("(")).join("/");
    return excluded.has(path) ? [] : [{ path, file: join(dir, entry.name) }];
  });
}

function directoryLinks(body: string): string[] {
  const headings = new Set(["## Public site", "## Learn", "## Legal", "## Public page directory"]);
  let inDirectory = false;
  return body.split("\n").flatMap((line) => {
    if (line.startsWith("## ")) inDirectory = headings.has(line);
    if (!inDirectory || !line.startsWith("- ")) return [];
    return line.match(/https:\/\/[^\s)]+/g) ?? [];
  });
}

function assertCoverage(paths: string[], urls: string[], bodies: string[]) {
  assert.ok(paths.length, "public page discovery must not be empty");
  for (const path of paths) {
    assert.ok(!path.includes("["), `expand dynamic public route: ${path}`);
    const url = SITE + (path === "/" ? "" : path);
    assert.ok(urls.includes(url), `sitemap missing ${url}`);
    for (const [index, body] of bodies.entries()) {
      const links = directoryLinks(body);
      assert.ok(links.includes(url), `llms file ${index + 1} missing ${url}`);
    }
  }
}

test("every public page is in the sitemap and both absolute-URL llms directories", async () => {
  const entries = sitemap();
  const paths = pages(root).map((page) => page.path);
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
  assert.throws(() => assertCoverage(["/new"], [SITE + "/new"], [`Mention: ${SITE}/new`]), /llms file 1 missing/);
  assert.throws(() => assertCoverage(["/new"], [SITE + "/new"], [`## Comparison\n- New: ${SITE}/new`]), /llms file 1 missing/);
  assert.doesNotThrow(() => assertCoverage(["/new"], [SITE + "/new"], [`## Public page directory\n- New: ${SITE}/new`]));
});

function visit(source: string, callback: (node: ts.Node) => void) {
  function walk(node: ts.Node) {
    callback(node);
    ts.forEachChild(node, walk);
  }
  walk(ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX));
}

function property(object: ts.ObjectLiteralExpression, name: string) {
  return object.properties.find((node): node is ts.PropertyAssignment =>
    ts.isPropertyAssignment(node) && node.name.getText().replace(/^["\']|["\']$/g, "") === name);
}

function imageUrl(node: ts.Expression): string | undefined {
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken && node.left.getText() === "SITE" && ts.isStringLiteral(node.right)) return SITE + node.right.text;
  if (ts.isObjectLiteralExpression(node)) {
    const url = property(node, "url");
    return url && imageUrl(url.initializer);
  }
}

function assertSocialImages(source: string, path: string) {
  visit(source, (node) => {
    if (!ts.isPropertyAssignment(node) || !["openGraph", "twitter"].includes(node.name.getText())) return;
    assert.ok(ts.isObjectLiteralExpression(node.initializer), `${path}: inspect social metadata expression`);
    const images = property(node.initializer, "images")?.initializer;
    assert.ok(images && ts.isArrayLiteralExpression(images), `${path}: missing image array`);
    assert.ok(images.elements.some((entry) => {
      const value = imageUrl(entry);
      if (!value) return false;
      const url = new URL(value, SITE);
      return ["http:", "https:"].includes(url.protocol) && url.pathname !== "/";
    }), `${path}: missing share image URL`);
  });
}

test("public pages overriding social metadata keep the share image", () => {
  for (const { path, file } of pages(root)) {
    assertSocialImages(readFileSync(file, "utf8"), path);
  }
});

test("social image checks accept reordered properties and reject empty or missing URLs", () => {
  for (const key of ["openGraph", "twitter"]) {
    assert.doesNotThrow(() => assertSocialImages(`const metadata = { ${key}: { title: "Title", images: ["/media/og.jpg"] } };`, "/fixture"));
    assert.doesNotThrow(() => assertSocialImages(`const metadata = { ${key}: { images: [{ url: SITE + "/media/og.jpg" }], title: "Title" } };`, "/fixture"));
    for (const images of ["[]", '[""]', "[{}]", '[{ url: "" }]']) {
      assert.throws(() => assertSocialImages(`const metadata = { ${key}: { images: ${images} } };`, "/fixture"), /missing share image URL/);
    }
    assert.throws(() => assertSocialImages(`const metadata = { ${key}: { title: "Title" } };`, "/fixture"), /missing image array/);
  }
});

test("route groups retain their source paths for metadata checks", () => {
  const fixture = mkdtempSync(join(tmpdir(), "covate-seo-"));
  try {
    const file = join(fixture, "[locale]", "(marketing)", "new", "page.tsx");
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, 'const metadata = { openGraph: { title: "New", images: ["/media/og.jpg"] } };');
    assert.deepEqual(pages(fixture, fixture), [{ path: "/new", file }]);
    for (const page of pages(fixture, fixture)) assertSocialImages(readFileSync(page.file, "utf8"), page.path);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test("November content dates agree in the sitemap and Article metadata", () => {
  assert.equal(NOVEMBER_CONTENT_UPDATED, "2026-11-19");
  for (const path of ["/", "/learn/onboard-to-a-repo-with-an-mcp-learning-tool", "/learn/how-to-debug-with-ai-without-losing-the-skill"]) {
    assert.equal(sitemap().find((entry) => entry.url === SITE + (path === "/" ? "" : path))?.lastModified, NOVEMBER_CONTENT_UPDATED);
    const page = pages(root).find((page) => page.path === path)!;
    const source = readFileSync(page.file, "utf8");
    assert.match(source, /import \{ NOVEMBER_CONTENT_UPDATED \} from "[^"]*lib\/content-dates"/);
    let found = false;
    visit(source, (node) => {
      if (!ts.isObjectLiteralExpression(node) || property(node, "@type")?.initializer.getText() !== '"Article"') return;
      found = true;
      assert.equal(property(node, "dateModified")?.initializer.getText(), "NOVEMBER_CONTENT_UPDATED");
    });
    assert.ok(found, `${path}: Article metadata not found`);
  }
});
