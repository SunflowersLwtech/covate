// The Learning Center's published guides — English content data, not UI copy. The
// canonical hub for the /learn cluster; each entry links to its full article. Keep in
// sync when adding a new /learn/<slug> page (also add it to sitemap.ts and llms.txt).
export type Article = {
  slug: string;
  category: string;
  title: string;
  description: string;
};

export const ARTICLES: readonly Article[] = [
  {
    slug: "what-is-vibe-coding",
    category: "Fundamentals",
    title: "What is vibe coding? Meaning, origin, and when to use it",
    description:
      "Vibe coding means describing what you want to an AI in plain English and largely accepting what it produces without reading the code closely. A clear definition, where the term came from (Andrej Karpathy, 2025), where it genuinely works, where it bites you, and how to do it without quietly losing your skills.",
  },
  {
    slug: "how-to-learn-from-ai-generated-code",
    category: "Skill retention",
    title: "How to actually learn from AI-generated code (without skill decay)",
    description:
      "AI writes most of your code now — so how do you keep learning instead of quietly losing your skills? A practical guide to understanding AI-generated code, avoiding vibe-coding skill decay, and turning every diff into durable knowledge with active recall.",
  },
  {
    slug: "how-to-learn-a-new-codebase-fast",
    category: "Onboarding",
    title: "How to learn a new codebase fast",
    description:
      "Just joined a project or opened a big unfamiliar repo? Reading it top to bottom doesn't work. A practical 7-step method for understanding a new codebase fast — run it, trace one real request end to end, read the tests, use git history — without trying to understand everything first.",
  },
  {
    slug: "does-ai-make-you-a-worse-programmer",
    category: "AI & skills",
    title: "Does using AI make you a worse programmer? An honest look",
    description:
      "Does relying on AI coding assistants make you a worse programmer? The honest answer: it can — through skill decay — but it doesn't have to. A balanced look at the evidence on both sides, and the single factor (active vs passive use) that decides which way it goes for you.",
  },
  {
    slug: "how-to-avoid-over-relying-on-ai-when-coding",
    category: "Staying sharp",
    title: "How to avoid over-relying on AI when coding",
    description:
      "You use AI coding assistants and you like them — this isn't about quitting. The real risk isn't using AI, it's using it passively: accepting output you don't understand. The signs you're over-relying, why it matters, and a concrete habit list to keep your edge while you keep shipping with AI.",
  },
  {
    slug: "should-you-still-learn-to-code-with-ai",
    category: "Career",
    title: "Should you still learn to code in the age of AI?",
    description:
      "If AI can write the code, is it still worth learning to program? The honest answer is yes — but what you need to learn is shifting. Here's why understanding still matters more than ever, and what to focus on.",
  },
  {
    slug: "how-to-review-ai-generated-code",
    category: "Code review",
    title: "How to review AI-generated code before you merge it",
    description:
      "AI writes the code, but you're still responsible for it. A practical checklist for reviewing AI-generated code before you merge — what to actually check, the failure modes to watch for, and how to review it while you still understand it.",
  },
  {
    slug: "prompt-engineering-for-coding",
    category: "Prompting",
    title: "Prompt engineering for coding",
    description:
      "AI coding assistants are only as good as what you ask them. A practical guide to prompting them well — give context, be specific, set constraints, plan first, iterate — to get usable code from Claude, Cursor, Copilot and ChatGPT, and why you still have to understand and verify what comes back.",
  },
  {
    slug: "spaced-repetition-for-developers",
    category: "Memory & retention",
    title: "Spaced repetition for developers: how to actually remember what you learn",
    description:
      "You learn a concept, use it once, and forget it a month later. Spaced repetition is the fix — the science of reviewing things right before you'd forget them. Here's how it works and how to apply it to programming without building flashcards by hand.",
  },
  {
    slug: "cant-code-without-ai-anymore",
    category: "AI & skills",
    title: "\u201cI can't code without AI anymore\u201d — what to actually do about it",
    description:
      "If writing code without an AI assistant now feels impossible, the fix is deliberate re-exposure, not quitting cold turkey: rebuild the skill of writing small pieces yourself, on a schedule, starting with code you already understand. How to diagnose what you actually lost — syntax, decomposition, debugging, or codebase knowledge — and rebuild each one.",
  },
  {
    slug: "when-to-write-code-by-hand-vs-let-ai",
    category: "Staying sharp",
    title: "When to write code by hand vs. let AI write it",
    description:
      "Write it yourself when the goal is learning, the logic is tricky, or the code is central to your system; let AI write it when it's boilerplate, a well-understood pattern, or something you could trivially verify. A case-by-case decision framework based on one question: what does it cost later if you don't understand this now?",
  },
  {
    slug: "how-juniors-should-use-ai",
    category: "Career",
    title: "How junior developers should use AI without stalling their growth",
    description:
      "Juniors can use AI safely by staying in the verification loop: ask for explanations and drafts, but personally trace, test, and rewrite enough code that understanding — not output — remains the unit of progress. The risky accept-first default, six safe patterns, and the skills you should never delegate.",
  },
  {
    slug: "keep-a-learning-ledger-from-your-commits",
    category: "Memory & retention",
    title: "How to keep a learning ledger from your commits",
    description:
      "A learning ledger is a running record of what each coding session actually taught you — what changed, why, what you got quizzed on, what you keep getting wrong. Five levels of keeping the record, from commit-message discipline to a ledger that derives itself from your work, plus the weekly ritual that makes it pay off.",
  },
  {
    slug: "code-reading-routine-for-ai-heavy-teams",
    category: "Code review",
    title: "A code reading routine for AI-heavy teams",
    description:
      "When most merged code is AI-generated, reading has to become a scheduled routine instead of an occasional act: a weekly changed-surface review, diff-first standups, a rotating explainer role, and one shared weak-spot list. A concrete routine any team can run in about an hour a week.",
  },
  {
    slug: "how-to-explain-ai-generated-code-in-a-code-review",
    category: "Code review",
    title: "How to explain AI-generated code in a code review",
    description:
      "\u201cThe AI wrote it\u201d ends the conversation and your credibility with it. The four-question structure for explaining generated changes — what it does, why this approach, where it bites, how you verified — plus what a PR description needs and what to say when you don\u2019t know.",
  },
  {
    slug: "onboard-to-a-repo-with-an-mcp-learning-tool",
    category: "Onboarding",
    title: "How to onboard to a repo with an MCP learning tool",
    description:
      "Onboarding while an AI does most of the writing is dangerous unless something measures whether understanding is forming. How to pair the standard onboarding method with an MCP learning sidecar that quizzes you on your own changes — and an honest list of what it does not do.",
  },
  {
    slug: "how-to-learn-a-new-programming-language-with-ai",
    category: "Skill retention",
    title: "How to learn a new programming language with AI",
    description:
      "Learn a new language with AI by keeping the generation-to-comprehension ratio honest: AI explains, grades your idiom and tutors your reading of real code, while the load-bearing writing stays yours. A four-phase method — and the failure mode that quietly eats six weeks.",
  },
  {
    slug: "how-to-debug-with-ai-without-losing-the-skill",
    category: "Staying sharp",
    title: "How to debug with AI without losing the skill",
    description:
      "Debugging with AI works when the AI is the second step, not the first: read the trace, commit to a hypothesis, then bring the assistant in with your reasoning attached. The five-step loop that keeps the diagnostic muscle alive — and the paste-first habit that dissolves it.",
  },
  {
    slug: "coding-interviews-in-the-age-of-ai",
    category: "Career",
    title: "Coding interviews in the age of AI: what to still practice",
    description:
      "Interviews are adapting to everyone having an assistant: less syntax recall, more explaining decisions, reading unfamiliar code, and debugging live. The five format shifts worth training for, what to keep drilling lightly, and how to answer \u201chow do you use AI?\u201d honestly.",
  },
];
