// Normalizing what the Covate MCP's sync client posts to /api/ingest.
//
// The client (covate.platform_sync) sends timestamps as ISO 8601 with a UTC offset
// and answers as option text with is_correct worked out. Clients from before that
// sent what the MCP stores locally: Unix seconds for started_at, a letter label
// ("A" = first option) for user_answer and is_correct null. Both are accepted, so a
// ledger deploy doesn't strand the clients already installed.

export type IncomingAnswer = {
  question?: unknown;
  options?: unknown;
  correct_answer?: unknown;
  user_answer?: unknown;
  is_correct?: unknown;
  explanation?: unknown;
  topic?: unknown;
  concept?: unknown;
};

export type NormalizedAnswer = {
  question: string;
  options: unknown;
  correct_answer: string | null;
  user_answer: string | null;
  is_correct: boolean | null;
  explanation: string | null;
  topic: string | null;
  concept: string | null;
};

// Date, optional time with fraction, optional zone. Postgres still does the parsing;
// this only turns input it would choke on into a 400 instead of a 500.
const ISO_8601 = /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
const UNIX_TIME = /^\d+(?:\.\d+)?$/;
const LABELLED = /^([A-Za-z])\s*[).:]\s+/;

/**
 * A client timestamp as text Postgres will read as timestamptz, null when absent, or
 * undefined when it is neither ISO 8601 nor Unix time (seconds; milliseconds above 1e11).
 */
export function normalizeTimestamp(value: unknown): string | null | undefined {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "string" && ISO_8601.test(value.trim())) return value.trim();
  const unix = typeof value === "number" ? value : typeof value === "string" && UNIX_TIME.test(value.trim()) ? Number(value) : NaN;
  if (!Number.isFinite(unix) || unix < 0) return undefined;
  const date = new Date(unix >= 1e11 ? unix : unix * 1000);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/**
 * The 0-based option an answer names, or null. Same rule as the MCP and the quiz page
 * (cases in tests/fixtures/answer_cases.json): option text first, then a letter label,
 * a 0-based index, or a labelled "B) ..." answer.
 */
export function optionIndex(value: unknown, options: unknown[]): number | null {
  const inRange = (i: number) => (Number.isInteger(i) && i >= 0 && i < options.length ? i : null);
  if (options.length === 0) return null;
  if (typeof value === "number") return inRange(value);
  if (typeof value !== "string") return null;
  const text = value.trim();
  const texts = options.map((o) => String(o).trim());
  let i = texts.indexOf(text);
  if (i < 0) i = texts.map((t) => t.toLowerCase()).indexOf(text.toLowerCase());
  if (i >= 0) return i;
  if (/^[A-Za-z]$/.test(text)) return inRange(text.toUpperCase().charCodeAt(0) - 65);
  if (/^\d+$/.test(text)) return inRange(Number(text));
  const labelled = text.match(LABELLED);
  return labelled ? inRange(labelled[1].toUpperCase().charCodeAt(0) - 65) : null;
}

const textOrNull = (v: unknown) => (v === null || v === undefined ? null : String(v));

/** Answers as option text with is_correct filled in; null for an answer with no question. */
export function normalizeAnswer(a: IncomingAnswer): NormalizedAnswer | null {
  if (!a || typeof a !== "object" || !a.question) return null;
  const options = Array.isArray(a.options) ? a.options : [];
  const correct = optionIndex(a.correct_answer, options);
  const picked = optionIndex(a.user_answer, options);
  return {
    question: String(a.question),
    options: a.options ?? null,
    correct_answer: correct !== null ? String(options[correct]) : textOrNull(a.correct_answer),
    user_answer: picked !== null ? String(options[picked]) : textOrNull(a.user_answer),
    is_correct:
      typeof a.is_correct === "boolean" ? a.is_correct : correct !== null && picked !== null ? correct === picked : null,
    explanation: textOrNull(a.explanation),
    topic: textOrNull(a.topic),
    concept: textOrNull(a.concept),
  };
}
