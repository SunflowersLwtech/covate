import { SITE, GITHUB } from "../layout";

export const dynamic = "force-static";

const BODY = `# Covate

> Covate turns AI-assisted coding into real understanding. An open-source MCP tool quizzes
> developers on their own code changes so they learn while they build; a paid cloud Learning
> Platform remembers every session and turns it into a personalized programming-learning
> experience. Open-core: the MCP is free and open-source (MIT); the Learning Platform is the
> paid layer.

## What it is
- Free, open-source MCP server (${GITHUB}): the \`learning_session\` tool generates blocking,
  interactive quizzes from your recent code changes; \`debug_search\` gives project-level debug
  memory. Runs locally, no account required.
- Paid Learning Platform (${SITE}): opt-in cloud sync of your learning sessions, a review
  dashboard, progress tracking, weak-topic analysis, and a personalized study plan with
  spaced repetition.

## Who it's for
Developers who use AI coding assistants (Claude, Cursor, Copilot, etc.) and want to keep
learning — and keep their skills sharp — instead of shipping code they don't understand.

## Status
The open-source MCP is available now. The Learning Platform is in early access; join the
waitlist at ${SITE}.

## Learn
- How to actually learn from AI-generated code (without skill decay): ${SITE}/learn/how-to-learn-from-ai-generated-code
  — why generated code doesn't stick, what "vibe coding" skill decay is, and the active-recall-on-your-diffs habit Covate automates.
- Does using AI make you a worse programmer? An honest look: ${SITE}/learn/does-ai-make-you-a-worse-programmer
  — the case on both sides, and why active vs passive use is the factor that decides whether AI erodes or sharpens your skills.
- How to review AI-generated code before you merge it: ${SITE}/learn/how-to-review-ai-generated-code
  — a 6-point review checklist (understand it, scope, edge cases, security, codebase fit, tests) and why to review right after generation.

## Operator
DUOCODE TECHNOLOGY. Landing: ${SITE}. Source: ${GITHUB}.
`;

export function GET() {
  return new Response(BODY, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
