"""`covate review`: the command line around the ledger and the FoldRender page.

covate review page QUESTIONS.json [-o page.html]   questions -> HTML for `foldrender publish`
covate review record [ANSWERS.json|-]               `foldrender answers PAGE --json` -> ledger
covate review due [--json]                          concepts to ask about again now
covate review status [--json]                       every concept, and the first-answer score
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import date
from pathlib import Path
from typing import Any

from .ledger import Ledger, LedgerError, default_ledger_path
from .page import QuizError, build_page, first_answers


def _read_json(source: str) -> Any:
    try:
        text = sys.stdin.read() if source == "-" else Path(source).read_text(encoding="utf-8")
        return json.loads(text)
    except (OSError, ValueError) as exc:
        raise QuizError(f"cannot read JSON from {source}: {exc}") from exc


def _parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="covate review", description="Spaced review of concepts, scored on first answers.")
    p.add_argument(
        "--ledger", type=Path, help="ledger file (default: the global Covate storage, or $COVATE_REVIEW_LEDGER)"
    )
    p.add_argument("--today", type=date.fromisoformat, default=None, help="treat this date (YYYY-MM-DD) as today")
    sub = p.add_subparsers(dest="command", required=True)

    page = sub.add_parser("page", help="write the HTML page for a set of questions")
    page.add_argument("questions", help="JSON file with title and questions, or - for stdin")
    page.add_argument("-o", "--out", type=Path, help="write here instead of stdout")

    rec = sub.add_parser("record", help="score the first answers on a page into the ledger")
    rec.add_argument("answers", nargs="?", default="-", help="`foldrender answers PAGE --json` output (default: stdin)")

    due = sub.add_parser("due", help="concepts due for review")
    due.add_argument("--json", action="store_true")

    status = sub.add_parser("status", help="all concepts and the first-answer score")
    status.add_argument("--json", action="store_true")
    return p


def main(argv: list[str]) -> int:
    args = _parser().parse_args(argv)
    today = args.today or date.today()
    try:
        if args.command == "page":
            html = build_page(_read_json(args.questions))
            if args.out:
                args.out.write_text(html, encoding="utf-8")
            else:
                sys.stdout.write(html)
            return 0

        ledger = Ledger.load(args.ledger or default_ledger_path())
        if args.command == "record":
            return _record(ledger, _read_json(args.answers))
        if args.command == "due":
            rows = ledger.due(today)
            if args.json:
                print(json.dumps(rows, ensure_ascii=False, indent=1))
            elif not rows:
                print("Nothing due.")
            else:
                for r in rows:
                    print(f"{r['due']}  {r['concept']}  ({r['status']}, {r['stage']}/3 reviews passed)")
            return 0
        out = {"stats": ledger.stats(), "concepts": ledger.concepts()}
        if args.json:
            print(json.dumps(out, ensure_ascii=False, indent=1))
        else:
            s = out["stats"]
            acc = (
                "no answers yet"
                if s["first_answer_accuracy"] is None
                else f"{s['first_answer_accuracy']:.0%} right first time"
            )
            print(
                f"{s['concepts']} concepts: {s['mastered']} mastered, {s['known']} known, {s['learning']} learning; {acc}"
            )
            for c in out["concepts"]:
                print(f"  {c['status']:<8} {c['concept']}  (next: {c['due'] or '-'})")
        return 0
    except (QuizError, LedgerError) as exc:
        print(f"covate review: {exc}", file=sys.stderr)
        return 2


def _record(ledger: Ledger, data: Any) -> int:
    found, skipped = first_answers(data)
    counts: dict[str, int] = {}
    for fa in found:
        outcome = ledger.record_first_answer(fa.key, fa.concept, fa.correct, fa.on)
        counts[outcome.reason] = counts.get(outcome.reason, 0) + 1
    if counts.keys() - {"duplicate"}:
        ledger.save()
    print(
        json.dumps(
            {"scored": counts, "skipped": [{"answer": s.key, "reason": s.reason} for s in skipped]}, ensure_ascii=False
        )
    )
    return 0
