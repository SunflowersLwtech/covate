"""The review ledger, the FoldRender page and the `covate review` command line.

Everything here runs offline against files under tmp_path. The answers fixture has the
shape `foldrender answers PAGE --json` prints (workers/artifacts choice.js in the
FoldRender repo): `questions` with their options, and `answers` where an earlier live
answer sits in `history` and the page's right/wrong mark follows the latest one.
"""

import copy
import json
import subprocess
import sys
import time
from datetime import date, datetime, timedelta, timezone

import pytest

import covate.__main__ as entry
from covate.review.cli import main as review_main
from covate.review.ledger import Ledger, LedgerError
from covate.review.page import QuizError, build_page, first_answers

D0 = date(2026, 10, 27)


def day(n: int) -> date:
    return D0 + timedelta(days=n)


def at_local(of_month: int, hour: int) -> str:
    """An answer time on 2026-10-<of_month> in this machine's own zone, as FoldRender-style ISO text.

    first_answers files an answer under its local calendar day, so tests that read the day
    back build their stamps in the local zone and pass wherever they run.
    """
    return datetime(2026, 10, of_month, hour).astimezone().isoformat()


@pytest.fixture
def ledger(tmp_path):
    return Ledger(tmp_path / "review" / "ledger.json")


# -- ledger ---------------------------------------------------------------------


def test_first_exposure_enters_the_ledger_due_in_a_day(ledger):
    out = ledger.record_first_answer("p#q1#me", "Idempotency keys", True, D0)
    assert (out.reason, out.stage, out.due) == ("new", 0, day(1))
    [row] = ledger.concepts()
    assert row["status"] == "learning" and row["misses"] == 0


def test_first_exposure_wrong_counts_a_miss_but_is_due_the_same_day_after(ledger):
    out = ledger.record_first_answer("p#q1#me", "Idempotency keys", False, D0)
    assert (out.reason, out.stage, out.due) == ("new", 0, day(1))
    assert ledger.concepts()[0]["misses"] == 1


def test_three_passed_reviews_at_1_7_30_days_make_it_mastered(ledger):
    ledger.record_first_answer("a1", "c", True, D0)
    steps = []
    for n, (when, expect_due) in enumerate([(day(1), day(8)), (day(8), day(38)), (day(38), None)], 1):
        out = ledger.record_first_answer(f"a{n + 1}", "c", True, when)
        steps.append((out.reason, out.stage, out.due))
        assert out.due == expect_due
    assert steps == [("advanced", 1, day(8)), ("advanced", 2, day(38)), ("advanced", 3, None)]
    assert ledger.concepts()[0]["status"] == "mastered"
    assert ledger.due(day(1000)) == []


def test_an_early_right_answer_does_not_advance_the_schedule(ledger):
    ledger.record_first_answer("a1", "c", True, D0)
    out = ledger.record_first_answer("a2", "c", True, D0)  # same day, not due until tomorrow
    assert (out.reason, out.stage, out.due) == ("unchanged", 0, day(1))


def test_a_wrong_answer_sends_it_back_to_the_one_day_step_from_any_stage(ledger):
    ledger.record_first_answer("a1", "c", True, D0)
    ledger.record_first_answer("a2", "c", True, day(1))  # stage 1
    ledger.record_first_answer("a3", "c", True, day(8))  # stage 2
    out = ledger.record_first_answer("a4", "c", False, day(38))
    assert (out.reason, out.stage, out.due) == ("reset", 0, day(39))
    assert ledger.concepts()[0]["misses"] == 1


def test_a_wrong_answer_even_when_not_yet_due_resets(ledger):
    ledger.record_first_answer("a1", "c", True, D0)
    ledger.record_first_answer("a2", "c", True, day(1))  # stage 1, due day 8
    out = ledger.record_first_answer("a3", "c", False, day(2))
    assert (out.reason, out.stage, out.due) == ("reset", 0, day(3))


def test_a_mastered_concept_that_is_later_missed_is_learning_again(ledger):
    ledger.record_first_answer("a1", "c", True, D0)
    for n, when in enumerate([day(1), day(8), day(38)], 2):
        ledger.record_first_answer(f"a{n}", "c", True, when)
    assert ledger.concepts()[0]["status"] == "mastered"
    ledger.record_first_answer("a9", "c", False, day(60))
    assert ledger.concepts()[0]["status"] == "learning"
    assert [r["concept"] for r in ledger.due(day(61))] == ["c"]


def test_the_first_answer_to_a_question_is_final(ledger):
    ledger.record_first_answer("p#q1#me", "c", False, D0)
    before = copy.deepcopy(ledger.data)
    out = ledger.record_first_answer("p#q1#me", "c", True, day(3))  # changed their mind later
    assert (out.recorded, out.reason) == (False, "duplicate")
    assert ledger.data == before


def test_recording_the_same_answers_twice_changes_nothing(ledger):
    for i in range(3):
        ledger.record_first_answer(f"a{i}", f"concept {i}", i % 2 == 0, day(i))
    once = copy.deepcopy(ledger.data)
    for i in range(3):
        ledger.record_first_answer(f"a{i}", f"concept {i}", i % 2 == 0, day(i))
    assert ledger.data == once


def test_due_lists_the_most_overdue_first_then_by_name_and_skips_the_rest(ledger):
    ledger.record_first_answer("a1", "zebra", True, day(0))
    ledger.record_first_answer("a2", "apple", True, day(0))
    ledger.record_first_answer("a3", "mango", True, day(-5))
    ledger.record_first_answer("a4", "future", True, day(10))
    assert [r["concept"] for r in ledger.due(day(3))] == ["mango", "apple", "zebra"]


def test_two_spellings_of_a_concept_are_one_record(ledger):
    ledger.record_first_answer("a1", "Idempotency  Keys", True, D0)
    ledger.record_first_answer("a2", "idempotency keys", True, day(1))
    [row] = ledger.concepts()
    assert row["stage"] == 1


def test_first_answer_accuracy_counts_first_answers_not_concepts(ledger):
    ledger.record_first_answer("a1", "c", False, D0)
    ledger.record_first_answer("a2", "c", True, day(1))
    ledger.record_first_answer("a3", "d", True, D0)
    s = ledger.stats()
    assert (s["first_answers"], s["first_answers_correct"], s["first_answer_accuracy"]) == (3, 2, 0.667)


def test_save_and_load_roundtrip_leaves_no_temp_files(ledger):
    ledger.record_first_answer("a1", "c", True, D0)
    ledger.save()
    assert Ledger.load(ledger.path).data == ledger.data
    assert [p.name for p in ledger.path.parent.iterdir()] == ["ledger.json"]


def test_a_broken_ledger_is_an_error_and_is_not_overwritten(tmp_path):
    path = tmp_path / "ledger.json"
    path.write_text("{not json", encoding="utf-8")
    with pytest.raises(LedgerError):
        Ledger.load(path)
    path.write_text(json.dumps({"version": 99, "concepts": {}, "answers": {}}), encoding="utf-8")
    with pytest.raises(LedgerError):
        Ledger.load(path)
    assert json.loads(path.read_text(encoding="utf-8"))["version"] == 99


# -- the page ---------------------------------------------------------------------


def quiz(**over):
    q = {
        "title": "Tonight",
        "questions": [
            {
                "concept": "Idempotency keys",
                "question": "Why send an idempotency key?",
                "options": ["Faster", "A retry cannot charge twice", "Smaller payload"],
                "correct": 1,
                "explanation": "The server remembers the key.",
            }
        ],
    }
    q.update(over)
    return q


def test_page_marks_exactly_the_right_option_and_carries_the_concept():
    html = build_page(quiz())
    assert html.count("data-fr-correct") == 1
    assert 'data-fr-option="o1" data-fr-correct>A retry cannot charge twice' in html
    assert 'data-fr-choice="q1" data-fr-topic="Idempotency keys"' in html
    assert "data-fr-explain" in html


def test_page_escapes_everything_it_was_given():
    html = build_page(
        quiz(
            title="<script>alert(1)</script>",
            questions=[
                {
                    "concept": 'x" onload="y',
                    "question": "<img src=x onerror=alert(1)>",
                    "options": ["<b>a</b>", "b"],
                    "correct": 0,
                    "explanation": "</p><script>",
                }
            ],
        )
    )
    assert "<script>" not in html and "<img" not in html and "<b>" not in html
    assert 'onload="y' not in html


@pytest.mark.parametrize(
    "mutate,message",
    [
        (lambda q: q["questions"][0].update(correct=3), "correct"),
        (lambda q: q["questions"][0].update(correct=True), "correct"),
        (lambda q: q["questions"][0].update(correct=-1), "correct"),
        (lambda q: q["questions"][0].update(options=["only one"]), "options"),
        (lambda q: q["questions"][0].update(options=["same", "same"]), "identical"),
        (lambda q: q["questions"][0].update(concept="  "), "concept"),
        (lambda q: q["questions"][0].update(concept="c" * 65), "concept"),
        (lambda q: q.update(questions=[]), "questions"),
        (lambda q: q.update(questions=q["questions"] * 51), "at most 50"),
        (lambda q: q.update(title=""), "title"),
    ],
)
def test_page_refuses_a_question_set_foldrender_would_mangle(mutate, message):
    q = quiz()
    mutate(q)
    with pytest.raises(QuizError, match=message):
        build_page(q)


# -- reading answers back -------------------------------------------------------


def answers_json(*answers, questions=None):
    qs = questions or [
        {
            "id": "q1",
            "question": "Q1",
            "multi": False,
            "options": [
                {"value": "o0", "label": "wrong", "suggested": False, "correct": False},
                {"value": "o1", "label": "right", "suggested": False, "correct": True},
            ],
            "topic": "Idempotency keys",
            "set": "Tonight",
        }
    ]
    return {"slug": "tonight", "title": "Tonight", "questions": qs, "answers": list(answers)}


def ans(values, *, history=(), choice="q1", login="me", state="live", at=at_local(27, 20), **extra):
    row = {
        "id": 9,
        "choice": choice,
        "login": login,
        "values": values,
        "labels": [],
        "topic": "Idempotency keys",
        "state": state,
        "at": at,
        "history": [
            {"id": i, "values": v, "labels": [], "note": None, "at": h_at, **({"withdrawn": True} if not v else {})}
            for i, (v, h_at) in enumerate(history, 1)
        ],
        **extra,
    }
    return row


def test_a_wrong_first_pick_stays_wrong_even_though_the_page_marks_the_latest_right():
    # FoldRender's own `correct` follows the latest answer (right); the history has the first (wrong).
    data = answers_json(ans(["o1"], history=[(["o0"], at_local(27, 19))], correct=True))
    [fa], skipped = first_answers(data)
    assert (fa.correct, fa.on, fa.key, skipped) == (False, date(2026, 10, 27), "tonight#q1#me", [])


def test_a_right_first_pick_stays_right_after_changing_to_a_wrong_one():
    data = answers_json(ans(["o0"], history=[(["o1"], at_local(27, 19))], correct=False))
    [fa], _ = first_answers(data)
    assert fa.correct is True


def test_a_withdrawn_pick_is_not_the_first_answer():
    data = answers_json(ans(["o1"], history=[([], at_local(27, 18)), (["o0"], at_local(28, 9))]))
    [fa], _ = first_answers(data)
    assert (fa.correct, fa.on) == (False, date(2026, 10, 28))


def test_an_answer_still_inside_its_undo_window_is_not_scored_yet():
    data = answers_json(ans(["o1"], state="pending"))
    found, skipped = first_answers(data)
    assert found == [] and [s.reason for s in skipped] == ["no final answer yet"]


def test_a_pending_change_does_not_hide_the_earlier_live_first_answer():
    data = answers_json(ans(["o1"], state="pending", history=[(["o0"], at_local(27, 19))]))
    [fa], _ = first_answers(data)
    assert fa.correct is False


def test_each_person_is_scored_on_their_own_first_answer():
    data = answers_json(ans(["o1"], login="ann"), ans(["o0"], login="bob"))
    found, _ = first_answers(data)
    assert {(f.key, f.correct) for f in found} == {("tonight#q1#ann", True), ("tonight#q1#bob", False)}


def test_a_multi_pick_must_match_the_right_set_exactly():
    data = answers_json(ans(["o0", "o1"]))
    [fa], _ = first_answers(data)
    assert fa.correct is False


# FoldRender stamps answers in UTC. This one is 01:05 on the 28th in UTC+8, 12:05 on the 27th in UTC-5.
LATE_UTC = "2026-10-27T17:05:00.000Z"
UTC_PLUS_8 = timezone(timedelta(hours=8))
UTC_MINUS_5 = timezone(timedelta(hours=-5))


def test_an_answer_counts_on_the_calendar_day_it_was_given_in_the_readers_zone():
    data = answers_json(ans(["o1"], at=LATE_UTC))
    days = {}
    for name, tz in [("utc+8", UTC_PLUS_8), ("utc-5", UTC_MINUS_5), ("utc", timezone.utc)]:
        [fa], _ = first_answers(data, tz=tz)
        days[name] = fa.on
    assert days == {"utc+8": date(2026, 10, 28), "utc-5": D0, "utc": D0}


def test_a_small_hours_answer_in_utc_plus_8_is_due_that_morning_not_early(ledger):
    ledger.record_first_answer("first", "Idempotency keys", True, D0)  # first seen the 27th, due the 28th
    [fa], _ = first_answers(answers_json(ans(["o1"], at=LATE_UTC)), tz=UTC_PLUS_8)
    out = ledger.record_first_answer(fa.key, fa.concept, fa.correct, fa.on)
    assert (out.reason, out.stage) == ("advanced", 1)


@pytest.fixture
def machine_in_utc_plus_8(monkeypatch):
    monkeypatch.setenv("TZ", "CST-8")  # POSIX zone string, no zone database needed
    time.tzset()
    yield
    monkeypatch.undo()
    time.tzset()


@pytest.mark.skipif(not hasattr(time, "tzset"), reason="time.tzset does not exist on Windows")
def test_without_a_zone_the_machines_own_day_is_used_so_record_and_due_agree(tmp_path, capsys, machine_in_utc_plus_8):
    a = tmp_path / "a.json"
    a.write_text(json.dumps(answers_json(ans(["o1"], at=LATE_UTC))), encoding="utf-8")
    assert run(tmp_path, "record", str(a)) == 0
    capsys.readouterr()
    # Given on the 28th where this machine is, so due the 29th: not on the 28th, yes on the 29th.
    assert run(tmp_path, "--today", "2026-10-28", "due") == 0
    assert "Nothing due." in capsys.readouterr().out
    assert run(tmp_path, "--today", "2026-10-29", "due", "--json") == 0
    assert [r["concept"] for r in json.loads(capsys.readouterr().out)] == ["Idempotency keys"]


def test_answers_that_cannot_be_scored_are_reported_not_dropped_silently():
    notquiz = [{"id": "q1", "question": "Q", "options": [{"value": "a", "label": "a", "correct": False}], "topic": "t"}]
    notopic = [
        {"id": "q1", "question": "Q", "options": [{"value": "o1", "label": "r", "correct": True}], "topic": None}
    ]
    cases = [
        (answers_json(ans(["a"]), questions=notquiz), "not a quiz question"),
        (answers_json(ans(["o1"], topic=None), questions=notopic), "no concept"),
        (answers_json(ans(["o1"], choice="gone")), "not on the page"),
    ]
    for data, reason in cases:
        found, skipped = first_answers(data)
        assert found == [] and len(skipped) == 1 and reason in skipped[0].reason


def test_something_that_is_not_foldrender_output_is_refused():
    with pytest.raises(QuizError):
        first_answers({"hello": "world"})


# -- command line ---------------------------------------------------------------


def run(tmp_path, *argv):
    return review_main(["--ledger", str(tmp_path / "ledger.json"), *argv])


def test_the_whole_loop_through_the_command_line(tmp_path, capsys):
    q = tmp_path / "q.json"
    q.write_text(json.dumps(quiz()), encoding="utf-8")
    out = tmp_path / "page.html"
    assert run(tmp_path, "page", str(q), "-o", str(out)) == 0
    assert "data-fr-correct" in out.read_text(encoding="utf-8")

    a = tmp_path / "a.json"
    a.write_text(json.dumps(answers_json(ans(["o0"]))), encoding="utf-8")
    capsys.readouterr()
    assert run(tmp_path, "record", str(a)) == 0
    assert json.loads(capsys.readouterr().out)["scored"] == {"new": 1}
    assert run(tmp_path, "record", str(a)) == 0
    assert json.loads(capsys.readouterr().out)["scored"] == {"duplicate": 1}

    assert run(tmp_path, "--today", "2026-10-27", "due") == 0
    assert "Nothing due." in capsys.readouterr().out
    capsys.readouterr()
    assert run(tmp_path, "--today", "2026-10-28", "due", "--json") == 0
    [row] = json.loads(capsys.readouterr().out)
    assert (row["concept"], row["due"], row["status"]) == ("Idempotency keys", "2026-10-28", "learning")
    assert run(tmp_path, "status", "--json") == 0
    assert json.loads(capsys.readouterr().out)["stats"]["first_answer_accuracy"] == 0.0


def test_a_duplicate_only_record_does_not_rewrite_the_ledger(tmp_path):
    a = tmp_path / "a.json"
    a.write_text(json.dumps(answers_json(ans(["o1"]))), encoding="utf-8")
    run(tmp_path, "record", str(a))
    ledger_file = tmp_path / "ledger.json"
    ledger_file.write_text(ledger_file.read_text(encoding="utf-8") + "\n", encoding="utf-8")  # marker
    marker = ledger_file.read_text(encoding="utf-8")
    run(tmp_path, "record", str(a))
    assert ledger_file.read_text(encoding="utf-8") == marker


def test_bad_input_exits_2_with_a_message(tmp_path, capsys):
    q = tmp_path / "q.json"
    q.write_text(json.dumps(quiz(questions=[])), encoding="utf-8")
    assert run(tmp_path, "page", str(q)) == 2
    assert "questions must be a non-empty list" in capsys.readouterr().err
    assert run(tmp_path, "page", str(tmp_path / "missing.json")) == 2


def test_covate_review_reaches_the_review_commands_and_plain_covate_still_starts_the_server(tmp_path, monkeypatch):
    started = []
    monkeypatch.setattr("covate.server.main", lambda: started.append("server"))
    monkeypatch.setattr(sys, "argv", ["covate"])
    entry.main()
    assert started == ["server"]

    monkeypatch.setattr(sys, "argv", ["covate", "review", "--ledger", str(tmp_path / "l.json"), "status"])
    with pytest.raises(SystemExit) as exc:
        entry.main()
    assert exc.value.code == 0 and started == ["server"]


def test_python_dash_m_covate_review_runs_without_a_server(tmp_path):
    proc = subprocess.run(
        [sys.executable, "-m", "covate", "review", "--ledger", str(tmp_path / "l.json"), "status"],
        capture_output=True,
        text=True,
        timeout=20,
    )
    assert proc.returncode == 0, proc.stderr
    assert "0 concepts" in proc.stdout
