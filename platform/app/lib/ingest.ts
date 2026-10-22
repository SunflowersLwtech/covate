// Normalizing what the Covate MCP's sync client posts to /api/ingest.
//
// The client (covate.platform_sync) sends timestamps as ISO 8601 with a UTC offset
// and answers as option text with is_correct worked out. Clients from before that
// sent what the MCP stores locally: Unix seconds for started_at, a naive local time
// for completed_at, a letter label ("A" = first option) for user_answer and
// is_correct null. Both are accepted, so a ledger deploy doesn't strand the clients
// already installed.

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
const NAIVE_DATETIME = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/;
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
  // Past year 9999 toISOString() writes "+010000-…", which Postgres does not read.
  if (Number.isNaN(date.getTime()) || date.getUTCFullYear() > 9999) return undefined;
  return date.toISOString();
}

// UTC offsets in use somewhere, standard or summer time, in minutes.
const UTC_OFFSETS = [
  ...Array.from({ length: 27 }, (_, i) => (i - 12) * 60),
  -570, -210, -150, 210, 270, 330, 345, 390, 525, 570, 630, 765, 825,
];
// learning_session's longest timeout is two hours.
const LONGEST_SESSION_MINUTES = 125;

/**
 * started_at / completed_at as Postgres-readable text, or the name of the one that
 * is neither ISO 8601 nor Unix time.
 *
 * A pre-fix client sends completed_at as its local time with no zone, which Postgres
 * would read as UTC (8 hours late for a user at UTC+8). Its started_at is Unix time,
 * an absolute instant, so the zone is recovered from the pair: the UTC offset in use
 * that puts completion closest after the start. As long as the user's offset is in
 * UTC_OFFSETS, that never places completion before the start or after the real
 * completion, and is exact when no other offset fits inside the session's own
 * length (any session under 15 minutes).
 */
export function sessionTimes(
  started: unknown,
  completed: unknown,
): { startedAt: string | null; completedAt: string | null } | { invalid: "started_at" | "completed_at" } {
  const startedAt = normalizeTimestamp(started);
  if (startedAt === undefined) return { invalid: "started_at" };
  let completedAt = normalizeTimestamp(completed);
  if (completedAt === undefined) return { invalid: "completed_at" };

  const legacy = typeof started === "number" || (typeof started === "string" && UNIX_TIME.test(started.trim()));
  const naive = completedAt?.match(NAIVE_DATETIME);
  if (legacy && startedAt && completedAt && naive) {
    const [, y, mo, d, h, mi, sec = "0", frac = "0"] = naive;
    const asUtc = Date.UTC(+y, +mo - 1, +d, +h, +mi, +sec, Math.floor(Number(`0.${frac}`) * 1000));
    const minutesAfterStart = (asUtc - Date.parse(startedAt)) / 60000;
    let best: number | null = null;
    for (const offset of UTC_OFFSETS) {
      const length = minutesAfterStart - offset;
      if (length >= -1 && length <= LONGEST_SESSION_MINUTES && (best === null || length < minutesAfterStart - best)) {
        best = offset;
      }
    }
    if (best !== null) {
      const abs = Math.abs(best);
      const zone = `${best < 0 ? "-" : "+"}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
      completedAt = `${completedAt}${zone}`;
    }
  }
  return { startedAt, completedAt };
}

/**
 * The request body, with NUL characters dropped from every string: Postgres text and
 * jsonb cannot store them, and they carry nothing in a quiz.
 */
export function parseIngestBody(raw: string): unknown {
  return JSON.parse(raw, (_key, value) => (typeof value === "string" ? value.replaceAll("\u0000", "") : value));
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
