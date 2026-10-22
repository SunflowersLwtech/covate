// The quiz page's answer rule (modules/answers.js) against the cases the MCP and the
// ledger are tested with. Run with `node --test tests/answer_label.test.mjs`.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { answerLabel, optionIndex } from '../src/covate/web/static/learning/js/modules/answers.js';

const { cases } = JSON.parse(readFileSync(new URL('./fixtures/answer_cases.json', import.meta.url), 'utf8'));

describe('quiz page resolves answers like the MCP and the ledger', () => {
    for (const c of cases) {
        it(`${c.why}: ${JSON.stringify(c.value)}`, () => {
            assert.equal(optionIndex(c.value, c.options), c.index);
            assert.equal(answerLabel(c.value, c.options), c.index === null ? null : String.fromCharCode(65 + c.index));
        });
    }
});
