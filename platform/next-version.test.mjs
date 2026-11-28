// Next.js 16.0.0–16.4.4 is affected by seven advisories published 2026-11-16..19, all fixed in 16.4.5:
// GHSA-f3mh-rxg3-f5g2, GHSA-7qx7-33qx-rqx2, GHSA-pc58-hwjq-p385, GHSA-rhh4-g77r-r9qj,
// GHSA-vvgp-ww4w-46vf, GHSA-vc7v-qv4w-wrv8, GHSA-mfr8-8qww-v76h (GitHub advisory database, npm "next").
// covate.org was on 16.4.3. This holds the installed version and the declared range at or above the fix,
// offline, from the lockfile CI installs with `npm ci`.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const FIXED = [16, 4, 5];
const read = (name) => JSON.parse(readFileSync(new URL(name, import.meta.url), "utf8"));
const parts = (v) => v.replace(/^[\^~]/, "").split(/[.-]/).slice(0, 3).map(Number);
const atLeast = (v, min) => {
  const p = parts(v);
  for (let i = 0; i < 3; i++) if (p[i] !== min[i]) return p[i] > min[i];
  return true;
};

test("the lockfile installs a Next.js with the November 2026 security fixes (16.4.5 or later)", () => {
  const lock = read("./package-lock.json");
  const next = lock.packages["node_modules/next"]?.version;
  assert.ok(next, "no node_modules/next in package-lock.json");
  assert.ok(atLeast(next, FIXED), `next ${next} is affected by GHSA-f3mh-rxg3-f5g2 and six more: fixed in 16.4.5`);
  for (const [key, entry] of Object.entries(lock.packages)) {
    if (/^node_modules\/@next\/(env|swc-[^/]+)$/.test(key)) assert.equal(entry.version, next, `${key} must match next ${next}`);
  }
});

test("package.json does not allow a Next.js below the fix", () => {
  const range = read("./package.json").dependencies.next;
  assert.ok(atLeast(range, FIXED), `"next": "${range}" lets an install resolve below 16.4.5`);
});
