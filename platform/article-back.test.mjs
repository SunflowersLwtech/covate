// The way back from a Learning Center article, in real browsers (Chromium and WebKit)
// against the production build: `next build` first, then `npm run test:article-back`.
// Set HEADER_TEST_BASE=http://host:port to test a server that is already running.
//
// On a phone the header's "Learn" is folded into the menu, and the only way back to the
// hub used to be the 14px "Covate / Learning Center" crumbs. The UI/UX audit also read
// the closed menu's "Learn" as an unlabelled header link that did nothing when tapped.
// What has to hold: on a phone the first screen of every article has one labelled link to
// /learn, at least 44px tall, and tapping it opens /learn; on a desktop the crumbs stay as
// they were; and no link with a box in the header is without a label.
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { chromium, webkit } from "playwright";

const ARTICLES = ["/learn/what-is-vibe-coding", "/learn/how-to-learn-a-new-codebase-fast"];
const PHONE_WIDTHS = [320, 390, 430];
const LABEL = { en: "← Learning Center", "zh-CN": "← 学习中心" };
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

// Runs in the page: every link to /learn a visitor can see, and every header link that
// has a box but no label (the shape the audit flagged).
function inspectArticle() {
  const shown = (el) => {
    const b = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return b.width > 1 && b.height > 1 && s.display !== "none" && s.visibility !== "hidden";
  };
  const h1 = document.querySelector("main h1");
  const toLearn = [...document.querySelectorAll("a[href]")]
    .filter((a) => new URL(a.href).pathname.replace(/\/+$/, "") === "/learn")
    .filter(shown)
    .map((a) => {
      const b = a.getBoundingClientRect();
      return {
        text: a.innerText.replace(/\s+/g, " ").trim(),
        top: b.top + scrollY,
        height: b.height,
        inHeader: !!a.closest("header"),
        aboveTitle: h1 ? b.bottom <= h1.getBoundingClientRect().top + 1 : false,
      };
    });
  const unlabelled = [...document.querySelectorAll("header a[href]")]
    .filter(shown)
    .filter((a) => !a.innerText.trim() && !a.getAttribute("aria-label") && !a.querySelector("img[alt]:not([alt=''])"))
    .map((a) => a.getAttribute("href"));
  return { viewportHeight: innerHeight, toLearn, unlabelled, crumbShown: !!document.querySelector('nav[aria-label="Breadcrumb"]') && shown(document.querySelector('nav[aria-label="Breadcrumb"]')) };
}

async function open(browser, locale, width) {
  const phone = width < 640;
  const ctx = await browser.newContext({
    viewport: { width, height: phone ? 844 : 900 },
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
  test(`${name}: a phone gets a labelled 44px way back to /learn at the top of every article`, { timeout: 300_000 }, async () => {
    const browser = await engine.launch(LAUNCH[name]);
    const problems = [];
    try {
      for (const locale of ["en", "zh-CN"]) {
        for (const width of PHONE_WIDTHS) {
          const ctx = await open(browser, locale, width);
          const page = await ctx.newPage();
          for (const path of ARTICLES) {
            const where = `${locale} ${width} ${path}`;
            await load(page, path);
            const m = await page.evaluate(inspectArticle);
            if (m.unlabelled.length) problems.push(`${where}: header links with a box and no label: ${JSON.stringify(m.unlabelled)}`);
            if (m.crumbShown) problems.push(`${where}: the desktop crumbs are showing on a phone`);
            const top = m.toLearn.filter((l) => l.aboveTitle && l.top < m.viewportHeight);
            if (top.length !== 1) {
              problems.push(`${where}: want one link to /learn above the title, found ${JSON.stringify(top)}`);
              continue;
            }
            const [back] = top;
            if (back.text !== LABEL[locale]) problems.push(`${where}: the way back reads ${JSON.stringify(back.text)}, want ${JSON.stringify(LABEL[locale])}`);
            if (back.height < 44) problems.push(`${where}: the way back is ${back.height}px tall, want >= 44`);
            if (back.text !== LABEL[locale]) continue; // nothing labelled to tap
            await page.getByRole("link", { name: LABEL[locale], exact: true }).tap({ timeout: 5_000 });
            await page.waitForURL((u) => u.pathname.replace(/\/+$/, "") === "/learn", { timeout: 10_000 }).catch(() => {});
            const landed = new URL(page.url()).pathname.replace(/\/+$/, "");
            if (landed !== "/learn") problems.push(`${where}: tapping the way back opened ${landed}, want /learn`);
          }
          await ctx.close();
        }
      }
    } finally {
      await browser.close();
    }
    assert.deepEqual(problems, []);
  });

  test(`${name}: a desktop keeps the crumbs and shows no phone back link`, { timeout: 120_000 }, async () => {
    const browser = await engine.launch(LAUNCH[name]);
    const problems = [];
    try {
      for (const locale of ["en", "zh-CN"]) {
        const ctx = await open(browser, locale, 1440);
        const page = await ctx.newPage();
        for (const path of ARTICLES) {
          const where = `${locale} 1440 ${path}`;
          await load(page, path);
          const m = await page.evaluate(inspectArticle);
          if (!m.crumbShown) problems.push(`${where}: the crumbs are not showing`);
          if (m.toLearn.some((l) => l.text === LABEL[locale])) problems.push(`${where}: the phone back link is showing on a desktop`);
          if (!m.toLearn.some((l) => l.inHeader)) problems.push(`${where}: the header has no link to /learn`);
          if (m.unlabelled.length) problems.push(`${where}: header links with a box and no label: ${JSON.stringify(m.unlabelled)}`);
        }
        await ctx.close();
      }
    } finally {
      await browser.close();
    }
    assert.deepEqual(problems, []);
  });
}
