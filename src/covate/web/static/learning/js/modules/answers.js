/**
 * Answers Module
 * ==============
 * Which option a quiz answer points at.
 *
 * Agents write a quiz's correct answer as the option text, a letter, a 0-based index,
 * or a labelled option like "B) Bug fix". The page shows options as A, B, C, ... and
 * records the clicked label. covate.platform_sync and the ledger resolve answers with
 * the same rule; the shared cases are in tests/fixtures/answer_cases.json.
 */

/**
 * @param {*} answer - The answer as written
 * @param {Array} options - The quiz's options
 * @returns {number|null} - 0-based option index, or null if it names no option
 */
export function optionIndex(answer, options = []) {
    const inRange = (i) => (Number.isInteger(i) && i >= 0 && i < options.length ? i : null);
    if (options.length === 0) return null;
    if (typeof answer === 'number') return inRange(answer);
    if (typeof answer !== 'string') return null;
    const text = answer.trim();
    const texts = options.map((o) => String(o).trim());
    let i = texts.indexOf(text);
    if (i < 0) i = texts.map((t) => t.toLowerCase()).indexOf(text.toLowerCase());
    if (i >= 0) return i;
    if (/^[A-Za-z]$/.test(text)) return inRange(text.toUpperCase().charCodeAt(0) - 65);
    if (/^\d+$/.test(text)) return inRange(Number(text));
    const labelled = text.match(/^([A-Za-z])\s*[).:]\s+/);
    return labelled ? inRange(labelled[1].toUpperCase().charCodeAt(0) - 65) : null;
}

/**
 * @param {*} answer - The answer as written
 * @param {Array} options - The quiz's options
 * @returns {string|null} - The option's label (A, B, C, ...), or null
 */
export function answerLabel(answer, options = []) {
    const i = optionIndex(answer, options);
    return i === null ? null : String.fromCharCode(65 + i);
}
