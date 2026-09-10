"""
Covate Server
=========================

Provides MCP tools for learning sessions and debug assistance.
The core tool is `learning_session` which blocks the Agent until
the user completes the learning card.
"""

import os
import shutil
import subprocess
import sys
from typing import Annotated, Any, Literal

from fastmcp import FastMCP
from pydantic import Field

from .debug import server_debug_log as debug_log
from . import __version__

# Server name
SERVER_NAME = "Covate"

# =============================================================================
# SERVER INSTRUCTIONS - Injected at MCP initialization (sent once to client)
# =============================================================================
# Design Principles:
# - Low intrusion: No auto-triggering, user must explicitly request
# - Token efficient: UI replaces agent summaries, HALT_GENERATION on return
# - Local first: All data stored in .mcp-sidecar/ directory
# =============================================================================
SERVER_INSTRUCTIONS = """
Covate - Learning & Debug Assistant

DESIGN PHILOSOPHY:
• learning_session: FOR THE USER - helps users learn from AI-generated changes
• debug_search/record: FOR THE AGENT - builds agent's project-specific knowledge

TOOLS:
• learning_session: Interactive learning card (BLOCKS until user completes)
• debug_search: Search historical debug experiences (silent, no UI)
• debug_record: Record new debug solutions (silent, background)

CRITICAL RULES:

1. LEARNING SESSION (User-Centric)
   ✓ ONLY call when user explicitly says: "quiz me", "test me", "help me learn"
   ✗ NEVER auto-call after task completion
   ✗ NEVER call when user just asks "what changed?" (answer directly instead)
   → Returns minimal context to reduce token usage

2. SILENCE PROTOCOL
   When learning_session returns with "action": "HALT_GENERATION":
   → STOP generating immediately
   → Output NOTHING more (the UI already shows everything)

3. DEBUG TOOLS (Agent-Centric, Proactive & Silent)
   These tools build YOUR knowledge base - use them AUTOMATICALLY:

   ▶ debug_search - AUTO-TRIGGER when encountering errors
     → Returns compact summaries to minimize context pollution
     → Call silently, integrate results into your fix strategy

   ▶ debug_record - AUTO-TRIGGER after fixing errors
     → Returns only success/failure, no verbose data
     → Call silently in background, never announce to user

DATA: All data stored locally in .mcp-sidecar/ directory.
"""

# Initialize MCP server with instructions
mcp: Any = FastMCP(SERVER_NAME, instructions=SERVER_INSTRUCTIONS)


def _validate_reasoning(reasoning: dict[str, Any]) -> None:
    """Validate reasoning structure."""
    required_keys = ["goal", "trigger", "mechanism", "alternatives", "risks"]
    for key in required_keys:
        if key not in reasoning:
            reasoning[key] = f"Not specified: {key}"


def _validate_quizzes(quizzes: list[dict[str, Any]]) -> None:
    """Validate quiz structure."""
    for i, quiz in enumerate(quizzes):
        required_keys = ["question", "options", "answer", "explanation"]
        for key in required_keys:
            if key not in quiz:
                raise ValueError(f"Quiz {i} missing required key: {key}")


def _detect_change_type(summary: str) -> str | None:
    """Detect the type of change from keywords in `summary`.

    Returns None when the text carries no signal at all. It deliberately does NOT
    fall back to "feature": that fallback made every unknown change come back as
    "New feature", which is a confident wrong answer rather than an absent one.
    Callers must resolve None (read the repository, or refuse) instead of guessing.
    """
    summary_lower = (summary or "").lower()

    # Check for bug fix indicators
    if any(kw in summary_lower for kw in ["fix", "bug", "issue", "error", "crash", "repair", "patch", "resolve"]):
        return "bugfix"

    # Check for performance indicators
    if any(kw in summary_lower for kw in ["performance", "optimize", "speed", "faster", "cache", "efficient", "memory"]):
        return "performance"

    # Check for refactoring indicators
    if any(kw in summary_lower for kw in ["refactor", "restructure", "reorganize", "clean", "simplify", "rename"]):
        return "refactor"

    # Check for security indicators
    if any(kw in summary_lower for kw in ["security", "vulnerab", "auth", "permission", "sanitize", "escape", "inject"]):
        return "security"

    # Check for documentation indicators
    if any(kw in summary_lower for kw in ["document", "readme", "comment", "docstring", "doc"]):
        return "docs"

    # Check for test indicators
    if any(kw in summary_lower for kw in ["test", "spec", "coverage", "assert", "mock"]):
        return "test"

    # No signal. Say so — do not guess "feature".
    return None


def _generate_default_quizzes(change_type: str) -> list[dict[str, Any]]:
    """Generate default quiz questions for an ALREADY-RESOLVED change type.

    `change_type` must come from `_resolve_change_context`, which is the only place
    allowed to decide what kind of change this is (and to refuse when it cannot tell).
    """
    # Quiz templates based on change type
    quiz_templates = {
        "bugfix": [
            {
                "question": "What is the main purpose of this change?",
                "options": ["A) Performance improvement", "B) Bug fix", "C) New feature", "D) Refactoring"],
                "answer": "B",
                "explanation": "Based on the summary, this is a bug fix to resolve an existing issue.",
            },
            {
                "question": "What is most important when verifying a bug fix?",
                "options": ["A) The bug no longer occurs", "B) No regression in related features", "C) Root cause is addressed, not just symptoms", "D) All of the above"],
                "answer": "D",
                "explanation": "A complete bug fix verification includes all these aspects.",
            },
            {
                "question": "What documentation should accompany a bug fix?",
                "options": ["A) Steps to reproduce the original issue", "B) Root cause analysis", "C) Prevention measures for similar issues", "D) All of the above"],
                "answer": "D",
                "explanation": "Good bug fix documentation helps prevent similar issues in the future.",
            },
        ],
        "performance": [
            {
                "question": "What is the main purpose of this change?",
                "options": ["A) Performance improvement", "B) Bug fix", "C) New feature", "D) Refactoring"],
                "answer": "A",
                "explanation": "Based on the summary, this is a performance optimization.",
            },
            {
                "question": "How should performance improvements be validated?",
                "options": ["A) Before/after benchmarks", "B) Memory profiling", "C) Load testing", "D) All of the above"],
                "answer": "D",
                "explanation": "Comprehensive performance validation uses multiple measurement methods.",
            },
            {
                "question": "What is a common risk with performance optimizations?",
                "options": ["A) Reduced code readability", "B) Increased complexity", "C) Potential correctness issues", "D) All of the above"],
                "answer": "D",
                "explanation": "Performance optimizations often introduce trade-offs that need careful consideration.",
            },
        ],
        "refactor": [
            {
                "question": "What is the main purpose of this change?",
                "options": ["A) Performance improvement", "B) Bug fix", "C) New feature", "D) Refactoring"],
                "answer": "D",
                "explanation": "Based on the summary, this is a code refactoring for better structure or maintainability.",
            },
            {
                "question": "What is the key principle of refactoring?",
                "options": ["A) Change behavior and structure together", "B) Change structure without changing behavior", "C) Always add new features while refactoring", "D) Refactor without tests"],
                "answer": "B",
                "explanation": "Refactoring should improve code structure while preserving existing behavior.",
            },
            {
                "question": "What should you ensure before refactoring?",
                "options": ["A) Adequate test coverage exists", "B) Changes are incremental and reversible", "C) Each step can be verified", "D) All of the above"],
                "answer": "D",
                "explanation": "Safe refactoring requires tests, incremental changes, and verification at each step.",
            },
        ],
        "security": [
            {
                "question": "What is the main purpose of this change?",
                "options": ["A) Performance improvement", "B) Security enhancement", "C) New feature", "D) Refactoring"],
                "answer": "B",
                "explanation": "Based on the summary, this change addresses security concerns.",
            },
            {
                "question": "What should security changes always include?",
                "options": ["A) Threat model documentation", "B) Security testing", "C) Review by security-aware team members", "D) All of the above"],
                "answer": "D",
                "explanation": "Security changes require comprehensive documentation, testing, and review.",
            },
            {
                "question": "What is critical after deploying security fixes?",
                "options": ["A) Monitor for exploitation attempts", "B) Verify the fix in production", "C) Update security documentation", "D) All of the above"],
                "answer": "D",
                "explanation": "Post-deployment security verification is crucial for ensuring the fix is effective.",
            },
        ],
        "docs": [
            {
                "question": "What is the main purpose of this change?",
                "options": ["A) Performance improvement", "B) Bug fix", "C) Documentation update", "D) Refactoring"],
                "answer": "C",
                "explanation": "Based on the summary, this is a documentation improvement.",
            },
            {
                "question": "What makes documentation effective?",
                "options": ["A) Clear examples", "B) Up-to-date with code", "C) Easy to navigate", "D) All of the above"],
                "answer": "D",
                "explanation": "Effective documentation combines clarity, accuracy, and usability.",
            },
            {
                "question": "When should documentation be updated?",
                "options": ["A) After major releases only", "B) Whenever code behavior changes", "C) Only when users complain", "D) Once a year"],
                "answer": "B",
                "explanation": "Documentation should stay synchronized with code changes.",
            },
        ],
        "test": [
            {
                "question": "What is the main purpose of this change?",
                "options": ["A) Performance improvement", "B) Bug fix", "C) Test improvement", "D) Refactoring"],
                "answer": "C",
                "explanation": "Based on the summary, this change improves test coverage or quality.",
            },
            {
                "question": "What makes a good test?",
                "options": ["A) Tests one specific behavior", "B) Fast and deterministic", "C) Clear failure messages", "D) All of the above"],
                "answer": "D",
                "explanation": "Good tests are focused, reliable, and provide clear feedback on failures.",
            },
            {
                "question": "What should tests NOT do?",
                "options": ["A) Test implementation details", "B) Depend on external services", "C) Have flaky/random failures", "D) All of the above"],
                "answer": "D",
                "explanation": "Tests should be stable, isolated, and test behavior rather than implementation.",
            },
        ],
        "feature": [
            {
                "question": "What is the main purpose of this change?",
                "options": ["A) Performance improvement", "B) Bug fix", "C) New feature", "D) Refactoring"],
                "answer": "C",
                "explanation": "Based on the summary, this appears to be a new feature or enhancement.",
            },
            {
                "question": "What should you verify after adding a new feature?",
                "options": ["A) Feature works as specified", "B) No regression in existing features", "C) Edge cases are handled", "D) All of the above"],
                "answer": "D",
                "explanation": "New feature verification should cover functionality, regression, and edge cases.",
            },
            {
                "question": "What is the potential risk of adding new features?",
                "options": ["A) Breaking existing functionality", "B) Increased maintenance burden", "C) Scope creep", "D) All of the above"],
                "answer": "D",
                "explanation": "New features introduce various risks that need careful management.",
            },
        ],
    }

    if change_type not in quiz_templates:
        # Unknown types used to silently fall back to the "feature" deck, which asserts
        # "this appears to be a new feature". Refuse instead of asserting.
        raise InsufficientContextError(f"No quiz template for change type {change_type!r}")
    return quiz_templates[change_type]


class InsufficientContextError(ValueError):
    """Raised when there is nothing to build a learning card from.

    The learning card must never be assembled out of nothing: a card whose questions
    were invented from a placeholder summary teaches the user a wrong answer about
    their own code. When neither the caller's summary nor the repository's most recent
    change says what changed, the tool refuses and says what it needs.
    """


def _read_recent_change(project_directory: str) -> dict[str, str] | None:
    """Read the project's most recent change from git.

    This is the "reads your diff" half of the product promise: the tool looks at the
    repository itself instead of trusting whatever narration the caller passed in.

    Returns {"headline": <one line>, "text": <headline + body + changed paths>} or None
    when the directory is not a git work tree, git is unavailable, or the repo is empty.
    """
    git = shutil.which("git")
    if not git:
        debug_log("_read_recent_change: git not on PATH")
        return None

    def _git(*args: str) -> str | None:
        try:
            proc = subprocess.run(
                [git, "-C", project_directory, *args],
                capture_output=True,
                text=True,
                timeout=10,
                check=False,
            )
        except (OSError, subprocess.SubprocessError) as e:
            debug_log(f"_read_recent_change: git {args[0]} failed: {e}")
            return None
        if proc.returncode != 0:
            return None
        return proc.stdout

    if _git("rev-parse", "--git-dir") is None:
        return None

    parts: list[str] = []
    headline = ""

    # Uncommitted work first: it is the change the user is most likely being quizzed on.
    working = _git("diff", "--name-only", "HEAD") or ""
    working_files = [line for line in working.splitlines() if line.strip()]

    message = _git("log", "-1", "--pretty=%s%n%b")
    if message is not None and message.strip():
        lines = [line for line in message.splitlines() if line.strip()]
        headline = lines[0] if lines else ""
        parts.append(message)

    committed = _git("show", "--name-only", "--pretty=format:", "HEAD") or ""
    parts.extend(line for line in committed.splitlines() if line.strip())
    parts.extend(working_files)

    text = "\n".join(p for p in parts if p.strip())
    if not text.strip():
        return None

    if working_files and headline:
        headline = f"{headline} (plus {len(working_files)} uncommitted file(s))"
    elif working_files:
        headline = f"{len(working_files)} uncommitted file(s)"

    return {"headline": headline.strip(), "text": text}


def _resolve_change_context(summary: str, project_directory: str) -> tuple[str, str]:
    """Decide what kind of change this is, and what the card should show as its summary.

    Order: the caller's own summary, then the repository's most recent change (the diff).
    Raises InsufficientContextError when neither says anything — the tool refuses to
    invent a change type rather than answering from nothing.
    """
    change_type = _detect_change_type(summary)
    if change_type is not None:
        return change_type, summary

    recent = _read_recent_change(project_directory)
    if recent is not None:
        change_type = _detect_change_type(recent["text"])
        if change_type is not None:
            # Show the user the evidence the questions were actually built from,
            # so a derived classification is never presented as if the agent said it.
            evidence = f"Most recent change in this repository: {recent['headline']}"
            summary_for_ui = f"{summary.strip()}\n\n{evidence}" if summary.strip() else evidence
            return change_type, summary_for_ui

    raise InsufficientContextError(
        "learning_session has nothing to build questions from: the `summary` argument "
        "does not say what changed, and no recognisable change was found in "
        f"{project_directory!r}. Call again with a `summary` describing the change you "
        "just made, and ideally an explicit `quizzes` list. Refusing rather than "
        "inventing a quiz about code that was never read."
    )


@mcp.tool()
async def learning_session(
    summary: Annotated[
        str,
        Field(
            description=(
                "REQUIRED. What actually changed and why, in the user's own terms — this is "
                "what the card and its questions are built from. Never a placeholder like "
                "'task complete'; the tool refuses when it cannot tell what changed."
            )
        ),
    ],
    project_directory: str = ".",
    reasoning: dict[str, Any] | None = None,
    quizzes: list[dict[str, Any]] | None = None,
    focus_areas: list[Literal["logic", "security", "performance", "architecture", "syntax"]] | None = None,
    timeout: Annotated[int, Field(ge=60, le=7200)] = 600,
) -> dict[str, Any]:
    """Interactive quiz card about a specific change. Call ONLY when user says 'quiz me' or 'test me'.

    You MUST pass `summary` (what changed and why). Pass `quizzes` too whenever you can —
    questions you write about the real diff beat the built-in templates. Pass `reasoning`
    (goal/trigger/mechanism/alternatives/risks) when you know it: omit it and the card
    shows an empty reasoning panel rather than invented reasoning. Without a usable
    summary the tool reads the repository's most recent change; if that says nothing
    either it REFUSES instead of guessing. Blocks until the user is done.
    """
    debug_log(f"learning_session called: project={project_directory}, timeout={timeout}")

    # Ensure project directory exists — resolved BEFORE reading the repository below,
    # so the diff we read is the one the card will claim to be about.
    if not os.path.exists(project_directory):
        project_directory = os.getcwd()
    project_directory = os.path.abspath(project_directory)

    # Validate and set defaults
    if reasoning:
        _validate_reasoning(reasoning)

    if quizzes:
        _validate_quizzes(quizzes)
    else:
        try:
            change_type, summary = _resolve_change_context(summary, project_directory)
        except InsufficientContextError as e:
            debug_log(f"learning_session refused: {e}")
            # No HALT_GENERATION: the agent should retry with real content, not fall silent.
            return {
                "status": "insufficient_context",
                "error": str(e),
            }
        quizzes = _generate_default_quizzes(change_type)

    if focus_areas is None:
        focus_areas = ["logic"]

    try:
        # Import and launch the Web UI
        from .web import launch_learning_session_ui

        result = await launch_learning_session_ui(
            project_directory=project_directory,
            summary=summary,
            reasoning=reasoning,
            quizzes=quizzes,
            focus_areas=focus_areas,
            timeout=timeout,
        )

        debug_log(f"Learning session completed: {result}")

        # Return minimal result to signal Agent to stop
        # NOTE: We intentionally do NOT return quiz_score to reduce context pollution
        # The score is saved locally for user's self-tracking, not for agent consumption
        return {
            "status": "completed",
            "action": "HALT_GENERATION",
        }

    except TimeoutError as e:
        debug_log(f"Learning session timed out: {e}")
        return {
            "status": "timeout",
            "message": str(e),
            "action": "HALT_GENERATION",
        }

    except Exception as e:
        debug_log(f"Learning session error: {e}")
        return {
            "status": "error",
            "message": str(e),
        }


@mcp.tool()
async def debug_search(
    query: str,
    project_directory: str = ".",
    error_type: str | None = None,
    tags: list[str] | None = None,
    limit: Annotated[int, Field(ge=1, le=20)] = 5,
) -> dict[str, Any]:
    """Search debug history for past solutions. AUTO-call silently on errors."""
    debug_log(f"debug_search called: query='{query[:50]}...', project={project_directory}")

    # Ensure project directory exists
    if not os.path.exists(project_directory):
        project_directory = os.getcwd()
    project_directory = os.path.abspath(project_directory)

    try:
        from .storage import DebugIndexManager, DebugRetrieval

        # Initialize index and retrieval
        index_manager = DebugIndexManager(project_directory)
        retrieval = DebugRetrieval(index_manager)

        # Perform search
        results = retrieval.search(
            query=query,
            limit=limit,
            error_type=error_type,
            tags=tags,
        )

        if results:
            debug_log(f"Found {len(results)} matching records")
            # Progressive disclosure: return compact summaries, not full records
            # This reduces context pollution while still providing useful information
            compact_results = []
            for r in results:
                cause = r.get("cause", "")
                solution = r.get("solution", "")
                compact_results.append({
                    "id": r.get("id"),
                    "error_type": r.get("context", {}).get("error_type", "Unknown"),
                    "cause_summary": cause[:100] + ("..." if len(cause) > 100 else ""),
                    "solution_summary": solution[:150] + ("..." if len(solution) > 150 else ""),
                    "tags": r.get("tags", [])[:5],  # Limit tags
                })
            return {
                "results": compact_results,
                "count": len(results),
                "hint": "Use record IDs to retrieve full details if needed",
            }
        else:
            debug_log("No matching records found")
            return {
                "results": [],
                "count": 0,
            }

    except Exception as e:
        debug_log(f"debug_search error: {e}")
        # A failed search used to be byte-identical to a successful search that found
        # nothing, so a broken or unreadable index read to the agent as "this project
        # has no debug history" — forever, and silently. Say which one it was.
        return {
            "results": [],
            "count": 0,
            "error": f"debug history could not be searched: {type(e).__name__}: {str(e)[:200]}",
        }


@mcp.tool()
async def debug_record(
    context: dict[str, Any],
    cause: str,
    solution: str,
    project_directory: str = ".",
    tags: list[str] | None = None,
) -> dict[str, Any]:
    """Record debug solution. AUTO-call silently after fixing errors."""
    debug_log(f"debug_record called: context={context}, project={project_directory}")

    # Ensure project directory exists
    if not os.path.exists(project_directory):
        project_directory = os.getcwd()
    project_directory = os.path.abspath(project_directory)

    try:
        from .storage import DebugIndexManager

        # Initialize index manager
        index_manager = DebugIndexManager(project_directory)

        # Validate context
        if not isinstance(context, dict):
            return {
                "ok": False,
                "error": "context must be a dictionary",
            }

        # Ensure context has required fields
        if "error_type" not in context:
            context["error_type"] = "Unknown"
        if "error_message" not in context:
            context["error_message"] = "No message provided"

        # Record the experience
        record_id = index_manager.record(
            context=context,
            cause=cause,
            solution=solution,
            tags=tags,
        )

        debug_log(f"Debug experience recorded: {record_id}")
        # Minimal return to reduce context pollution
        return {
            "ok": True,
            "id": record_id,
        }

    except Exception as e:
        debug_log(f"debug_record error: {e}")
        return {
            "ok": False,
            "error": str(e)[:100],  # Truncate error message
        }


@mcp.tool()
async def term_get(
    project_directory: str = ".",
    count: Annotated[int, Field(ge=1, le=5)] = 3,
    domain: str | None = None,
) -> dict[str, Any]:
    """Get unshown programming terms. Domains: programming_basics, algorithms, web_development, etc."""
    debug_log(f"term_get called: project={project_directory}, count={count}, domain={domain}")

    # Ensure project directory exists
    if not os.path.exists(project_directory):
        project_directory = os.getcwd()
    project_directory = os.path.abspath(project_directory)

    try:
        from .storage import TermsIndexManager

        manager = TermsIndexManager(project_directory)
        terms = manager.get_unshown_terms(count=count, domain=domain)

        if terms:
            # Mark as shown
            manager.mark_as_shown([t["id"] for t in terms])

            return {
                "terms": terms,
                "count": len(terms),
                "remaining": manager.get_remaining_count(),
                "message": f"Retrieved {len(terms)} new terms",
            }
        else:
            return {
                "terms": [],
                "count": 0,
                "remaining": 0,
                "message": "No new terms available. All terms have been shown.",
            }

    except Exception as e:
        debug_log(f"term_get error: {e}")
        return {
            "terms": [],
            "count": 0,
            "remaining": 0,
            "message": f"Error: {str(e)}",
        }


# =============================================================================
# MCP PROMPTS - On-demand templates for detailed guidance
# =============================================================================

@mcp.prompt(name="agent_guidelines")
def agent_guidelines() -> str:
    """Get detailed agent behavior guidelines for using this MCP server.

    Use this prompt when you need comprehensive guidance on:
    - When to trigger learning_session
    - How to handle tool responses
    - Best practices for debug tools
    """
    return """# Covate - Agent Guidelines

## Rule 1: Learning Session Gatekeeper

This server has a `learning_session` tool that opens an interactive WebUI.

### You MUST call learning_session when user says:
- "Quiz me" / "Test me" / "Give me a quiz"
- "Teach me" / "Help me learn about this"
- "I want to understand this change"
- "做完后出题" / "考考我" / "帮我学习"

### You MUST NOT call learning_session when:
- Task just completed (don't auto-trigger!)
- User asks "what changed?" (just explain directly)
- User asks for summary (provide text summary instead)

## Rule 2: Silence Protocol (CRITICAL)

When `learning_session` returns with `"action": "HALT_GENERATION"`:

1. **STOP generating immediately** - not one more character
2. **Output NOTHING** - no summary, no explanation, no "done!"
3. The WebUI already shows everything the user needs

### Why?
- The learning card UI replaces your summary
- Extra output wastes tokens and confuses users
- User has already seen all info in the interactive card

## Rule 3: Proactive Debug Tools (IMPORTANT)

`debug_search` and `debug_record` should be called **AUTOMATICALLY** without user prompts:

### debug_search - AUTO-TRIGGER when:
- You encounter ANY error, exception, or failure
- Build/test/lint commands fail
- You see error messages in command output
- **BEFORE** attempting to fix: search first!

### debug_record - AUTO-TRIGGER when:
- You successfully fix ANY bug or error
- Build/test/lint failures are resolved
- A previously failing operation now succeeds

### Key Behaviors:
- Call silently without announcing to users
- Integrate search results naturally into your fix strategy
- Always record successful fixes for future reference
- Don't say "I'm searching debug history..." or "Recording experience..."

## Example Correct Behavior

```
User: "Fix this TypeError"

Agent: [sees TypeError in output]
Agent: [AUTO: calls debug_search("TypeError...") silently]
Agent: [uses historical solutions to inform fix]
Agent: [fixes the bug]
Agent: [AUTO: calls debug_record silently to save the experience]
Agent: "I've fixed the TypeError by..."
```

```
User: "Fix this TypeError and then quiz me on what you did"

Agent: [sees TypeError, AUTO calls debug_search]
Agent: [fixes the bug, AUTO calls debug_record]
Agent: [calls learning_session with summary and quiz]
[WebUI opens, user completes learning]
Agent: [STOPS - outputs nothing more]
```

## Example Incorrect Behavior

```
Agent: [sees error but doesn't search debug history first]  ← WRONG!
Agent: [fixes bug but doesn't record the solution]  ← WRONG!
Agent: "Let me search the debug history..."  ← WRONG! (should be silent)
```
"""


@mcp.prompt(name="quiz_template")
def quiz_template(topic: str = "code change") -> str:
    """Get a template for generating quiz questions about a topic.

    Args:
        topic: The topic to generate quiz questions about
    """
    return f"""# Quiz Template for: {topic}

Generate 3 quiz questions following this structure:

```json
{{
  "quizzes": [
    {{
      "question": "What is the main purpose of [specific change]?",
      "options": [
        "Option A - plausible but incorrect",
        "Option B - the correct answer",
        "Option C - common misconception",
        "Option D - partially correct"
      ],
      "answer": "B",
      "explanation": "Clear explanation of why B is correct and others are not"
    }},
    {{
      "question": "What potential issue could arise from [change]?",
      "options": ["..."],
      "answer": "X",
      "explanation": "..."
    }},
    {{
      "question": "How should you verify [change] works correctly?",
      "options": ["..."],
      "answer": "X",
      "explanation": "..."
    }}
  ]
}}
```

## Guidelines:
- Questions should test understanding, not memorization
- Include one question about purpose/goal
- Include one question about risks/trade-offs
- Include one question about verification/testing
- Explanations should be educational, not just "correct because..."
"""


def main():
    """Main entry point for the MCP server."""
    debug_enabled = os.getenv("MCP_DEBUG", "").lower() in ("true", "1", "yes", "on")

    if debug_enabled:
        debug_log(f"Starting {SERVER_NAME}")
        debug_log(f"Version: {__version__}")
        debug_log(f"Platform: {sys.platform}")

    try:
        mcp.run()
    except KeyboardInterrupt:
        if debug_enabled:
            debug_log("Received interrupt signal, exiting")
        sys.exit(0)
    except Exception as e:
        if debug_enabled:
            debug_log(f"Server startup failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
