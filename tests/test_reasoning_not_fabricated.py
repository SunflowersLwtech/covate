"""The learning card must not invent the reasoning it attributes to a change.

`reasoning` is optional on `learning_session` and was never named in the tool description,
so callers routinely omit it. `LearningSession.__init__` then filled the card's
"Reasoning Insights (5-Why)" panel with boilerplate about the quiz itself —

    Trigger:     "User requested learning session"
    Alternative: "Could review code directly without quiz"

— rendered under a heading that tells the user this is the reasoning behind their code
change, and indistinguishable from reasoning an agent actually supplied. The WebUI has
always had an honest empty state for this (`reasoning.noData`, translated in en/zh-CN/
zh-TW); the fallback made it unreachable.

Two halves, fingerprinted separately:

* `test_absent_reasoning_is_not_invented` — the model stops fabricating.
* `test_session_endpoint_serves_a_session_with_no_reasoning` — the API response model
  accepts the absence. It used to require a dict, so the fabrication was the only thing
  keeping this endpoint from a 500.
"""

import pytest

from covate.web.models.learning_session import LearningSession
from covate.web.routes import learning_routes

FABRICATIONS = (
    "User requested learning session",
    "Could review code directly without quiz",
    "Code changes and their implications",
    "May miss important implementation details",
)

SUMMARY = "Swapped == for hmac.compare_digest in the token check"


def _session(reasoning=None) -> LearningSession:
    return LearningSession(
        session_id="s1",
        project_directory="/tmp",
        summary=SUMMARY,
        reasoning=reasoning,
        quizzes=[],
    )


def test_absent_reasoning_is_not_invented():
    session = _session()
    assert session.reasoning is None, (
        "a caller who supplied no reasoning still gets a 5-Why panel, invented here: "
        f"{session.reasoning!r}"
    )
    rendered = session.get_session_data()["reasoning"]
    for phrase in FABRICATIONS:
        assert phrase not in repr(rendered), (
            f"the card would show the user {phrase!r} as the reasoning behind their change"
        )


def test_supplied_reasoning_is_passed_through_untouched():
    mine = {
        "goal": "Remove a timing side-channel in token comparison",
        "trigger": "Security review flagged the == comparison",
        "mechanism": "hmac.compare_digest compares in constant time",
        "alternatives": "Hash both sides first",
        "risks": "Callers passing non-bytes now raise",
    }
    assert _session(mine).reasoning == mine


async def test_session_endpoint_serves_a_session_with_no_reasoning(monkeypatch):
    """The real route handler, including its response-model validation."""
    session = _session()

    class _Manager:
        def get_session(self, session_id):
            return session if session_id == "s1" else None

    monkeypatch.setattr(learning_routes, "_session_manager", _Manager())

    response = await learning_routes.get_session_data("s1")

    assert response.reasoning is None, (
        f"the endpoint returned invented reasoning: {response.reasoning!r}"
    )
    assert response.summary == SUMMARY


async def test_session_endpoint_still_404s_for_an_unknown_session(monkeypatch):
    from fastapi import HTTPException

    class _Manager:
        def get_session(self, session_id):
            return None

    monkeypatch.setattr(learning_routes, "_session_manager", _Manager())

    with pytest.raises(HTTPException) as exc:
        await learning_routes.get_session_data("nope")
    assert exc.value.status_code == 404
