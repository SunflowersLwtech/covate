"""Turn a set of questions into a FoldRender page, and a page's answers into first answers.

Covate itself stays offline: it only writes the HTML and reads the JSON that
`foldrender answers PAGE --json` prints. Publishing and reading back is the job of
the person's own agent running the `foldrender` command line.

FoldRender keeps every answer a person gives, but only the latest one is the
"answer"; earlier ones sit in its `history`. The page's own right/wrong mark follows
the latest answer, so scoring here goes back to the first one.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, tzinfo
from html import escape
from typing import Any

MAX_QUESTIONS = 50  # FoldRender's limit per page
MAX_OPTIONS = 20
MAX_CONCEPT = 64  # data-fr-topic is cut at 64 characters
MAX_TEXT = 600
MAX_EXPLANATION = 1500

_STYLE = (
    "body{font:16px/1.6 system-ui,sans-serif;max-width:42rem;margin:2rem auto;padding:0 1rem}"
    "[data-fr-choice]{border:1px solid #8884;border-radius:12px;padding:1rem;margin:1.2rem 0}"
    "[data-fr-option]{display:block;width:100%;text-align:left;margin:.4rem 0;padding:.6rem .8rem;"
    "font:inherit;border:1px solid #8886;border-radius:8px;background:transparent;color:inherit;cursor:pointer}"
    ".concept{font-size:.8rem;opacity:.7}"
)


class QuizError(ValueError):
    """The question set cannot be turned into a page."""


def _text(value: Any, where: str, limit: int) -> str:
    if not isinstance(value, str) or not value.strip():
        raise QuizError(f"{where} must be a non-empty string")
    value = " ".join(value.split()) if limit <= MAX_TEXT else value.strip()
    if len(value) > limit:
        raise QuizError(f"{where} is {len(value)} characters; the limit is {limit}")
    return value


def build_page(quiz: dict[str, Any]) -> str:
    """HTML for `foldrender publish`. Each question is a quiz block on one concept."""
    if not isinstance(quiz, dict):
        raise QuizError("the question set must be a JSON object")
    title = _text(quiz.get("title"), "title", 120)
    questions = quiz.get("questions")
    if not isinstance(questions, list) or not questions:
        raise QuizError("questions must be a non-empty list")
    if len(questions) > MAX_QUESTIONS:
        raise QuizError(f"{len(questions)} questions; a page holds at most {MAX_QUESTIONS}")
    set_name = _text(quiz.get("set") or title, "set", 64)

    blocks = []
    for i, q in enumerate(questions, 1):
        where = f"question {i}"
        if not isinstance(q, dict):
            raise QuizError(f"{where} must be an object")
        concept = _text(q.get("concept"), f"{where} concept", MAX_CONCEPT)
        text = _text(q.get("question"), f"{where} question", MAX_TEXT)
        options = q.get("options")
        if not isinstance(options, list) or not 2 <= len(options) <= MAX_OPTIONS:
            raise QuizError(f"{where} needs 2 to {MAX_OPTIONS} options")
        labels = [_text(o, f"{where} option {j}", 300) for j, o in enumerate(options, 1)]
        if len(set(labels)) != len(labels):
            raise QuizError(f"{where} has two identical options")
        correct = q.get("correct")
        if isinstance(correct, bool) or not isinstance(correct, int) or not 0 <= correct < len(labels):
            raise QuizError(f"{where} correct must be the 0-based index of one option")
        explanation = q.get("explanation")
        explain = ""
        if explanation not in (None, ""):
            explain = f"<p data-fr-explain>{escape(_text(explanation, f'{where} explanation', MAX_EXPLANATION))}</p>"

        buttons = "".join(
            f'<button data-fr-option="o{j}"{" data-fr-correct" if j == correct else ""}>{escape(label)}</button>'
            for j, label in enumerate(labels)
        )
        blocks.append(
            f'<div data-fr-choice="q{i}" data-fr-topic="{escape(concept)}" data-fr-set="{escape(set_name)}">'
            f'<p class="concept">{escape(concept)}</p>'
            f"<h3 data-fr-question>{escape(text)}</h3>{buttons}{explain}</div>"
        )

    return (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        f"<title>{escape(title)}</title><style>{_STYLE}</style></head>"
        f"<body><h1>{escape(title)}</h1>{''.join(blocks)}</body></html>\n"
    )


@dataclass
class FirstAnswer:
    key: str  # one per (page, question, person): scored once, ever
    concept: str
    correct: bool
    on: date


@dataclass
class Skipped:
    key: str
    reason: str


def first_answers(data: dict[str, Any], tz: tzinfo | None = None) -> tuple[list[FirstAnswer], list[Skipped]]:
    """Each person's first real pick on each question of a `foldrender answers --json` result.

    FoldRender stamps answers in UTC. An answer counts on the calendar day it was given in
    `tz` (default: this machine's zone, the same one `covate review due` calls "today"),
    so a late-night answer in UTC+8 is not filed under the previous day.
    """
    if (
        not isinstance(data, dict)
        or not isinstance(data.get("answers"), list)
        or not isinstance(data.get("questions"), list)
    ):
        raise QuizError("not the output of `foldrender answers PAGE --json` (no questions/answers)")
    slug = data.get("slug")
    if not isinstance(slug, str) or not slug:
        raise QuizError("the answers have no page id (slug)")

    questions = {q.get("id"): q for q in data["questions"] if isinstance(q, dict)}
    found: list[FirstAnswer] = []
    skipped: list[Skipped] = []
    for a in data["answers"]:
        if not isinstance(a, dict):
            continue
        qid, login = a.get("choice"), a.get("login") or "-"
        key = f"{slug}#{qid}#{login}"
        q = questions.get(qid)
        if q is None:
            skipped.append(Skipped(key, "question not on the page any more"))
            continue
        right = {o["value"] for o in q.get("options", []) if o.get("correct")}
        if not right:
            skipped.append(Skipped(key, "not a quiz question (no right option)"))
            continue
        concept = (a.get("topic") or q.get("topic") or "").strip()
        if not concept:
            skipped.append(Skipped(key, "question has no concept (data-fr-topic)"))
            continue

        # Oldest first: the earlier live answers, then the current one if it is live.
        # A pending current answer can still be undone, so it is not final yet.
        rows = list(a.get("history") or [])
        if a.get("state", "live") == "live":
            rows.append(a)
        pick = next((r for r in rows if not r.get("withdrawn") and r.get("values")), None)
        if pick is None:
            skipped.append(Skipped(key, "no final answer yet"))
            continue
        try:
            on = datetime.fromisoformat(str(pick.get("at") or a.get("at"))).astimezone(tz).date()
        except ValueError:
            skipped.append(Skipped(key, "answer has no usable date"))
            continue
        found.append(FirstAnswer(key, concept, set(pick["values"]) == right, on))
    return found, skipped
