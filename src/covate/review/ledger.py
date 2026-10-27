"""The review ledger: one record per concept, scored on the first answer only.

A concept is something worth remembering ("idempotency keys"), not a question. The
first time someone answers a question about it the concept enters the ledger and is
due again after 1 day; each correct answer once it is due moves it on to 7 days and
then 30 days; passing the 30-day review makes it mastered. A wrong answer sends it
back to the 1-day step. Only a person's first pick on a question counts, so looking
at the explanation and changing the answer later cannot raise the score.

The ledger is a local JSON file. Nothing here talks to the network or to a model.
"""

from __future__ import annotations

import json
import os
import tempfile
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path
from typing import Any

# Days until the next review after 0, 1 and 2 passed reviews. Three passes = mastered.
INTERVALS = (1, 7, 30)
MASTERED_STAGE = len(INTERVALS)

LEDGER_VERSION = 1


class LedgerError(Exception):
    """The ledger file cannot be used as it is (unreadable, wrong shape)."""


def concept_key(name: str) -> str:
    """Two spellings of the same concept ("Idempotency  Keys") share one record."""
    return " ".join(name.split()).casefold()


def default_ledger_path() -> Path:
    override = os.environ.get("COVATE_REVIEW_LEDGER")
    if override:
        return Path(override)
    from ..storage.path_resolver import get_global_storage_path

    return get_global_storage_path() / "review" / "ledger.json"


@dataclass
class Outcome:
    """What recording one first answer did."""

    recorded: bool
    reason: str  # "new", "advanced", "reset", "unchanged", "duplicate"
    concept: str
    stage: int = 0
    due: date | None = None


class Ledger:
    def __init__(self, path: Path, data: dict[str, Any] | None = None):
        self.path = path
        self.data = data if data is not None else {"version": LEDGER_VERSION, "concepts": {}, "answers": {}}

    @classmethod
    def load(cls, path: Path) -> Ledger:
        """Read the ledger; a missing file is an empty ledger, a broken one is an error.

        A broken file is never replaced by an empty one: that would silently throw
        away the review history on the next save.
        """
        if not path.exists():
            return cls(path)
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, ValueError) as exc:
            raise LedgerError(f"cannot read the ledger at {path}: {exc}") from exc
        if (
            not isinstance(data, dict)
            or data.get("version") != LEDGER_VERSION
            or not isinstance(data.get("concepts"), dict)
            or not isinstance(data.get("answers"), dict)
        ):
            raise LedgerError(f"the ledger at {path} is not a version {LEDGER_VERSION} ledger; not touching it")
        return cls(path, data)

    def save(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        fd, tmp = tempfile.mkstemp(dir=self.path.parent, prefix=".ledger-", suffix=".tmp")
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                json.dump(self.data, f, ensure_ascii=False, indent=1, sort_keys=True)
            os.replace(tmp, self.path)
        except BaseException:
            Path(tmp).unlink(missing_ok=True)
            raise

    # -- recording --------------------------------------------------------------

    def record_first_answer(self, answer_key: str, concept: str, correct: bool, on: date) -> Outcome:
        """Score one question's first answer. The same answer_key is only ever scored once."""
        key = concept_key(concept)
        if answer_key in self.data["answers"]:
            rec = self.data["concepts"].get(key, {})
            return Outcome(False, "duplicate", concept, rec.get("stage", 0), _due(rec))

        self.data["answers"][answer_key] = {"concept": key, "correct": correct, "on": on.isoformat()}
        rec = self.data["concepts"].get(key)
        if rec is None:
            rec = {
                "name": " ".join(concept.split()),
                "stage": 0,
                "due": (on + timedelta(days=INTERVALS[0])).isoformat(),
                "first_seen": on.isoformat(),
                "misses": 0 if correct else 1,
            }
            self.data["concepts"][key] = rec
            return Outcome(True, "new", rec["name"], 0, _due(rec))

        due = _due(rec)
        if not correct:
            rec["stage"] = 0
            rec["due"] = (on + timedelta(days=INTERVALS[0])).isoformat()
            rec["misses"] = rec.get("misses", 0) + 1
            return Outcome(True, "reset", rec["name"], 0, _due(rec))
        if due is None or on < due:
            # Mastered, or answered early: a right answer proves nothing new yet.
            return Outcome(True, "unchanged", rec["name"], rec["stage"], due)
        stage = rec["stage"] + 1
        rec["stage"] = stage
        rec["due"] = None if stage >= MASTERED_STAGE else (on + timedelta(days=INTERVALS[stage])).isoformat()
        return Outcome(True, "advanced", rec["name"], stage, _due(rec))

    # -- reading ----------------------------------------------------------------

    def due(self, today: date) -> list[dict[str, Any]]:
        """Concepts due on or before today, most overdue first, ties by name."""
        rows = []
        for key, rec in self.data["concepts"].items():
            due = _due(rec)
            if due is not None and due <= today:
                rows.append((due, key, _view(rec)))
        rows.sort(key=lambda r: (r[0], r[1]))
        return [r[2] for r in rows]

    def concepts(self) -> list[dict[str, Any]]:
        rows = [(key, _view(rec)) for key, rec in self.data["concepts"].items()]
        rows.sort(key=lambda r: r[0])
        return [r[1] for r in rows]

    def stats(self) -> dict[str, Any]:
        answers = list(self.data["answers"].values())
        concepts = self.concepts()
        total = len(answers)
        right = sum(1 for a in answers if a["correct"])
        return {
            "first_answers": total,
            "first_answers_correct": right,
            "first_answer_accuracy": round(right / total, 3) if total else None,
            "concepts": len(concepts),
            "mastered": sum(1 for c in concepts if c["status"] == "mastered"),
            "known": sum(1 for c in concepts if c["status"] == "known"),
            "learning": sum(1 for c in concepts if c["status"] == "learning"),
        }


def status_of(stage: int) -> str:
    if stage >= MASTERED_STAGE:
        return "mastered"
    return "known" if stage >= 1 else "learning"


def _due(rec: dict[str, Any]) -> date | None:
    return date.fromisoformat(rec["due"]) if rec.get("due") else None


def _view(rec: dict[str, Any]) -> dict[str, Any]:
    return {
        "concept": rec["name"],
        "stage": rec["stage"],
        "status": status_of(rec["stage"]),
        "due": rec.get("due"),
        "first_seen": rec["first_seen"],
        "misses": rec.get("misses", 0),
    }
