"""learning_session must never build a card out of nothing.

Regression tests for the 2026-09-07 stranger walk: a repo whose HEAD commit was
``fix: use constant-time comparison`` was quizzed with ``learning_session`` called with
no arguments, and the card confidently answered "New feature" — because the tool read
neither the caller's summary (there wasn't one; the schema supplied a placeholder) nor
the repository's diff (it never looked).

The two halves of the fix are asserted separately on purpose, so that landing one half
cannot turn the other half's test green:

* ``test_schema_requires_summary`` fingerprints the schema half.
* ``test_fix_commit_is_not_classified_as_a_new_feature`` and
  ``test_refuses_when_there_is_nothing_to_go_on`` fingerprint the read-the-repo half.
"""

import subprocess
import sys
import types

import pytest

from covate import server
from covate.server import (
    InsufficientContextError,
    _detect_change_type,
    _read_recent_change,
    _resolve_change_context,
)


# --------------------------------------------------------------------------------------
# helpers
# --------------------------------------------------------------------------------------

# What a lazy caller passes, and what the old schema silently supplied on its behalf.
PLACEHOLDER_SUMMARY = "I have completed the requested task."


def _make_repo(path, subject: str) -> str:
    """Create a git repo at `path` whose HEAD commit message is `subject`."""
    path.mkdir(parents=True, exist_ok=True)
    (path / "auth.py").write_text("def check(a, b):\n    return hmac.compare_digest(a, b)\n")
    env_args = [
        "-c", "user.name=Covate Test",
        "-c", "user.email=test@example.invalid",
        "-c", "commit.gpgsign=false",
        "-c", "core.hooksPath=/dev/null",
    ]
    subprocess.run(["git", "init", "-q", "-b", "main", str(path)], check=True, capture_output=True)
    subprocess.run(
        ["git", "-C", str(path), *env_args, "add", "auth.py"], check=True, capture_output=True
    )
    subprocess.run(
        ["git", "-C", str(path), *env_args, "commit", "-q", "-m", subject],
        check=True,
        capture_output=True,
    )
    return str(path)


@pytest.fixture
def captured_ui(monkeypatch):
    """Replace the WebUI launcher with a recorder, so no server is started.

    `learning_session` does `from .web import launch_learning_session_ui` at call time,
    so a stub module in sys.modules is what the executed path picks up.
    """
    calls: list[dict] = []

    async def fake_launch(**kwargs):
        calls.append(kwargs)
        return {"status": "completed", "score": 0}

    stub = types.ModuleType("covate.web")
    stub.launch_learning_session_ui = fake_launch  # type: ignore[attr-defined]
    monkeypatch.setitem(sys.modules, "covate.web", stub)
    return calls


def _purpose_answer(quizzes: list[dict]) -> str:
    """Return the option text the card marks correct for the 'main purpose' question."""
    for quiz in quizzes:
        if "main purpose" in quiz["question"].lower():
            letter = quiz["answer"]
            for option in quiz["options"]:
                if option.strip().startswith(letter):
                    return option
            raise AssertionError(f"answer {letter!r} matches none of {quiz['options']!r}")
    raise AssertionError(f"no 'main purpose' question in {[q['question'] for q in quizzes]}")


# --------------------------------------------------------------------------------------
# half 1 — the schema must require the input the answer depends on
# --------------------------------------------------------------------------------------


async def test_schema_requires_summary():
    """A caller must not be able to invoke learning_session with no arguments at all."""
    tools = await server.mcp.get_tools()
    schema = tools["learning_session"].parameters

    assert "summary" in schema.get("required", []), (
        "`summary` is optional in the tool schema, so a caller can omit exactly the input "
        f"the card is built from. required={schema.get('required')!r}"
    )
    assert "default" not in schema["properties"]["summary"], (
        "`summary` still has a placeholder default; a caller who omits it gets a card built "
        f"from that placeholder: {schema['properties']['summary'].get('default')!r}"
    )

    description = tools["learning_session"].description or ""
    assert "summary" in description and "quizzes" in description, (
        "the tool description never names the inputs the answer depends on, which is why "
        f"callers omit them: {description!r}"
    )


# --------------------------------------------------------------------------------------
# half 2 — with no usable summary, read the repository; refuse if that says nothing
# --------------------------------------------------------------------------------------


def test_detect_change_type_reports_no_signal_instead_of_guessing_feature():
    assert _detect_change_type(PLACEHOLDER_SUMMARY) is None, (
        "a summary that says nothing about the change was classified as "
        f"{_detect_change_type(PLACEHOLDER_SUMMARY)!r} rather than reported as unknown"
    )
    # Still classifies when there IS a signal.
    assert _detect_change_type("fix: use constant-time comparison") == "bugfix"


def test_read_recent_change_sees_the_head_commit(tmp_path):
    repo = _make_repo(tmp_path / "repo", "fix: use constant-time comparison")
    recent = _read_recent_change(repo)
    assert recent is not None, "the tool could not read the repository's most recent change"
    assert "constant-time comparison" in recent["text"]
    assert "auth.py" in recent["text"], "the changed file paths were not read"


def test_resolve_change_context_falls_back_to_the_repository(tmp_path):
    repo = _make_repo(tmp_path / "repo", "fix: use constant-time comparison")
    change_type, summary_for_ui = _resolve_change_context(PLACEHOLDER_SUMMARY, repo)
    assert change_type == "bugfix", (
        f"a repo whose HEAD commit says 'fix:' resolved to {change_type!r}"
    )
    assert "constant-time comparison" in summary_for_ui, (
        "the card does not show the user the evidence its questions were derived from: "
        f"{summary_for_ui!r}"
    )


async def test_fix_commit_is_not_classified_as_a_new_feature(tmp_path, captured_ui):
    """The 2026-09-07 repro, end to end through the tool's real body.

    HEAD says 'fix:'. The caller narrates nothing. The card handed to the WebUI must not
    tell the user their bug fix was a new feature.
    """
    repo = _make_repo(tmp_path / "repo", "fix: use constant-time comparison")

    result = await server.learning_session.fn(
        summary=PLACEHOLDER_SUMMARY,
        project_directory=repo,
        timeout=60,
    )

    assert result["status"] == "completed", f"the session did not run: {result!r}"
    assert captured_ui, "the WebUI was never handed a card"
    quizzes = captured_ui[0]["quizzes"]

    answer = _purpose_answer(quizzes)
    assert "New feature" not in answer, (
        "a commit whose message is 'fix: use constant-time comparison' was quizzed as a "
        f"new feature: the card marks {answer!r} correct"
    )
    assert "Bug fix" in answer, f"expected the card to teach 'Bug fix'; it teaches {answer!r}"


async def test_refuses_when_there_is_nothing_to_go_on(tmp_path, captured_ui):
    """No usable summary and no readable repository: refuse, do not invent a card."""
    empty = tmp_path / "not-a-repo"
    empty.mkdir()
    # Guard against a vacuous pass: this directory must genuinely have no change to read.
    assert _read_recent_change(str(empty)) is None, "fixture directory is inside a git repo"

    result = await server.learning_session.fn(
        summary=PLACEHOLDER_SUMMARY,
        project_directory=str(empty),
        timeout=60,
    )

    assert result["status"] == "insufficient_context", (
        f"the tool answered from nothing instead of refusing: {result!r}"
    )
    assert not captured_ui, (
        "the tool refused in its return value but still opened a card built from nothing: "
        f"{captured_ui!r}"
    )
    # A refusal must leave the agent free to retry, not silence it.
    assert result.get("action") != "HALT_GENERATION"


async def test_explicit_quizzes_are_still_honoured(tmp_path, captured_ui):
    """The refusal must not block the good path: a caller who brings real questions wins."""
    empty = tmp_path / "not-a-repo"
    empty.mkdir()
    mine = [
        {
            "question": "Why constant-time comparison?",
            "options": ["A) Speed", "B) Timing side-channel", "C) Style", "D) Memory"],
            "answer": "B",
            "explanation": "Early-exit comparison leaks how many bytes matched.",
        }
    ]

    result = await server.learning_session.fn(
        summary="Swapped == for hmac.compare_digest in the token check",
        project_directory=str(empty),
        quizzes=mine,
        timeout=60,
    )

    assert result["status"] == "completed", f"{result!r}"
    assert captured_ui[0]["quizzes"] == mine


def test_unknown_change_type_refuses_instead_of_falling_back_to_feature():
    with pytest.raises(InsufficientContextError):
        server._generate_default_quizzes("no-such-type")
