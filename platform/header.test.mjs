// The site header on phone widths, in real browsers (Chromium and WebKit) against the
// production build: `next build` first, then `npm run test:header`. Set
// HEADER_TEST_BASE=http://host:port to test a server that is already running.
//
// On a 393px iPhone the header used to be one row that did not fit: "How it works"
// and the language switch each broke onto two lines and the logo's dot touched
// "Learn". What has to hold on every phone width, every page and both languages:
// the header is one row, no control breaks onto a second line, the logo keeps clear
// of the nav, nothing scrolls sideways — and every link the desktop header offers
// can still be reached, in the row or in a menu that opens from it.
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { chromium, webkit } from "playwright";

const PAGES = ["/", "/learn", "/learn/how-to-learn-a-new-codebase-fast", "/privacy", "/dashboard", "/no-such-page"];
const PHONE_WIDTHS = [320, 360, 393, 412, 430, 600];
const MIN_LOGO_GAP = 16;
const ENGINES = { chromium, webkit };
const LAUNCH = { chromium: { args: ["--use-mock-keychain", "--password-store=basic"] }, webkit: {} };

let base = process.env.HEADER_TEST_BASE;
let server;

function freePort() {
  return new Promise((resolve, reject) => {
    const s = createServer();
    s.once("error", reject);
    s.listen(0, "127.0.0.1", () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });
}

before(async () => {
  if (base) return;
  const port = await freePort();
  base = `http://127.0.0.1:${port}`;
  server = spawn("node_modules/.bin/next", ["start", "-H", "127.0.0.1", "-p", String(port)], {
    cwd: import.meta.dirname,
    stdio: ["ignore", "ignore", "inherit"],
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  });
  for (let i = 0; i < 120; i++) {
    if (server.exitCode !== null) throw new Error(`next start exited with ${server.exitCode}`);
    try {
      if ((await fetch(base + "/version.json")).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error("next start did not come up within 30s");
});

after(() => {
  server?.kill();
});

// Runs in the page. Only things a visitor can see count: zero-size boxes (display:
// none, a closed <details>) are skipped.
function inspectHeader() {
  const box = (el) => el.getBoundingClientRect();
  const shown = (el) => {
    const b = box(el);
    return b.width > 0 && b.height > 0 && getComputedStyle(el).visibility !== "hidden";
  };
  // Lines of text: tops of the element's text-node boxes, clustered (an image is not a line).
  const lines = (el) => {
    const tops = [];
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      if (!n.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const q of range.getClientRects()) if (q.width > 0) tops.push(q.top);
    }
    tops.sort((a, b) => a - b);
    let count = 0;
    let last = -Infinity;
    for (const t of tops) {
      if (t > last + 4) count++;
      last = t;
    }
    return count;
  };
  const header = document.querySelector("header");
  const row = [...header.children].filter(shown);
  const logo = row[0];
  const centers = row.map((el) => box(el).top + box(el).height / 2);
  const controls = [...header.querySelectorAll("a, button, summary")].filter(shown).filter((el) => el !== logo);
  return {
    viewport: window.innerWidth,
    overflowPx: document.documentElement.scrollWidth - window.innerWidth,
    rowSpreadPx: Math.max(...centers) - Math.min(...centers),
    logoGapPx: row.length > 1 ? box(row[1]).left - box(logo).right : null,
    logoLines: lines(logo),
    controls: controls.map((el) => ({
      text: el.innerText.trim(),
      lines: lines(el),
      left: box(el).left,
      right: box(el).right,
    })),
    links: [...header.querySelectorAll("nav a")].filter(shown).map((el) => el.getAttribute("href")),
    toggles: [...header.querySelectorAll("summary, button[aria-expanded]")].filter(shown).length,
  };
}

function layoutProblems(m, where) {
  const out = [];
  if (m.overflowPx > 0) out.push(`${where}: page scrolls sideways by ${m.overflowPx}px`);
  if (m.rowSpreadPx > 3) out.push(`${where}: header is not one row (centers ${m.rowSpreadPx.toFixed(1)}px apart)`);
  if (m.logoGapPx !== null && m.logoGapPx < MIN_LOGO_GAP)
    out.push(`${where}: logo is ${m.logoGapPx.toFixed(1)}px from the nav (want >= ${MIN_LOGO_GAP})`);
  if (m.logoLines > 1) out.push(`${where}: logo text wraps`);
  for (const c of m.controls) {
    if (c.lines > 1) out.push(`${where}: "${c.text.replace(/\s+/g, " ")}" wraps onto ${c.lines} lines`);
    if (c.left < 0 || c.right > m.viewport + 0.5) out.push(`${where}: "${c.text}" is outside the viewport`);
  }
  return out;
}

const sameSet = (a, b) => a.length === b.length && [...a].sort().join("\n") === [...b].sort().join("\n");

async function open(browser, locale, width) {
  const phone = width < 640;
  const ctx = await browser.newContext({
    viewport: { width, height: phone ? 852 : 900 },
    ...(phone ? { isMobile: true, hasTouch: true } : {}),
  });
  await ctx.addCookies([{ name: "covate_locale", value: locale, url: base }]);
  return ctx;
}

async function load(page, path) {
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

for (const [name, engine] of Object.entries(ENGINES)) {
  test(`${name}: phone-width header fits on one row and keeps every desktop link reachable`, { timeout: 600_000 }, async () => {
    const browser = await engine.launch(LAUNCH[name]);
    const problems = [];
    try {
      for (const locale of ["en", "zh-CN"]) {
        // What the desktop header offers on each page: the reference for reachability.
        const expected = {};
        const desk = await open(browser, locale, 1280);
        const dp = await desk.newPage();
        for (const path of PAGES) {
          await load(dp, path);
          const m = await dp.evaluate(inspectHeader);
          problems.push(...layoutProblems(m, `${locale} 1280 ${path}`));
          if (m.toggles) problems.push(`${locale} 1280 ${path}: a menu toggle is showing on desktop`);
          if (m.links.length === 0) problems.push(`${locale} 1280 ${path}: desktop header shows no links`);
          expected[path] = m.links;
        }
        await desk.close();

        for (const width of PHONE_WIDTHS) {
          const ctx = await open(browser, locale, width);
          const page = await ctx.newPage();
          for (const path of PAGES) {
            const where = `${locale} ${width} ${path}`;
            await load(page, path);
            const m = await page.evaluate(inspectHeader);
            problems.push(...layoutProblems(m, where));
            if (sameSet(m.links, expected[path])) continue;
            // Not all in the row: there has to be one menu that shows the rest.
            const toggle = page.locator("header summary, header button[aria-expanded]").filter({ visible: true });
            if ((await toggle.count()) !== 1) {
              problems.push(`${where}: shows ${JSON.stringify(m.links)} of ${JSON.stringify(expected[path])} and has no menu`);
              continue;
            }
            await toggle.click();
            const o = await page.evaluate(inspectHeader);
            if (!sameSet(o.links, expected[path]))
              problems.push(`${where}: with the menu open shows ${JSON.stringify(o.links)}, desktop has ${JSON.stringify(expected[path])}`);
            problems.push(...layoutProblems(o, `${where} (menu open)`));
          }
          await ctx.close();
        }
      }
    } finally {
      await browser.close();
    }
    assert.deepEqual(problems, []);
  });

  test(`${name}: the phone menu closes on Escape, on a tap outside and after a link`, { timeout: 120_000 }, async () => {
    const browser = await engine.launch(LAUNCH[name]);
    try {
      const ctx = await open(browser, "en", 393);
      const page = await ctx.newPage();
      await load(page, "/");
      const details = page.locator("header details");
      const toggle = page.locator("header summary");
      const isOpen = () => details.evaluate((d) => d.open);
      const waitClosed = (why) =>
        page.waitForFunction(() => !document.querySelector("header details").open, null, { timeout: 5_000 }).catch(() => {
          throw new Error(`menu still open after ${why}`);
        });

      await toggle.click();
      assert.equal(await isOpen(), true, "menu did not open");
      await page.keyboard.press("Escape");
      await waitClosed("Escape");

      await toggle.click();
      assert.equal(await isOpen(), true, "menu did not reopen");
      await page.mouse.click(8, 600);
      await waitClosed("a tap outside");

      await toggle.click();
      await page.locator('header details a[href="#how"]').click();
      await waitClosed('following "How it works"');
      assert.equal(await page.evaluate(() => location.hash), "#how");
    } finally {
      await browser.close();
    }
  });
}
