"""Opt-in sync of local learning sessions to the hosted Covate learning ledger.

The MCP saves every learning_session locally (see storage/session_storage.py).
This module uploads those records to the ledger's ingestion API so they can be reviewed
in a browser. The ledger is free (GitHub sign-in, no paid tier). It is entirely opt-in:
without a configured sync URL + token it does nothing, and the MCP is unaffected.

Configure via environment:
    COVATE_SYNC_URL    https://covate.org
    COVATE_SYNC_TOKEN  your per-user sync token (covate.org/dashboard -> Sync token)

Usage (run inside a project you've used Covate in):
    COVATE_SYNC_URL=... COVATE_SYNC_TOKEN=... python -m covate.platform_sync [project_dir]

What goes over the wire differs from what the MCP stores locally, and the mapping is
done here rather than left to the ledger:
    started_at / completed_at  ISO 8601 with an explicit UTC offset. Sessions store
                               created_at as Unix seconds and completed_at as a naive
                               local-time string; a naive time is read as this machine's.
    user_answer / correct_answer  the option's text. The quiz page records a pick as a
                               letter label ("A" = first option); agents write the
                               correct answer as text, a letter, an index or "B) ...".
    is_correct                 true/false when both resolve to an option, else null.
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from typing import Any

from .storage.session_storage import SessionStorageManager


_LABELLED = re.compile(r"^([A-Za-z])\s*[).:]\s+")


def _iso_timestamp(value: Any) -> str | None:
    """A stored timestamp as ISO 8601 in UTC, or None if it isn't one."""
    if value is None or isinstance(value, bool):
        return None
    try:
        if isinstance(value, str):
            text = value.strip()
            if not text:
                return None
            try:
                value = float(text)
            except ValueError:
                moment = datetime.fromisoformat(text)
                if moment.tzinfo is None:
                    moment = moment.astimezone()  # naive: this machine's local time
                return moment.astimezone(timezone.utc).isoformat()
        if isinstance(value, (int, float)):
            return datetime.fromtimestamp(value, tz=timezone.utc).isoformat()
    except (ValueError, OverflowError, OSError):
        return None
    return None


def _option_index(value: Any, options: list[Any]) -> int | None:
    """The 0-based option an answer names, or None.

    Same rule as the quiz page and the ledger (cases in tests/fixtures/answer_cases.json):
    option text first, then a letter label, a 0-based index, or a labelled "B) ..." answer.
    """
    if not options or value is None or isinstance(value, bool):
        return None

    def in_range(i: int) -> int | None:
        return i if 0 <= i < len(options) else None

    if isinstance(value, float) and value.is_integer():
        value = int(value)
    if isinstance(value, int):
        return in_range(value)
    if not isinstance(value, str):
        return None
    text = value.strip()
    texts = [str(o).strip() for o in options]
    if text in texts:
        return texts.index(text)
    lowered = [t.lower() for t in texts]
    if text.lower() in lowered:
        return lowered.index(text.lower())
    if len(text) == 1 and "A" <= text.upper() <= "Z":
        return in_range(ord(text.upper()) - ord("A"))
    if text.isascii() and text.isdigit():
        return in_range(int(text))
    labelled = _LABELLED.match(text)
    if labelled:
        return in_range(ord(labelled.group(1).upper()) - ord("A"))
    return None


def _first_present(d: dict[str, Any], *keys: str) -> Any:
    for key in keys:
        if d.get(key) is not None:
            return d[key]
    return None


def _picks(raw_answers: list[Any]) -> dict[int, Any]:
    """The stored answers keyed by question index.

    The quiz page stores {"question": <index>, "answer": "<letter>"}; older records
    are a bare list in question order.
    """
    picks: dict[int, Any] = {}
    for position, item in enumerate(raw_answers):
        index = item.get("question") if isinstance(item, dict) else None
        if not isinstance(index, int) or isinstance(index, bool):
            index = position
        picks.setdefault(index, item)
    return picks


def _map_session(record: dict[str, Any]) -> dict[str, Any]:
    """Map a stored session record to the /api/ingest request body (tolerant)."""
    quizzes = record.get("quizzes") or []
    picks = _picks((record.get("results") or {}).get("answers") or [])
    focus = record.get("focus_areas") or []
    topic = focus[0] if focus else None
    meta = record.get("metadata") or {}

    answers: list[dict[str, Any]] = []
    for i, q in enumerate(quizzes):
        if not isinstance(q, dict):
            continue
        options = q.get("options") if isinstance(q.get("options"), list) else []
        correct = q.get("answer")
        pick = picks.get(i)
        is_correct = None
        if isinstance(pick, dict):
            if isinstance(pick.get("is_correct"), bool):
                is_correct = pick["is_correct"]
            pick = _first_present(pick, "user_answer", "answer", "selected")
        correct_i = _option_index(correct, options)
        pick_i = _option_index(pick, options)
        if is_correct is None and correct_i is not None and pick_i is not None:
            is_correct = pick_i == correct_i
        answers.append({
            "question": q.get("question"),
            "options": q.get("options"),
            "correct_answer": str(options[correct_i]) if correct_i is not None else correct,
            "user_answer": str(options[pick_i]) if pick_i is not None else pick,
            "is_correct": is_correct,
            "explanation": q.get("explanation"),
            "topic": topic,
            "concept": q.get("concept") or q.get("question"),
        })

    project_dir = record.get("project_directory") or ""
    return {
        "client_id": record.get("session_id"),
        "project": os.path.basename(project_dir.rstrip("/\\")) or None,
        "change_summary": record.get("summary"),
        "started_at": _iso_timestamp(meta.get("created_at")),
        "completed_at": _iso_timestamp(meta.get("completed_at") or record.get("saved_at")),
        "answers": answers,
    }


def _post(url: str, token: str, body: dict[str, Any]) -> tuple[bool, str]:
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        url.rstrip("/") + "/api/ingest",
        data=data,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
            return bool(payload.get("ok")), json.dumps(payload)
    except urllib.error.HTTPError as e:
        return False, f"HTTP {e.code}: {e.read().decode('utf-8', 'replace')[:200]}"
    except Exception as e:  # noqa: BLE001 — surface any transport error to the caller
        return False, str(e)


def sync_all(
    project_directory: str,
    sync_url: str | None = None,
    sync_token: str | None = None,
    limit: int = 200,
) -> dict[str, Any]:
    """Sync all locally-stored sessions for a project to the platform.

    Returns a summary dict. No-op (skipped) if not configured.
    """
    sync_url = sync_url or os.environ.get("COVATE_SYNC_URL")
    sync_token = sync_token or os.environ.get("COVATE_SYNC_TOKEN")
    if not sync_url or not sync_token:
        return {"synced": 0, "failed": 0, "skipped": "COVATE_SYNC_URL / COVATE_SYNC_TOKEN not set"}

    storage = SessionStorageManager(project_directory)
    entries = storage.list_sessions(limit=limit)
    synced = failed = 0
    errors: list[str] = []
    for entry in entries:
        session_id = entry.get("sid") or entry.get("session_id")
        if not session_id:
            continue
        record = storage.load_session(session_id)
        if not record:
            continue
        ok, msg = _post(sync_url, sync_token, _map_session(record))
        if ok:
            synced += 1
        else:
            failed += 1
            errors.append(f"{session_id}: {msg}")
    return {"synced": synced, "failed": failed, "errors": errors[:5]}


def main() -> int:
    project_dir = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    result = sync_all(project_dir)
    print(json.dumps(result, indent=2))
    return 0 if result.get("failed", 0) == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
