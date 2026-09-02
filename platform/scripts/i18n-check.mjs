#!/usr/bin/env node
// i18n red lines for the covate platform (wired into `npm run build`, so the sanctioned
// `vercel build --prod` release path cannot ship a violation):
//   1. Locale parity — every key in messages/en/<domain>.json exists in every other locale
//      and vice versa, arrays included, so a missing translation fails the build instead
//      of silently falling back to the wrong language.
//   2. CJK hardcode red line — no Han characters in app/**/*.{ts,tsx} or proxy.ts outside
//      the files listed with a reason in i18n-exemptions.json.
//   3. Key existence — every `t("…")` / `t.rich("…")` / `t.raw("…")` call in the source
//      resolves to a key in the English catalog, so a typo cannot render as a raw key.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = join(import.meta.dirname, "..");
const messagesDir = join(root, "messages");
const exemptionsPath = join(root, "i18n-exemptions.json");
let failed = false;

function flatten(value, prefix = "", out = new Map()) {
  if (Array.isArray(value)) {
    out.set(prefix, `array[${value.length}]`);
    value.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  } else {
    out.set(prefix, typeof value);
  }
  return out;
}

// ---- 1. locale parity ----
const locales = readdirSync(messagesDir).filter((d) => statSync(join(messagesDir, d)).isDirectory()).sort();
const catalog = {};
for (const locale of locales) {
  catalog[locale] = {};
  for (const f of readdirSync(join(messagesDir, locale))) {
    if (!f.endsWith(".json")) continue;
    catalog[locale][f.replace(/\.json$/, "")] = JSON.parse(readFileSync(join(messagesDir, locale, f), "utf8"));
  }
}
const base = "en";
if (!catalog[base]) {
  console.error("✗ messages/en is missing");
  process.exit(1);
}
let keyTotal = 0;
for (const other of locales.filter((l) => l !== base)) {
  for (const domain of new Set([...Object.keys(catalog[base]), ...Object.keys(catalog[other])])) {
    const a = flatten(catalog[base][domain] ?? {});
    const b = flatten(catalog[other][domain] ?? {});
    const onlyA = [...a.keys()].filter((k) => !b.has(k));
    const onlyB = [...b.keys()].filter((k) => !a.has(k));
    const typeDiff = [...a.keys()].filter((k) => b.has(k) && a.get(k) !== b.get(k));
    if (onlyA.length || onlyB.length || typeDiff.length) {
      failed = true;
      console.error(`✗ locale parity: ${domain}.json ${base} vs ${other}`);
      if (onlyA.length) console.error(`  missing in ${other}: ${onlyA.join(", ")}`);
      if (onlyB.length) console.error(`  missing in ${base}: ${onlyB.join(", ")}`);
      if (typeDiff.length) console.error(`  shape differs: ${typeDiff.map((k) => `${k} (${a.get(k)} vs ${b.get(k)})`).join(", ")}`);
    }
  }
}
for (const domain of Object.keys(catalog[base])) keyTotal += [...flatten(catalog[base][domain]).values()].filter((t) => t === "string").length;
if (!failed) console.log(`✓ locale parity across [${locales.join(", ")}] — ${keyTotal} strings per locale`);

// ---- source files ----
const sources = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(name)) sources.push(p);
  }
}
walk(join(root, "app"));
for (const extra of ["proxy.ts", "next.config.ts"]) if (existsSync(join(root, extra))) sources.push(join(root, extra));

// ---- 2. CJK hardcode red line ----
const han = /\p{Script=Han}/u;
const exempt = new Map();
if (!existsSync(exemptionsPath)) {
  console.error(`✗ missing ${relative(root, exemptionsPath)}`);
  process.exit(1);
}
for (const e of JSON.parse(readFileSync(exemptionsPath, "utf8")).files) exempt.set(e.path.split("/").join(sep), e.reason);
const offenders = [];
const exemptedHits = [];
for (const file of sources) {
  const rel = relative(root, file);
  if (!han.test(readFileSync(file, "utf8"))) continue;
  if (exempt.has(rel)) exemptedHits.push(rel);
  else offenders.push(rel);
}
if (offenders.length) {
  failed = true;
  console.error(`✗ CJK hardcode red line: ${offenders.length} non-exempt file(s) contain Han:`);
  for (const f of offenders) console.error(`  ${f} (migrate to messages/, or add to i18n-exemptions.json with a reason)`);
}
const stale = [...exempt.keys()].filter((p) => !sources.some((s) => relative(root, s) === p));
for (const s of stale) console.warn(`⚠ stale exemption (file gone): ${s}`);
console.log(`✓ CJK hardcode red line: ${offenders.length} offenders, ${exemptedHits.length} exempted file(s), ${stale.length} stale exemption(s)`);

// ---- 3. every t("key") resolves ----
const enFlat = new Map();
for (const [domain, data] of Object.entries(catalog[base])) for (const [k, v] of flatten(data)) enFlat.set(`${domain}.${k}`, v);
const enPrefixes = new Set();
for (const k of enFlat.keys()) {
  const parts = k.split(".");
  for (let i = 1; i <= parts.length; i++) enPrefixes.add(parts.slice(0, i).join("."));
}
let calls = 0;
const unresolved = [];
for (const file of sources) {
  const src = readFileSync(file, "utf8");
  // A file may declare `const t = getTranslations("…")` several times (one per component);
  // a call binds to the nearest preceding declaration of the same variable.
  const decls = [];
  for (const m of src.matchAll(/const\s+(\w+)\s*=\s*(?:await\s+)?(?:getTranslations|useTranslations)\(\s*"([\w.]+)"\s*\)/g)) decls.push({ name: m[1], ns: m[2], at: m.index });
  if (!decls.length) continue;
  for (const m of src.matchAll(/\b(\w+)(?:\.(?:rich|raw|markup|has))?\(\s*"([^"]+)"/g)) {
    const decl = decls.filter((d) => d.name === m[1] && d.at < m.index).at(-1);
    if (!decl) continue;
    const ns = decl.ns;
    calls++;
    const full = `${ns}.${m[2]}`;
    if (!enFlat.has(full) && !enPrefixes.has(full)) unresolved.push(`${relative(root, file)}: ${m[1]}("${m[2]}") → ${full}`);
  }
}
if (unresolved.length) {
  failed = true;
  console.error(`✗ ${unresolved.length} translation call(s) do not resolve in messages/en:`);
  for (const u of unresolved) console.error(`  ${u}`);
} else console.log(`✓ ${calls} translation call(s) resolve in messages/en`);

process.exit(failed ? 1 : 0);
