"""In-process tests for the Covate MCP server.

No network beyond the loopback web UI that learning_session itself starts, and no
subprocess: the server runs inside the test through fastmcp's in-memory transport.
"""

import threading
import time
import webbrowser
from urllib.parse import parse_qs, urlparse

import httpx
import pytest
from fastmcp.exceptions import ToolError

from covate.server import SERVER_NAME
from covate.storage import DebugRetrieval

EXPECTED_TOOLS = {"learning_session", "debug_search", "debug_record", "term_get"}
EXPECTED_PROMPTS = {"agent_guidelines", "quiz_template"}
SUBMIT_DEADLINE_S = 20


def _schema(tool):
    # fastmcp 4 / MCP SDK 2 renamed inputSchema to input_schema; fastmcp 2 only has the old name.
    return getattr(tool, "input_schema", None) or tool.inputSchema


async def _tools(client):
    return {t.name: t for t in await client.list_tools()}


# --- startup and discovery ----------------------------------------------------


async def test_server_initializes(client):
    # fastmcp 4 may negotiate the modern server/discover handshake, which leaves
    # initialize_result as None; server_info/instructions are the era-neutral accessors.
    if hasattr(client, "server_info"):
        server_name, instructions = client.server_info.name, client.instructions
    else:
        init = client.initialize_result
        server_name, instructions = init.serverInfo.name, init.instructions
    assert server_name == SERVER_NAME
    assert "learning_session" in (instructions or "")


async def test_lists_expected_tools(client):
    assert set(await _tools(client)) == EXPECTED_TOOLS


async def test_tool_schemas(client):
    tools = await _tools(client)

    learning = _schema(tools["learning_session"])
    assert learning["type"] == "object"
    assert learning.get("required", []) == []
    props = learning["properties"]
    assert set(props) == {"project_directory", "summary", "reasoning", "quizzes", "focus_areas", "timeout"}
    assert props["timeout"]["minimum"] == 60
    assert props["timeout"]["maximum"] == 7200
    focus_items = next(v["items"] for v in props["focus_areas"]["anyOf"] if v.get("type") == "array")
    assert set(focus_items["enum"]) == {"logic", "security", "performance", "architecture", "syntax"}

    search = _schema(tools["debug_search"])
    assert search["required"] == ["query"]
    assert search["properties"]["limit"]["minimum"] == 1
    assert search["properties"]["limit"]["maximum"] == 20

    record = _schema(tools["debug_record"])
    assert set(record["required"]) == {"context", "cause", "solution"}
    assert record["properties"]["context"]["type"] == "object"

    term = _schema(tools["term_get"])
    assert term.get("required", []) == []
    assert term["properties"]["count"]["minimum"] == 1
    assert term["properties"]["count"]["maximum"] == 5


async def test_lists_and_renders_prompts(client):
    assert {p.name for p in await client.list_prompts()} == EXPECTED_PROMPTS

    guidelines = await client.get_prompt("agent_guidelines")
    assert "Silence Protocol" in guidelines.messages[0].content.text

    template = await client.get_prompt("quiz_template", {"topic": "caching"})
    assert "Quiz Template for: caching" in template.messages[0].content.text


# --- local tools ----------------------------------------------------------------


async def test_debug_record_then_search(client, project_dir):
    recorded = await client.call_tool(
        "debug_record",
        {
            "context": {"error_type": "TypeError", "error_message": "NoneType is not subscriptable"},
            "cause": "Response body was None when the API returned 204",
            "solution": "Guard the parse with an explicit status check",
            "project_directory": project_dir,
            "tags": ["api", "parsing"],
        },
    )
    assert not recorded.is_error
    assert recorded.data["ok"] is True
    record_id = recorded.data["id"]
    assert isinstance(record_id, str) and record_id

    found = await client.call_tool("debug_search", {"query": "TypeError NoneType", "project_directory": project_dir})
    assert not found.is_error
    assert found.data["count"] == 1
    (hit,) = found.data["results"]
    assert hit["id"] == record_id
    assert hit["error_type"] == "TypeError"
    assert set(hit) == {"id", "error_type", "cause_summary", "solution_summary", "tags"}


@pytest.fixture
def search_outcomes(monkeypatch):
    """Record what DebugRetrieval.search did on each call: ("returned", value) or ("raised", exc).

    debug_search turns any exception into the same empty result an empty project
    gives, so the tool's output alone cannot tell the two apart.
    """
    outcomes = []
    original = DebugRetrieval.search

    def spy(self, *args, **kwargs):
        try:
            value = original(self, *args, **kwargs)
        except Exception as exc:
            outcomes.append(("raised", exc))
            raise
        outcomes.append(("returned", value))
        return value

    monkeypatch.setattr(DebugRetrieval, "search", spy)
    return outcomes


async def test_debug_search_empty_project(client, project_dir, search_outcomes):
    found = await client.call_tool("debug_search", {"query": "anything", "project_directory": project_dir})
    assert not found.is_error
    assert found.data == {"results": [], "count": 0}
    # The search itself ran and found nothing; it neither raised nor was skipped.
    assert search_outcomes == [("returned", [])]


async def test_term_get(client, project_dir):
    first = await client.call_tool("term_get", {"project_directory": project_dir, "count": 2})
    assert not first.is_error
    assert first.data["count"] == 2
    assert isinstance(first.data["remaining"], int)
    for term in first.data["terms"]:
        assert {"id", "domain", "term", "definition_en"} <= set(term)

    # Shown terms are remembered per project, so the next call returns new ones.
    second = await client.call_tool("term_get", {"project_directory": project_dir, "count": 2})
    assert {t["id"] for t in first.data["terms"]}.isdisjoint(t["id"] for t in second.data["terms"])


@pytest.mark.parametrize(
    ("tool", "args", "error"),
    [
        ("term_get", {"count": 0}, r"count\b.*greater_than_equal"),
        ("term_get", {"count": 6}, r"count\b.*less_than_equal"),
        ("debug_search", {"query": "q", "limit": 0}, r"limit\b.*greater_than_equal"),
        ("debug_search", {"query": "q", "limit": 21}, r"limit\b.*less_than_equal"),
        ("debug_search", {}, r"query\b.*missing_argument"),
        ("debug_record", {"cause": "c", "solution": "s"}, r"context\b.*missing_argument"),
        ("learning_session", {"timeout": 59}, r"timeout\b.*greater_than_equal"),
        ("learning_session", {"timeout": 7201}, r"timeout\b.*less_than_equal"),
        ("learning_session", {"focus_areas": ["vibes"]}, r"focus_areas\b.*literal_error"),
    ],
)
async def test_schema_bounds_are_enforced(client, project_dir, tool, args, error):
    # Rejected before the tool body runs, so learning_session never opens its UI here.
    with pytest.raises(ToolError, match=f"(?s){error}"):
        await client.call_tool(tool, {"project_directory": project_dir, **args})


@pytest.mark.parametrize(
    ("tool", "args"),
    [
        ("term_get", {"count": 1}),
        ("term_get", {"count": 5}),
        ("debug_search", {"query": "q", "limit": 1}),
        ("debug_search", {"query": "q", "limit": 20}),
    ],
)
async def test_schema_bounds_accept_edges(client, project_dir, tool, args):
    result = await client.call_tool(tool, {"project_directory": project_dir, **args})
    assert not result.is_error


# --- learning_session: needs a person at a browser ------------------------------


async def test_learning_session_completes_when_user_submits(client, project_dir, monkeypatch):
    """Stand in for the browser: submit through the local web UI's own endpoint."""
    opened = []

    submit_errors = []

    def fake_open(url, *args, **kwargs):
        opened.append(url)
        parsed = urlparse(url)
        session_id = parse_qs(parsed.query)["session"][0]

        def submit():
            # The web UI starts in a thread with only a fixed 0.5s head start: retry
            # until it answers, well inside the test's 30s timeout.
            deadline = time.monotonic() + SUBMIT_DEADLINE_S
            while True:
                try:
                    httpx.post(
                        f"{parsed.scheme}://{parsed.netloc}/api/learning/submit",
                        json={"session_id": session_id, "answers": ["B", "D", "D"], "score": 3},
                        timeout=2,
                    ).raise_for_status()
                    return
                except httpx.TransportError as exc:
                    if time.monotonic() > deadline:
                        submit_errors.append(exc)
                        return
                    time.sleep(0.1)
                except Exception as exc:  # an HTTP error status will not fix itself
                    submit_errors.append(exc)
                    return

        threading.Thread(target=submit, daemon=True).start()
        return True

    monkeypatch.setattr(webbrowser, "open", fake_open)

    result = await client.call_tool(
        "learning_session",
        {"project_directory": project_dir, "summary": "Fixed a crash in the parser", "timeout": 60},
    )
    assert submit_errors == []
    assert not result.is_error
    assert result.data == {"status": "completed", "action": "HALT_GENERATION"}
    assert len(opened) == 1 and opened[0].startswith("http://127.0.0.1:")


@pytest.mark.timeout(120)
async def test_learning_session_without_browser_times_out_cleanly(client, project_dir, monkeypatch):
    """No browser can be opened and nobody answers: the call must end, not hang.

    The server does not detect a missing browser; it waits the timeout minus 5s
    (55s for the schema minimum of 60s) and reports it.
    """
    monkeypatch.setattr(webbrowser, "open", lambda *a, **k: False)

    result = await client.call_tool("learning_session", {"project_directory": project_dir, "timeout": 60})
    assert not result.is_error
    assert result.data["status"] == "timeout"
    assert result.data["action"] == "HALT_GENERATION"
    assert "timeout" in result.data["message"].lower()
