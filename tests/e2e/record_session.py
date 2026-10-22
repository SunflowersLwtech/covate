"""Record one learning session the way a person does, for platform/ingest.e2e.test.ts.

usage: python tests/e2e/record_session.py <project_dir> <picks>   e.g. A,C,C

Calls the learning_session tool through the MCP, and where the tool opens the quiz page
in a browser, posts what the page's "complete" button posts: one letter label per
question, the label of the option that was clicked. The tool then saves the session
under <project_dir> exactly as it does for a real user. Prints {"session_id": ...}.
"""

import asyncio
import json
import os
import sys
import tempfile
import threading
import time
import webbrowser
from urllib.parse import parse_qs, urlparse

QUIZZES = [
    # Correct answer written as the option text.
    {"question": "Why does the retry wait double each time?", "options": ["To spread load", "To go faster", "No reason"],
     "answer": "To spread load", "explanation": "Backoff gives the server room to recover."},
    # Labelled options and a letter, the way the built-in quizzes are written.
    {"question": "What is the main purpose of this change?",
     "options": ["A) Performance improvement", "B) Bug fix", "C) New feature", "D) Refactoring"],
     "answer": "B", "explanation": "It fixes a bug."},
    # A 0-based index.
    {"question": "Which error is worth retrying?", "options": ["400", "404", "503"],
     "answer": 2, "explanation": "Only transient errors are worth retrying."},
]


def main() -> int:
    project, picks = sys.argv[1], sys.argv[2].split(",")
    os.makedirs(project, exist_ok=True)
    # Keep the MCP's global config out of the developer's own.
    config_home = tempfile.mkdtemp(prefix="covate-e2e-config-")
    os.environ["XDG_CONFIG_HOME"] = config_home
    os.environ["APPDATA"] = config_home

    import httpx
    from fastmcp import Client

    from covate.server import mcp

    errors: list[Exception] = []

    def open_quiz_page(url, *args, **kwargs):
        parsed = urlparse(url)
        session_id = parse_qs(parsed.query)["session"][0]
        body = {
            "session_id": session_id,
            "answers": [{"question": i, "answer": pick} for i, pick in enumerate(picks)],
            "score": 0,
        }

        def submit():
            deadline = time.monotonic() + 20
            while True:
                try:
                    httpx.post(f"{parsed.scheme}://{parsed.netloc}/api/learning/submit", json=body, timeout=2).raise_for_status()
                    return
                except httpx.TransportError as exc:
                    if time.monotonic() > deadline:
                        errors.append(exc)
                        return
                    time.sleep(0.1)
                except Exception as exc:
                    errors.append(exc)
                    return

        threading.Thread(target=submit, daemon=True).start()
        return True

    webbrowser.open = open_quiz_page

    async def run():
        async with Client(mcp) as client:
            return await client.call_tool("learning_session", {
                "project_directory": project,
                "summary": "Added retry with exponential backoff to the HTTP client",
                "quizzes": QUIZZES,
                "focus_areas": ["logic"],
                "timeout": 60,
            })

    result = asyncio.run(run())
    if errors or result.data.get("status") != "completed":
        print(json.dumps({"error": [repr(e) for e in errors] or result.data}), file=sys.stderr)
        return 1
    index = json.loads(open(os.path.join(project, ".mcp-sidecar", "sessions", "index.json"), encoding="utf-8").read())
    print(json.dumps({"session_id": index["sessions"][-1]["sid"]}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
