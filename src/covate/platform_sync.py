"""Opt-in sync of local learning sessions to the Covate Learning Platform.

The free MCP saves every learning_session locally (see storage/session_storage.py).
This module uploads those records to the paid platform's ingestion API so they can be
reviewed, tracked and turned into a personalized study plan. It is entirely opt-in:
without a configured sync URL + token it does nothing, and the MCP is unaffected.

Configure via environment:
    COVATE_SYNC_URL    e.g. https://covate-platform.vercel.app
    COVATE_SYNC_TOKEN  your per-user sync token from the platform dashboard

Usage (run inside a project you've used Covate in):
    COVATE_SYNC_URL=... COVATE_SYNC_TOKEN=... python -m covate.platform_sync [project_dir]
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from typing import Any

from .storage.session_storage import SessionStorageManager


def _map_session(record: dict[str, Any]) -> dict[str, Any]:
    """Map a stored session record to the /api/ingest request body (tolerant)."""
    quizzes = record.get("quizzes") or []
    raw_answers = (record.get("results") or {}).get("answers") or []
    focus = record.get("focus_areas") or []
    topic = focus[0] if focus else None
    meta = record.get("metadata") or {}

    answers: list[dict[str, Any]] = []
    for i, q in enumerate(quizzes):
        if not isinstance(q, dict):
            continue
        correct = q.get("answer")
        ua = raw_answers[i] if i < len(raw_answers) else None
        if isinstance(ua, dict):
            user_answer = ua.get("user_answer") or ua.get("answer") or ua.get("selected")
            is_correct = ua.get("is_correct")
        else:
            user_answer = ua
            is_correct = (ua == correct) if (ua is not None and correct is not None) else None
        answers.append({
            "question": q.get("question"),
            "options": q.get("options"),
            "correct_answer": correct,
            "user_answer": user_answer,
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
        "started_at": meta.get("created_at"),
        "completed_at": meta.get("completed_at"),
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
