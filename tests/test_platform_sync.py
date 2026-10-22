"""What covate.platform_sync sends to the ledger, built from records the MCP really stores.

tests/fixtures/real_session/ is a session the CLI saved on Linux on 2026-10-23 after a
person answered the quiz page (only project_directory was changed). Its created_at is
Unix seconds and its answers are letter labels; the ledger rejected that with a 500.
The end-to-end path (this mapping posted to the real ingest route and read back from
Postgres) is platform/ingest.e2e.test.ts.
"""

import json
from datetime import datetime, timezone
from pathlib import Path

import pytest

from covate.platform_sync import _iso_timestamp, _map_session, _option_index

FIXTURES = Path(__file__).parent / "fixtures"
REAL_SESSION = FIXTURES / "real_session" / "20261023_25edc417.json"
ANSWER_CASES = json.loads((FIXTURES / "answer_cases.json").read_text(encoding="utf-8"))["cases"]


@pytest.mark.parametrize("case", ANSWER_CASES, ids=[c["why"] for c in ANSWER_CASES])
def test_option_index_follows_the_shared_rule(case):
    assert _option_index(case["value"], case["options"]) == case["index"]


def test_real_session_maps_to_the_wire_format():
    body = _map_session(json.loads(REAL_SESSION.read_text(encoding="utf-8")))

    assert body["client_id"] == "1792690295_25edc417"
    assert body["project"] == "retry-demo"
    # created_at was stored as 1792690295.152762 (Unix seconds).
    assert body["started_at"] == "2026-10-22T17:31:35.152762+00:00"
    # completed_at was stored as a naive local time (the recording machine ran UTC+8),
    # which is read as the syncing machine's local time.
    local = datetime.fromisoformat("2026-10-23T01:32:17.297955").astimezone()
    assert body["completed_at"] == local.astimezone(timezone.utc).isoformat()
    # The page stored the picks as "A", "B", "A"; quiz answers are option text.
    assert [(a["user_answer"], a["correct_answer"], a["is_correct"]) for a in body["answers"]] == [
        ("To spread load", "To spread load", True),
        ("Nothing", "A max attempt count", False),
        ("503", "503", True),
    ]
    assert all(a["topic"] == "logic" for a in body["answers"])


def test_timestamps_carry_an_offset_postgres_can_parse():
    for stored in (1792690295.152762, "1792690295.152762", "2026-10-23T01:32:17.297955", "2026-10-23T09:32:17+08:00"):
        iso = _iso_timestamp(stored)
        assert iso is not None and datetime.fromisoformat(iso).utcoffset() is not None, stored
    assert _iso_timestamp("2026-10-23T09:32:17+08:00") == "2026-10-23T01:32:17+00:00"


@pytest.mark.parametrize("stored", [None, "", "   ", "yesterday", True, float("nan"), "1e400", [], {}])
def test_unusable_timestamps_are_dropped_not_sent(stored):
    assert _iso_timestamp(stored) is None


def test_completed_at_falls_back_to_saved_at():
    body = _map_session({"session_id": "s", "saved_at": "2026-10-23T01:32:17+00:00", "metadata": {}})
    assert body["completed_at"] == "2026-10-23T01:32:17+00:00"


def test_picks_are_matched_by_question_index_not_position():
    quizzes = [
        {"question": "q0", "options": ["a0", "b0"], "answer": "a0"},
        {"question": "q1", "options": ["a1", "b1"], "answer": "b1"},
    ]
    stored = [{"question": 1, "answer": "B"}, {"question": 0, "answer": "B"}]
    body = _map_session({"session_id": "s", "quizzes": quizzes, "results": {"answers": stored}})
    assert [(a["user_answer"], a["is_correct"]) for a in body["answers"]] == [("b0", False), ("b1", True)]


def test_bare_list_answers_and_built_in_quiz_labels():
    # The built-in quizzes label their options and answer with a letter; older
    # records stored the picks as a bare list in question order.
    quizzes = [
        {"question": "Purpose?", "options": ["A) Performance", "B) Bug fix"], "answer": "B"},
        {"question": "Verify?", "options": ["A) Tests", "B) Nothing"], "answer": "A"},
    ]
    body = _map_session({"session_id": "s", "quizzes": quizzes, "results": {"answers": ["B", "B"]}})
    assert [(a["user_answer"], a["correct_answer"], a["is_correct"]) for a in body["answers"]] == [
        ("B) Bug fix", "B) Bug fix", True),
        ("B) Nothing", "A) Tests", False),
    ]


def test_an_answer_that_names_no_option_is_sent_as_is_with_unknown_correctness():
    quizzes = [{"question": "q", "options": ["x", "y"], "answer": "z"}]
    body = _map_session({"session_id": "s", "quizzes": quizzes, "results": {"answers": [{"question": 0, "answer": "A"}]}})
    (answer,) = body["answers"]
    assert answer["user_answer"] == "x"
    assert answer["correct_answer"] == "z"
    assert answer["is_correct"] is None


def test_an_unanswered_question_is_sent_without_a_pick():
    quizzes = [{"question": "q", "options": ["x", "y"], "answer": "x"}]
    body = _map_session({"session_id": "s", "quizzes": quizzes, "results": {"answers": []}})
    (answer,) = body["answers"]
    assert answer["user_answer"] is None and answer["is_correct"] is None


def test_a_stored_is_correct_wins():
    quizzes = [{"question": "q", "options": ["x", "y"], "answer": "x"}]
    stored = [{"question": 0, "answer": "B", "is_correct": True}]
    body = _map_session({"session_id": "s", "quizzes": quizzes, "results": {"answers": stored}})
    assert body["answers"][0]["is_correct"] is True
