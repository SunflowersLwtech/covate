// The quiz page's dark theme is the covate.org palette. The values live twice: as hex in
// platform/app/globals.css (@theme) and as HSL triplets in the quiz page's .dark block.
// This fails when either side moves without the other.
// Run with `node --test tests/quiz_palette.test.mjs`.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const read = (rel) => readFileSync(new URL(rel, import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const siteCss = read('../platform/app/globals.css');
const quizCss = read('../src/covate/web/static/learning/css/styles.css');

// Body of the first `<selector> { ... }` block that starts a line.
function block(css, selector) {
    const start = css.search(new RegExp(`^${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`, 'm'));
    assert.notEqual(start, -1, `${selector} block not found`);
    const open = css.indexOf('{', start);
    let depth = 0;
    for (let i = open; i < css.length; i++) {
        if (css[i] === '{') depth++;
        if (css[i] === '}' && --depth === 0) return css.slice(open + 1, i);
    }
    throw new Error(`${selector} block is not closed`);
}

function declarations(body) {
    const out = {};
    for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[m[1]] = m[2].trim().replace(/\s+/g, ' ');
    return out;
}

const site = declarations(block(siteCss, '@theme inline'));
const quiz = declarations(block(quizCss, '.dark'));

function hslToHex(triplet) {
    const m = /^(-?[\d.]+) ([\d.]+)% ([\d.]+)%$/.exec(triplet);
    assert.ok(m, `not an "H S% L%" triplet: ${triplet}`);
    const h = Number(m[1]);
    const s = Number(m[2]) / 100;
    const l = Number(m[3]) / 100;
    const a = s * Math.min(l, 1 - l);
    const channel = (n) => {
        const k = (n + h / 30) % 12;
        const v = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
        return Math.round(v * 255).toString(16).padStart(2, '0');
    };
    return `#${channel(0)}${channel(8)}${channel(4)}`;
}

// quiz variable -> the site token it must equal
const COLORS = [
    ['--background', '--color-deep'],
    ['--card', '--color-surface'],
    ['--border', '--color-border'],
    ['--foreground', '--color-primary'],
    ['--muted-foreground', '--color-secondary'],
    ['--primary', '--color-accent'],
    ['--accent-foreground', '--color-accent-soft'],
    ['--info', '--color-brand-blue'],
    ['--chart-1', '--color-brand-blue'],
];

// The site wraps the next/font variable in front of the same fallback list.
const stack = (value) => value.replace(/^var\(--font-(sans|mono)\),\s*/, '');

describe('quiz page dark theme matches the covate.org palette', () => {
    for (const [name, token] of COLORS) {
        it(`${name} is ${token}`, () => {
            assert.ok(site[token], `platform/app/globals.css has no ${token}`);
            assert.ok(quiz[name], `quiz styles.css .dark has no ${name}`);
            assert.equal(
                hslToHex(quiz[name]),
                site[token].toLowerCase(),
                `.dark ${name} (${quiz[name]}) has drifted from ${token} in platform/app/globals.css`,
            );
        });
    }

    for (const kind of ['sans', 'mono']) {
        it(`--font-${kind} uses the site's ${kind} stack`, () => {
            const fonts = declarations(block(quizCss, ':root'));
            assert.equal(
                stack(fonts[`--font-${kind}`] ?? ''),
                stack(site[`--font-${kind}`]),
                `:root --font-${kind} has drifted from --font-${kind} in platform/app/globals.css`,
            );
        });
    }
});
