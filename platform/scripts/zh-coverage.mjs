#!/usr/bin/env node
// Language gate for rendered pages: Chinese mode shows Chinese, English mode
// shows English, and every icon a page declares is the product's own image.
//
// Why rendered pages and not the message catalogs: a catalog can be complete
// while the page never reads it. A component with its own English sentence, an
// article body marked lang="en", a shared FAQ block pasted into every page —
// none of these are missing keys, and all of them reach a visitor who picked
// 中文. So this reads what a visitor receives.
//
// Pages come from one of two sources, set in zh-coverage.json:
//   static  — HTML files on disk (a generator's output, a public/ folder).
//   server  — a built app started locally; every route is requested once per
//             locale (cookie or Accept-Language) and the response is read.
// A page's mode is its <html lang> (zh* → Chinese, en* → English), or the
// locale that was requested when the config says modeFrom: "request", or the
// route's when routeModes says so (a static page whose <html lang> is a
// constant and is corrected in the browser from the path).
//
// A Chinese-mode page fails when
//   (a) its body (inside <main>, or <body> when there is no <main>) has fewer
//       than minHanPerHundred Chinese characters per hundred letters, or
//   (b) any block of it (a paragraph, list item, heading, button, cell …) is an
//       English sentence: 8+ Latin words and no Chinese, or 12+ words that are
//       almost all Latin. Text marked lang="en" may be English (an example
//       phrase, a product's button name) as long as one block stays under
//       40 words; code, pre, kbd and samp never count, or
//   (c) its <title> is English (4+ Latin words, no Chinese).
// An English-mode page fails when it shows Chinese outside englishAllow (brand
// names) and outside short text marked lang="zh…" (up to 40 Chinese characters
// per block: the switcher's 中文, a glossary's Chinese term, an example
// prompt on a page about planning in Chinese). Routes listed in
// zhContentRoutes serve Chinese content to every reader by decision (content
// that exists only in Chinese): there, marked Chinese of any length passes,
// and so does a Chinese <title>; unmarked Chinese still fails.
// Every <link rel="icon" | "apple-touch-icon" | "manifest"> target, and every
// icon a manifest lists, must load, be a real image, and match a sha256 pinned
// in icons.pinned — so a placeholder or another product's icon fails even
// when the file exists. A page that cannot be read, or a run that finds no
// Chinese page at all, fails instead of passing.
//
//   node scripts/zh-coverage.mjs [path/to/zh-coverage.json]
//   node scripts/zh-coverage.mjs --self-test     # analyzer fixtures only
//   node scripts/zh-coverage.mjs <cfg> --list    # also print every page read
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, posix } from "node:path";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";

// ---------------------------------------------------------------- analyzer
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const RAW = new Set(["script", "style", "noscript", "template", "textarea", "title", "svg", "math"]);
const NOT_PROSE = new Set(["code", "pre", "kbd", "samp", "var"]);
const BLOCK = new Set(["p", "li", "dt", "dd", "h1", "h2", "h3", "h4", "h5", "h6", "td", "th", "caption", "figcaption",
  "blockquote", "summary", "button", "label", "legend", "option", "div", "section", "article", "header", "footer", "nav",
  "aside", "main", "form", "ul", "ol", "dl", "table", "tr", "details", "fieldset", "figure", "body"]);
const HAN = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g;
const HAS_HAN = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;
const LATIN_WORD = /[A-Za-z][A-Za-z'’-]*/g;
// Words that make a short Latin-only block a sentence or a UI label rather
// than a name: what buttons, form fields and notices are made of, plus the
// function words any English phrase needs.
const UI_WORDS = new Set(("send submit cancel save saved delete remove edit loading search sign login logout log close back next " +
  "previous continue retry error optional required password email name message subject settings menu share copy copied " +
  "download upload more less show hide view open start stop pause help contact about pricing privacy terms guides guide " +
  "learn read try free get select choose add update confirm yes no ok done failed success empty nothing click tap " +
  "your you our we the and of to for with now new all see is are was not this that it in on by from or").split(/\s+/));
const count = (s, re) => (s.match(re) || []).length;
const letters = (s) => count(s, HAN) + count(s, /[A-Za-z]/g);

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", mdash: "—", ndash: "–", hellip: "…", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", middot: "·", copy: "©", reg: "®", times: "×", rarr: "→", larr: "←" };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e[0] === "#") { const n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return Number.isFinite(n) ? String.fromCodePoint(n) : m; }
  return ENTITIES[e.toLowerCase()] ?? m;
});
const attrOf = (attrs, name) => {
  const m = attrs.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? decode(m[1] ?? m[2] ?? m[3] ?? "") : null;
};
const hasAttr = (attrs, name) => new RegExp(`(?:^|\\s)${name}(?:\\s*=|\\s|$)`, "i").test(attrs);

/** Read one page the way a visitor in `mode` sees it. Returns the body's text
 *  (for the ratio), its blocks (for the sentence rule), the Chinese runs an
 *  English page shows, its title, and the icon links it declares. */
export function analyze(html, mode, opt = {}) {
  const zhTwin = opt.zhTwinClass ? new RegExp(opt.zhTwinClass) : null;
  const enTwin = opt.enTwinClass ? new RegExp(opt.enTwinClass) : null;
  const skipSel = opt.skipClass ? new RegExp(opt.skipClass) : null;
  const tagRe = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<!doctype[^>]*>|<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/gi;
  const stack = [];
  const top = () => stack[stack.length - 1];
  let htmlLang = null, title = "", hasMain = /<main[\s>]/i.test(html);
  const icons = [];
  const blocks = []; let buf = [];
  let scopeText = [];
  const flush = () => {
    if (!buf.length) return;
    const text = buf.map((b) => b.text).join("").replace(/\s+/g, " ").trim();
    if (text) {
      const enLetters = buf.filter((b) => b.declaredEn).reduce((n, b) => n + letters(b.text), 0);
      const zhLabel = buf.every((b) => b.declaredZh || !HAS_HAN.test(b.text));
      blocks.push({ text, declaredEn: enLetters > 0 && enLetters >= letters(text) * 0.9, declaredZhOnly: zhLabel, inScope: buf.some((b) => b.inScope) });
    }
    buf = [];
  };
  let last = 0, m;
  while ((m = tagRe.exec(html))) {
    const between = html.slice(last, m.index);
    last = tagRe.lastIndex;
    const t = top();
    if (between && t && !t.skip && !t.nonProse && t.inBody) {
      const text = decode(between);
      buf.push({ text, declaredEn: /^en\b/i.test(t.lang || ""), declaredZh: /^zh\b/i.test(t.lang || ""), inScope: t.inScope });
      // A <select>'s English options (official values such as a form's
      // country list, marked lang="en") are a closed list, not prose: they
      // still face the block rules but do not weigh on the body ratio.
      if (t.inScope && !(t.inSelect && /^en\b/i.test(t.lang || ""))) scopeText.push(text);
    }
    if (!m[2]) continue;
    const closing = m[1] === "/";
    const tag = m[2].toLowerCase();
    const attrs = m[3] || "";
    if (!closing && tag === "html") htmlLang = attrOf(attrs, "lang");
    if (!closing && tag === "link") {
      const rel = (attrOf(attrs, "rel") || "").toLowerCase().split(/\s+/);
      const href = attrOf(attrs, "href");
      if (href && rel.some((r) => r === "icon" || r === "apple-touch-icon" || r === "shortcut" || r === "manifest")) icons.push({ rel: rel.join(" "), href });
    }
    if (!closing && RAW.has(tag)) {
      // Raw-text element: jump past its end tag; keep the <title> text.
      const end = new RegExp(`</${tag}\\s*>`, "ig"); end.lastIndex = tagRe.lastIndex;
      const e = end.exec(html);
      const inner = e ? html.slice(tagRe.lastIndex, e.index) : "";
      if (tag === "title" && !title) title = decode(inner).trim();
      tagRe.lastIndex = e ? end.lastIndex : html.length; last = tagRe.lastIndex;
      continue;
    }
    if (closing) {
      let i = stack.length - 1;
      while (i >= 0 && stack[i].tag !== tag) i--;
      if (i < 0) continue;
      while (stack.length > i) { const el = stack.pop(); if (BLOCK.has(el.tag)) flush(); }
      continue;
    }
    if (VOID.has(tag) || /\/\s*$/.test(attrs)) {
      if (tag === "input" && t && t.inBody && !t.skip) {
        const ph = attrOf(attrs, "placeholder"); const type = (attrOf(attrs, "type") || "").toLowerCase();
        const val = ["submit", "button"].includes(type) ? attrOf(attrs, "value") : null;
        for (const v of [ph, val]) if (v) { flush(); buf.push({ text: v, declaredEn: /^en\b/i.test(t.lang || ""), declaredZh: /^zh\b/i.test(t.lang || ""), inScope: t.inScope }); flush(); if (t.inScope) scopeText.push(v); }
      }
      if (tag === "br") buf.push({ text: " ", inScope: false });
      continue;
    }
    const cls = attrOf(attrs, "class") || "";
    const lang = attrOf(attrs, "lang");
    const style = (attrOf(attrs, "style") || "").replace(/\s/g, "");
    const parent = t || { lang: htmlLang, skip: false, inScope: false, inBody: false, nonProse: false };
    // Next.js streams a resolved Suspense boundary as <div hidden id="S:n">
    // and moves it into place with a script, so that one is visible content.
    const hidden = (hasAttr(attrs, "hidden") && !/^S:\d+$/.test(attrOf(attrs, "id") || "")) || /display:none/i.test(style);
    // A bilingual element whose other-language twin the page hides with CSS:
    // by class (zhTwinClass / enTwinClass) or by an attribute naming the
    // language (twinAttr, e.g. data-ui-lang="zh").
    const twinLang = opt.twinAttr ? (attrOf(attrs, opt.twinAttr) || "").toLowerCase() : "";
    const twin = (mode === "zh" && ((enTwin && enTwin.test(cls)) || twinLang.startsWith("en"))) ||
      (mode === "en" && ((zhTwin && zhTwin.test(cls)) || twinLang.startsWith("zh")));
    const el = {
      tag,
      lang: lang ?? parent.lang,
      skip: parent.skip || hidden || twin || (skipSel ? skipSel.test(cls) : false),
      inBody: parent.inBody || tag === "body",
      inScope: parent.inScope || (hasMain ? tag === "main" : tag === "body"),
      nonProse: parent.nonProse || NOT_PROSE.has(tag),
      inSelect: parent.inSelect || tag === "select",
    };
    if (BLOCK.has(tag)) flush();
    stack.push(el);
  }
  flush();
  return { htmlLang, title, icons, blocks, scopeText: scopeText.join(" "), hasMain };
}

/** Apply the rules to one analyzed page. Returns a list of problems. */
export function judge(page, mode, cfg) {
  const out = [];
  const min = cfg.minHanPerHundred ?? 25;
  const allow = cfg.englishAllow ? new RegExp(cfg.englishAllow, "u") : null;
  const zhLabelMax = cfg.zhLabelMax ?? 40;
  if (mode === "zh") {
    const L = letters(page.scopeText), H = count(page.scopeText, HAN);
    if (L === 0) out.push("Chinese page has no body text (nothing inside <main>/<body> was read)");
    else if (L >= (cfg.minLettersForRatio ?? 60)) {
      const ratio = Math.round((100 * H) / L);
      if (ratio < min) out.push(`Chinese body is ${ratio}% Chinese (minimum ${min}%)`);
    }
    const keep = cfg.zhKeepEnglish ? new RegExp(cfg.zhKeepEnglish, "giu") : null;
    for (const b of page.blocks) {
      const words = count(b.text, LATIN_WORD), han = count(b.text, HAN);
      if ((/https?:\/\/|[{}`]/.test(b.text) || /^\S+@\S+\.\w+$/.test(b.text)) && han === 0 && words < 20) continue;
      const englishSentence = (words >= 8 && han === 0) || (words >= 12 && han * 4 < words);
      if (!englishSentence) {
        // A short English label — a button, a form field, an empty state —
        // in a Chinese page: no Chinese in the block, not marked lang="en",
        // and an ordinary UI or function word left once the product's own
        // English names (zhKeepEnglish) are set aside. Brand names alone
        // ("Google Play", "Galaxy Z Fold 7") carry no such word and pass.
        if (han === 0 && words > 0 && !b.declaredEn) {
          // Addresses are not words: contact@… and a URL path name nothing.
          const bare = b.text.replace(/\S+@\S+\.\w+|https?:\/\/\S+/g, " ");
          const rest = keep ? bare.replace(keep, " ") : bare;
          if ((rest.match(LATIN_WORD) || []).some((w) => UI_WORDS.has(w.toLowerCase()))) out.push(`English label in Chinese mode: ${b.text.slice(0, 80)}`);
        }
        continue;
      }
      if (b.declaredEn && words < 40) continue;
      out.push(`English sentence in Chinese mode: ${b.text.slice(0, 110)}`);
    }
    if (page.title && count(page.title, HAN) === 0 && count(page.title, LATIN_WORD) >= 4) out.push(`English <title> in Chinese mode: ${page.title.slice(0, 90)}`);
  } else {
    const seen = new Set();
    for (const b of page.blocks) {
      const runs = b.text.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3000-\u303f\uff00-\uffef]+/g) || [];
      for (const r of runs) {
        if (!HAS_HAN.test(r)) continue;
        const rest = allow ? r.replace(new RegExp(cfg.englishAllow, "gu"), "") : r;
        if (count(rest, HAN) === 0) continue;
        if (b.declaredZhOnly && (cfg._zhContent || count(b.text, HAN) <= zhLabelMax)) continue;
        seen.add(r.length > 30 ? r.slice(0, 30) + "…" : r);
      }
    }
    if (seen.size) out.push(`Chinese on an English page: ${[...seen].slice(0, 5).join(" / ")}${seen.size > 5 ? ` (+${seen.size - 5} more)` : ""}`);
    const tr = page.title && allow ? page.title.replace(new RegExp(cfg.englishAllow, "gu"), "") : page.title;
    if (tr && count(tr, HAN) > 0 && !cfg._zhContent) out.push(`Chinese <title> on an English page: ${page.title.slice(0, 90)}`);
  }
  return out;
}

// ---------------------------------------------------------------- icons
function imageKind(buf) {
  if (buf.length < 16) return null;
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf[0] === 0 && buf[1] === 0 && buf[2] === 1 && buf[3] === 0) return "ico";
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpeg";
  if (buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") return "webp";
  const head = buf.subarray(0, 512).toString("utf8").trimStart();
  if (/^(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*<svg[\s>]/i.test(head)) return "svg";
  return null;
}
const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

// ---------------------------------------------------------------- sources
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
}
const globToRe = (g) => new RegExp("^" + g.split("**/").map((p) => p.split("*").map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join("[^/]*")).join("(?:.*/)?") + "$");

async function staticSource(cfg, base) {
  const dir = resolve(base, cfg.static.dir);
  if (!existsSync(dir)) throw new Error(`static dir ${dir} does not exist — build first`);
  const inc = (cfg.static.include ?? ["**/*.html"]).map(globToRe);
  const exc = (cfg.skip ?? []).map(globToRe);
  const files = walk(dir).map((f) => relative(dir, f).split("\\").join("/")).filter((r) => inc.some((re) => re.test(r)) && !exc.some((re) => re.test(r))).sort();
  const pages = files.map((rel) => ({ id: rel, html: readFileSync(join(dir, rel), "utf8"), requested: null }));
  const loadIcon = async (href, page) => {
    const clean = href.split(/[?#]/)[0];
    if (/^https?:/.test(clean)) {
      const site = cfg.static.site;
      if (!site || !clean.startsWith(site)) return { error: "external icon URL" };
      return loadIcon(clean.slice(site.length) || "/", page);
    }
    const rel = clean.startsWith("/") ? clean.slice(1) : posix.join(posix.dirname(page.id), clean);
    // A built app serves icons from more than one place (public/, and the
    // icon files Next generates from app/), so look in each in turn.
    for (const d of [dir, ...(cfg.static.iconDirs ?? []).map((x) => resolve(base, x))]) {
      const fp = join(d, rel);
      if (existsSync(fp) && !statSync(fp).isDirectory()) return { buf: readFileSync(fp) };
    }
    return { error: "missing" };
  };
  return { pages, loadIcon, close: async () => {} };
}

async function serverSource(cfg, base) {
  const s = cfg.server;
  const origin = s.origin ?? `http://127.0.0.1:${s.port}`;
  let child = null;
  if (s.start) {
    child = spawn(s.start, { cwd: resolve(base, s.cwd ?? "."), shell: true, detached: true, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, PORT: String(s.port), ...(s.env ?? {}) } });
    let log = "";
    child.stdout.on("data", (d) => { log += d; }); child.stderr.on("data", (d) => { log += d; });
    const deadline = Date.now() + (s.startTimeoutMs ?? 90000);
    for (;;) {
      try { await fetch(origin + "/", { redirect: "manual", signal: AbortSignal.timeout(3000) }); break; } catch {}
      if (child.exitCode !== null || Date.now() > deadline) { console.error(log.slice(-3000)); throw new Error(`server did not start at ${origin}`); }
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  const routes = new Set(s.routes ?? []);
  if (s.nextDir) {
    const nd = resolve(base, s.nextDir);
    const pre = JSON.parse(readFileSync(join(nd, "prerender-manifest.json"), "utf8"));
    for (const r of Object.keys(pre.routes ?? {})) routes.add(r);
    const appPaths = existsSync(join(nd, "app-path-routes-manifest.json")) ? JSON.parse(readFileSync(join(nd, "app-path-routes-manifest.json"), "utf8")) : {};
    for (const [k, v] of Object.entries(appPaths)) if (k.endsWith("/page") && !v.includes("[")) routes.add(v);
  }
  const strip = s.stripLocalePrefix ?? [];
  const norm = new Set();
  for (let r of routes) {
    for (const p of strip) if (r === `/${p}` || r.startsWith(`/${p}/`)) r = r.slice(p.length + 1) || "/";
    norm.add(r);
  }
  const exc = ["^/_not-found", "^/_global-error", "^/_error", "^/api/", "\\.(txt|xml|json|png|ico|jpg|svg|webmanifest)$", ...(cfg.skip ?? [])].map((x) => new RegExp(x));
  const list = [...norm].filter((r) => !exc.some((re) => re.test(r))).sort();
  const pages = [];
  const jobs = [];
  for (const r of list) for (const [loc, how] of Object.entries(s.locales)) jobs.push({ r, loc, how });
  let i = 0;
  const failures = [];
  await Promise.all(Array.from({ length: s.concurrency ?? 4 }, async () => {
    while (i < jobs.length) {
      const { r, loc, how } = jobs[i++];
      try {
        const res = await fetch(origin + r, { redirect: "manual", headers: how.headers ?? {}, signal: AbortSignal.timeout(s.timeoutMs ?? 30000) });
        const type = res.headers.get("content-type") || "";
        if (res.status >= 300 && res.status < 400) { pages.push({ id: `${r} [${loc}]`, redirect: res.headers.get("location"), requested: loc }); continue; }
        if (res.status !== 200) { failures.push(`${r} [${loc}]: HTTP ${res.status}`); continue; }
        if (!type.includes("text/html")) continue;
        pages.push({ id: `${r} [${loc}]`, route: r, html: await res.text(), requested: loc });
      } catch (e) { failures.push(`${r} [${loc}]: ${e.message}`); }
    }
  }));
  const loadIcon = async (href) => {
    try {
      const u = new URL(href, origin + "/");
      if (cfg.server.siteOrigin && u.origin === cfg.server.siteOrigin) { u.protocol = "http:"; u.host = new URL(origin).host; }
      if (u.origin !== new URL(origin).origin) return { error: "external icon URL" };
      const res = await fetch(u, { signal: AbortSignal.timeout(15000) });
      if (res.status !== 200) return { error: `HTTP ${res.status}` };
      return { buf: Buffer.from(await res.arrayBuffer()) };
    } catch (e) { return { error: e.message }; }
  };
  const close = async () => { if (child && child.exitCode === null) { try { process.kill(-child.pid, "SIGTERM"); } catch {} } };
  return { pages: pages.sort((a, b) => a.id.localeCompare(b.id)), loadIcon, close, fetchFailures: failures };
}

// ---------------------------------------------------------------- catalogs
function flattenJson(o, p = "", out = []) {
  if (typeof o === "string") out.push([p, o]);
  else if (Array.isArray(o)) o.forEach((v, i) => flattenJson(v, `${p}[${i}]`, out));
  else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) flattenJson(v, p ? `${p}.${k}` : k, out);
  return out;
}
function checkCatalogs(cfg, base) {
  const out = [];
  for (const c of cfg.catalogs ?? []) {
    for (const [mode, glob] of Object.entries({ zh: c.zh, en: c.en })) {
      if (!glob) continue;
      const dir = resolve(base, c.dir ?? ".");
      const re = globToRe(glob);
      const files = walk(dir).map((f) => relative(dir, f).split("\\").join("/")).filter((r) => re.test(r));
      if (!files.length) { out.push(`catalog ${glob}: no files`); continue; }
      for (const f of files) {
        for (const [k, v] of flattenJson(JSON.parse(readFileSync(join(dir, f), "utf8")))) {
          const words = count(v, LATIN_WORD), han = count(v, HAN);
          if (mode === "zh" && !/https?:\/\//.test(v) && ((words >= 8 && han === 0) || (words >= 12 && han * 4 < words))) out.push(`${f} ${k}: Chinese catalog holds English: ${v.slice(0, 90)}`);
          if (mode === "en") {
            const rest = cfg.englishAllow ? v.replace(new RegExp(cfg.englishAllow, "gu"), "") : v;
            if (count(rest, HAN) > 0 && !(c.enZhLabelKeys ?? []).includes(k)) out.push(`${f} ${k}: English catalog holds Chinese: ${v.slice(0, 60)}`);
          }
        }
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------- self-test
function selfTest() {
  const cfg = { minHanPerHundred: 25, englishAllow: "签屿" };
  const zh = (body) => `<!doctype html><html lang="zh-CN"><head><title>标题 页面</title></head><body><nav>首页</nav><main>${body}</main></body></html>`;
  const en = (body) => `<!doctype html><html lang="en"><head><title>A page</title></head><body><main>${body}</main></body></html>`;
  const cases = [
    ["zh page in Chinese passes", zh("<p>这是一个完整的中文段落，用来说明产品怎么用。</p><p>第二段也是中文。</p>"), "zh", 0],
    ["English paragraph in a Chinese page fails", zh("<p>这是一个完整的中文段落，用来说明产品怎么用，内容足够长，可以通过比例。这是一个完整的中文段落，用来说明产品怎么用。</p><p>This card still says what the product does in English words only.</p>"), "zh", 1],
    ["split English sentence across inline tags fails", zh("<p>这是一段足够长的中文说明文字，用于比例计算。这是一段足够长的中文说明文字。</p><p>Read <a href=/x>your repository</a> on the half that <em>unfolds</em> right now today</p>"), "zh", 1],
    ["short lang=en example phrase passes", zh("<p>这是一个完整的中文段落，用来说明口语练习怎么做，内容足够长。</p><p lang=\"en\">Could you say that again more slowly please, thank you so much?</p>"), "zh", 0],
    ["whole article marked lang=en fails on ratio", zh(`<article lang="en"><p>${"Every word here is English and the page is meant for Chinese readers. ".repeat(6)}</p></article>`), "zh", 2],
    ["code is not prose", zh("<p>运行下面的命令安装，安装完成后重新打开终端窗口即可开始使用本工具。</p><pre><code>npm install the package and then run the command with these flags</code></pre>"), "zh", 0],
    ["a marked English option list does not weigh on the ratio", zh('<p>这是一个完整的中文段落，用来说明怎么填写国籍这一栏。</p><select>' + '<option lang="en">REPUBLIC OF THE CONGO</option><option lang="en">UNITED STATES OF AMERICA</option>'.repeat(20) + '</select>'), "zh", 0],
    ["English twin hidden by class is skipped", zh("<p>中文说明在这里，内容足够长，可以说明产品的用途和用法。</p><p class=\"lang-en\">This is the English twin of the paragraph above it.</p>"), "zh", 0],
    ["twins named by attribute are skipped", en('<h1><span data-ui-lang="en">One tech event, one graph</span><span data-ui-lang="zh">一件科技事件，一张传导链图，下面这一段说明为什么这样排版并且足够长足够长足够长</span></h1>'), "en", 0],
    ["English page with Chinese fails", en("<p>An English paragraph.</p><p>价格页</p>"), "en", 1],
    ["English page with brand name passes", en("<p>Practice with 签屿 before the interview.</p>"), "en", 0],
    ["English page with switcher label passes", `<html lang="en"><body><nav><a lang="zh-CN" href="/zh">中文</a></nav><main><p>English text only.</p></main></body></html>`, "en", 0],
    ["English page with a long lang=zh block fails", en("<p lang=\"zh-CN\">这是一整段中文速答，放在英文页面上，读者看到的是中文，不应该出现在英文模式。哪怕标了语言属性，整段中文也说明英文页没有写成英文。</p>"), "en", 1],
    ["a route that is Chinese by decision accepts marked Chinese", en('<div lang="zh-CN"><p>这是一整段只用中文写成的内容，按决定对所有读者都用中文显示，英文页面上也一样，所以标了语言属性就可以通过检查。</p></div>'), "en", 0, { _zhContent: true }],
    ["English page with a short marked Chinese term passes", en("<p>Averaging down (<span lang=\"zh-CN\">摊低成本</span>) means buying more as the price falls.</p>"), "en", 0],
    ["empty Chinese page fails", zh(""), "zh", 1],
    ["English button label in a Chinese page fails", zh("<p>这是一个完整的中文段落，用来说明怎么联系我们，内容足够长。</p><label>Name</label><button>Send message</button>"), "zh", 1],
    ["brand name alone in a Chinese page passes", zh("<p>这是一个完整的中文段落，用来说明在哪里下载，内容足够长。</p><p>Google Play</p><p>Galaxy Z Fold 7</p>"), "zh", 0],
    ["an email address in a Chinese footer is not a label", zh("<p>这是一个完整的中文段落，用来说明怎么联系我们，内容足够长。</p><footer><p>© 2026 DuoCode Technology · contact@example.net</p></footer>"), "zh", 0],
    ["English title in Chinese mode fails", `<html lang="zh-CN"><head><title>Learn to Read Technology Stocks</title></head><body><main><p>中文正文足够长，说明这个页面的内容，中文正文足够长。</p></main></body></html>`, "zh", 1],
  ];
  let bad = 0;
  for (const [name, html, mode, want, extra] of cases) {
    const got = judge(analyze(html, mode, { enTwinClass: "(?:^|\\s)lang-en(?:\\s|$)", twinAttr: "data-ui-lang" }), mode, { ...cfg, ...(extra ?? {}) });
    const ok = want === 0 ? got.length === 0 : got.length >= 1 && (want < 2 || got.length >= want);
    if (!ok) { bad++; console.error(`self-test FAIL: ${name}: ${JSON.stringify(got)}`); }
  }
  const png = Buffer.from("89504e470d0a1a0a0000000d49484452", "hex");
  if (imageKind(png) !== "png" || imageKind(Buffer.from("<!doctype html><html>not an image</html>")) !== null) { bad++; console.error("self-test FAIL: image sniffing"); }
  if (bad) { console.error(`zh-coverage self-test FAILED (${bad})`); process.exit(1); }
  console.log(`zh-coverage self-test OK — ${cases.length + 1} cases`);
}

// ---------------------------------------------------------------- main
async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--self-test")) return selfTest();
  selfTest();
  const cfgPath = resolve(argv.find((a) => !a.startsWith("--")) ?? "zh-coverage.json");
  const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
  const base = dirname(cfgPath);
  const src = cfg.static ? await staticSource(cfg, base) : await serverSource(cfg, base);
  const problems = [...(src.fetchFailures ?? [])];
  const stats = { zh: 0, en: 0, redirect: 0, other: 0 };
  const stayedEnglish = [];
  const iconRefs = new Map();
  try {
    for (const p of src.pages) {
      if (p.redirect !== undefined) { stats.redirect++; continue; }
      const a = analyze(p.html, null, cfg);
      const lang = (a.htmlLang || "").toLowerCase();
      let mode = cfg.modeFrom === "request" && p.requested ? (p.requested.startsWith("zh") ? "zh" : "en") : lang.startsWith("zh") ? "zh" : lang.startsWith("en") ? "en" : null;
      const byRoute = (cfg.routeModes ?? []).find(([re]) => new RegExp(re).test(p.route ?? p.id));
      if (byRoute) mode = byRoute[1];
      if (!mode) { stats.other++; continue; }
      if (p.requested && p.requested.startsWith("zh") && mode === "en") stayedEnglish.push(p.route ?? p.id);
      if ((cfg.englishOnly ?? []).some((x) => new RegExp(x).test(p.route ?? p.id)) && mode === "zh") {
        // An English-only page by decision (legal text that must match its
        // Malay twin): Chinese mode must say so in Chinese at the top.
        const notice = cfg.englishOnlyNotice ?? "本页为英文";
        if (!p.html.includes(notice)) problems.push(`${p.id}: English-only page shows no "${notice}" notice in Chinese mode`);
        stats.zh++;
        continue;
      }
      stats[mode]++;
      const page = analyze(p.html, mode, cfg);
      if (argv.includes("--list")) { const L = letters(page.scopeText); console.log(`page ${p.id} mode=${mode} han=${L ? Math.round((100 * count(page.scopeText, HAN)) / L) : 0}%`); }
      const zhContent = (cfg.zhContentRoutes ?? []).some((x) => new RegExp(x).test(p.route ?? p.id));
      for (const f of judge(page, mode, zhContent ? { ...cfg, _zhContent: true } : cfg)) problems.push(`${p.id}: ${f}`);
      for (const ic of page.icons) if (!iconRefs.has(ic.href)) iconRefs.set(ic.href, { ...ic, page: p });
    }
    problems.push(...checkCatalogs(cfg, base));
    // Every run proves the rules can fail on this product's own pages: one
    // real Chinese page gets an untranslated English paragraph, one real
    // English page gets a line of Chinese, and both must be caught. A rule
    // that stopped seeing <main> (a markup change, a new wrapper) would
    // otherwise pass everything silently.
    const sample = (m) => src.pages.find((p) => p.html && analyze(p.html, null, cfg).htmlLang?.toLowerCase().startsWith(m) && !(cfg.englishOnly ?? []).some((x) => new RegExp(x).test(p.route ?? p.id)));
    const zp = cfg.modeFrom === "request" ? src.pages.find((p) => p.html && p.requested?.startsWith("zh")) : sample("zh");
    const ep = cfg.modeFrom === "request" ? src.pages.find((p) => p.html && p.requested?.startsWith("en")) : sample("en");
    const inject = (html, para) => html.replace(/<\/main>/i, `${para}</main>`) !== html ? html.replace(/<\/main>/i, `${para}</main>`) : html.replace(/<\/body>/i, `${para}</body>`);
    if (zp && judge(analyze(inject(zp.html, "<p>This paragraph was never translated, so a reader who chose Chinese sees English here.</p>"), "zh", cfg), "zh", cfg).length === 0) problems.push(`the rules are blind: an English paragraph added to ${zp.id} was not caught`);
    if (ep && judge(analyze(inject(ep.html, "<p>这一段中文不该出现在英文页面上</p>"), "en", cfg), "en", cfg).length === 0) problems.push(`the rules are blind: Chinese added to ${ep.id} was not caught`);
    if (stats.zh < (cfg.minPages?.zh ?? 1)) problems.push(`only ${stats.zh} Chinese page(s) read (minimum ${cfg.minPages?.zh ?? 1}) — the page list is broken, not clean`);
    if (stats.en < (cfg.minPages?.en ?? 1)) problems.push(`only ${stats.en} English page(s) read (minimum ${cfg.minPages?.en ?? 1})`);
    // Icons: every declared icon, and every icon a manifest lists.
    const pinned = new Set(Object.values(cfg.icons?.pinned ?? {}).flat());
    const checked = new Set();
    const checkIcon = async (href, page, from) => {
      const key = href.split("#")[0];
      if (checked.has(key)) return; checked.add(key);
      const r = await src.loadIcon(href, page);
      if (r.error) { problems.push(`icon ${href} (${from}): ${r.error}`); return; }
      const kind = imageKind(r.buf);
      if (!kind) { problems.push(`icon ${href} (${from}): not an image`); return; }
      const h = sha256(r.buf);
      if (cfg.icons?.pinned && !pinned.has(h)) problems.push(`icon ${href} (${from}): ${kind} sha256 ${h.slice(0, 16)}… is not one of the product's pinned icons`);
    };
    for (const ic of iconRefs.values()) {
      if (ic.rel.includes("manifest")) {
        const r = await src.loadIcon(ic.href, ic.page);
        if (r.error) { problems.push(`manifest ${ic.href}: ${r.error}`); continue; }
        let man; try { man = JSON.parse(r.buf.toString("utf8")); } catch { problems.push(`manifest ${ic.href}: not JSON`); continue; }
        const mbase = new URL(ic.href, "http://x" + (ic.page.route ?? "/" + ic.page.id));
        for (const i of man.icons ?? []) await checkIcon(new URL(i.src, mbase).pathname, ic.page, `manifest ${ic.href}`);
      } else await checkIcon(ic.href, ic.page, ic.page.id);
    }
    if (![...iconRefs.values()].some((i) => i.rel.includes("icon"))) problems.push("no page declares an icon");
  } finally { await src.close(); }

  const head = `${stats.zh} Chinese page(s), ${stats.en} English page(s)${stats.redirect ? `, ${stats.redirect} redirect(s)` : ""}`;
  if (stayedEnglish.length && cfg.reportStayedEnglish !== false) console.log(`note: ${stayedEnglish.length} route(s) answer a Chinese request with an English page (no Chinese version): ${stayedEnglish.slice(0, 8).join(", ")}${stayedEnglish.length > 8 ? " …" : ""}`);
  if (problems.length) {
    for (const p of problems) console.error(p);
    console.error(`zh-coverage FAILED — ${problems.length} problem(s); ${head}.`);
    process.exit(1);
  }
  console.log(`zh-coverage OK — ${head}; icons ${iconRefs.size} link(s) checked.`);
}

main().catch((e) => { console.error(`zh-coverage: ${e.stack || e.message}`); process.exit(1); });
