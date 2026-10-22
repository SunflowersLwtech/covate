// Unit tests for lib/ingest.ts. Run with `npm run test:ingest` (node:test via tsx).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { normalizeAnswer, normalizeTimestamp, optionIndex, parseIngestBody, sessionTimes } from "./app/lib/ingest";

type AnswerCase = { options: unknown[]; value: unknown; index: number | null; why: string };
const CASES: AnswerCase[] = JSON.parse(
  readFileSync(new URL("../tests/fixtures/answer_cases.json", import.meta.url), "utf8"),
).cases;

describe("optionIndex follows the rule the MCP and the quiz page use", () => {
  for (const c of CASES) {
    it(`${c.why}: ${JSON.stringify(c.value)}`, () => {
      assert.equal(optionIndex(c.value, c.options), c.index);
    });
  }
});

describe("normalizeTimestamp", () => {
  it("passes ISO 8601 through untouched, keeping microseconds for Postgres to parse", () => {
    for (const iso of [
      "2026-10-22T17:31:35.152762+00:00",
      "2026-10-22T17:31:35Z",
      "2026-10-23T01:32:17.297955",
      "2026-10-23 01:32:17+08",
      "2026-10-23",
    ]) {
      assert.equal(normalizeTimestamp(iso), iso);
    }
  });

  it("reads Unix seconds, as a number or a string, the way clients before the fix sent them", () => {
    assert.equal(normalizeTimestamp(1792690295.152762), "2026-10-22T17:31:35.152Z");
    assert.equal(normalizeTimestamp("1792690295.152762"), "2026-10-22T17:31:35.152Z");
    assert.equal(normalizeTimestamp(1792690295152), "2026-10-22T17:31:35.152Z", "milliseconds");
  });

  it("treats a missing timestamp as null", () => {
    for (const v of [null, undefined, ""]) assert.equal(normalizeTimestamp(v), null);
  });

  it("rejects what is neither", () => {
    for (const v of ["yesterday", "2026/10/23", "1e9", -5, Number.NaN, Infinity, true, {}, []]) {
      assert.equal(normalizeTimestamp(v), undefined, JSON.stringify(v));
    }
  });

  it("rejects Unix time past year 9999, which would come out as +010000-… text", () => {
    assert.equal(normalizeTimestamp(253402300799999), "9999-12-31T23:59:59.999Z");
    assert.equal(normalizeTimestamp(253402300800000), undefined);
  });
});

describe("sessionTimes", () => {
  // The fixture session: started 1792690295.152762 (17:31:35Z), completed 42 s later on
  // a machine at UTC+8, which stored the completion as 01:32:17.297955 local.
  const STARTED = 1792690295.152762;
  const completedAt = (started: unknown, completed: unknown) => {
    const times = sessionTimes(started, completed);
    assert.ok(!("invalid" in times), JSON.stringify(times));
    return times.completedAt;
  };

  it("recovers the zone of a pre-fix client's local completion time from its Unix start", () => {
    assert.deepEqual(sessionTimes(STARTED, "2026-10-23T01:32:17.297955"), {
      startedAt: "2026-10-22T17:31:35.152Z",
      completedAt: "2026-10-23T01:32:17.297955+08:00",
    });
    // The same session recorded at UTC-5, at UTC+5:30, and at UTC.
    assert.equal(completedAt(STARTED, "2026-10-22T12:32:17.297955"), "2026-10-22T12:32:17.297955-05:00");
    assert.equal(completedAt(STARTED, "2026-10-22T23:02:17.297955"), "2026-10-22T23:02:17.297955+05:30");
    assert.equal(completedAt(`${STARTED}`, "2026-10-22T17:32:17.297955"), "2026-10-22T17:32:17.297955+00:00");
  });

  it("never puts completion before the start or after the real completion", () => {
    // 40 minutes at UTC+5:30 also fits +5:45 (25 minutes) and +6:00 (10 minutes); the
    // shortest reading wins, and it stays within the session either way.
    const at = Date.parse(completedAt(STARTED, "2026-10-22T23:41:35")!);
    assert.ok(at >= Date.parse("2026-10-22T17:31:35.152Z") && at <= Date.parse("2026-10-22T18:11:35Z"));
  });

  it("leaves zoned or current-client times alone", () => {
    assert.deepEqual(sessionTimes("2026-10-22T17:31:35.152762+00:00", "2026-10-22T17:32:17.297955+00:00"), {
      startedAt: "2026-10-22T17:31:35.152762+00:00",
      completedAt: "2026-10-22T17:32:17.297955+00:00",
    });
    assert.equal(completedAt(STARTED, "2026-10-22T17:32:17Z"), "2026-10-22T17:32:17Z");
    assert.equal(completedAt(STARTED, null), null);
  });

  it("does not guess when no zone gives a plausible session", () => {
    // Three days after the start: no offset makes that a session of at most two hours.
    assert.equal(completedAt(STARTED, "2026-10-26T01:32:17"), "2026-10-26T01:32:17");
  });

  it("names the field it cannot read", () => {
    assert.deepEqual(sessionTimes("yesterday", null), { invalid: "started_at" });
    assert.deepEqual(sessionTimes(STARTED, "soon"), { invalid: "completed_at" });
  });
});

describe("parseIngestBody", () => {
  it("drops NUL characters, which Postgres text and jsonb cannot hold, from every string", () => {
    const body = parseIngestBody(
      JSON.stringify({ client_id: "a\u0000b", answers: [{ question: "q\u0000", options: ["x\u0000y", "z"] }] }),
    );
    assert.deepEqual(body, { client_id: "ab", answers: [{ question: "q", options: ["xy", "z"] }] });
  });
});

describe("normalizeAnswer", () => {
  const legacy = JSON.parse(
    readFileSync(new URL("../tests/fixtures/real_session/legacy_ingest_body.json", import.meta.url), "utf8"),
  );

  it("turns a pre-fix client's letter picks into option text and works out is_correct", () => {
    const answers = legacy.answers.map(normalizeAnswer);
    assert.deepEqual(
      answers.map((a: ReturnType<typeof normalizeAnswer>) => [a?.user_answer, a?.correct_answer, a?.is_correct]),
      [
        ["To spread load", "To spread load", true],
        ["Nothing", "A max attempt count", false],
        ["503", "503", true],
      ],
    );
  });

  it("is a no-op on what the current client sends", () => {
    const current = {
      question: "q",
      options: ["x", "y"],
      correct_answer: "x",
      user_answer: "y",
      is_correct: false,
      explanation: "e",
      topic: "logic",
      concept: "c",
    };
    assert.deepEqual(normalizeAnswer(current), current);
  });

  it("keeps a client's is_correct and leaves unknowns null", () => {
    assert.equal(normalizeAnswer({ question: "q", options: ["x"], correct_answer: "x", user_answer: "A", is_correct: false })?.is_correct, false);
    const unknown = normalizeAnswer({ question: "q", options: ["x"], correct_answer: "z", user_answer: "A" });
    assert.equal(unknown?.user_answer, "x");
    assert.equal(unknown?.correct_answer, "z");
    assert.equal(unknown?.is_correct, null);
  });

  it("drops an answer without a question", () => {
    assert.equal(normalizeAnswer({ options: ["x"], user_answer: "A" }), null);
  });
});
