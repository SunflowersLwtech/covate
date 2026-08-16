import type { Metadata } from "next";
import { SITE, GITHUB } from "../layout";
import { SignInCta } from "../SignInCta";

const PATH = "/learn";
const URL = SITE + PATH;

const TITLE = "Learning Center — Learn to Code With AI, Not Instead of It";
const DESCRIPTION =
  "The Covate Learning Center: honest, practical guides on staying a strong developer while you build with AI — how to learn from AI-generated code, review it, retain what you learn, and whether to still learn to code at all. Free to read, like the Covate MCP that quizzes you on your own code and the learning ledger that keeps the results.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "learn to code with AI",
    "developer learning center",
    "learn from AI-generated code",
    "avoid skill decay AI coding",
    "how to review AI code",
    "spaced repetition for developers",
    "should you still learn to code",
    "Covate learning ledger",
  ],
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Covate",
    url: URL,
    title: TITLE + " | Covate",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE + " | Covate",
    description: DESCRIPTION,
  },
};

type Article = {
  slug: string;
  category: string;
  title: string;
  description: string;
};

// The Learning Center's published guides. The canonical hub for the /learn
// cluster — each entry links to its full article. Keep in sync when adding a
// new /learn/<slug> page (also add it to sitemap.ts and llms.txt).
const ARTICLES: readonly Article[] = [
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
];

const collectionLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": URL + "#page",
  name: "Covate Learning Center",
  headline: TITLE,
  description: DESCRIPTION,
  url: URL,
  inLanguage: "en",
  isPartOf: { "@id": SITE + "#website" },
  publisher: { "@id": SITE + "#organization" },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: ARTICLES.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: SITE + "/learn/" + a.slug,
      name: a.title,
    })),
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": URL + "#breadcrumb",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
    { "@type": "ListItem", position: 2, name: "Learning Center", item: URL },
  ],
};

export default function LearnHub() {
  return (
    <div className="min-h-screen bg-deep text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href={SITE} className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-primary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Covate" width={26} height={26} className="rounded-md" />
          covate<span className="text-accent">.</span>
        </a>
        <nav className="flex items-center gap-6 text-sm text-secondary">
          <a href="/learn" className="text-primary transition-colors">Learn</a>
          <a href={SITE + "#how"} className="hidden transition-colors hover:text-primary sm:inline">How it works</a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">GitHub</a>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="hero-aurora bg-grid border-b border-border">
          <div className="relative z-10 mx-auto max-w-3xl px-6 pb-16 pt-16 text-center sm:pt-20">
            <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
              <a href={SITE} className="transition-colors hover:text-accent">Covate</a>
              <span aria-hidden="true"> / </span>
              <span className="text-secondary">Learning Center</span>
            </nav>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Learning Center
            </p>
            <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-primary sm:text-5xl">
              Learn to code <span className="text-brand">with</span> AI — not instead of it.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-secondary">
              Honest, practical guides on staying a strong developer while you build with AI:
              how to learn from generated code, review it, remember what you learn, and where to
              point your skills next. Free to read — and paired with the Covate tool that quizzes
              you on your own code so the learning actually sticks.
            </p>
          </div>
        </section>

        {/* Articles */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-semibold text-primary sm:text-3xl">Guides</h2>
              <span className="font-mono text-xs text-dim">{ARTICLES.length} articles</span>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {ARTICLES.map((a) => (
                <a
                  key={a.slug}
                  href={"/learn/" + a.slug}
                  className="group flex flex-col rounded-xl border border-border bg-surface/50 p-6 transition-colors hover:border-accent/60"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    {a.category}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold leading-snug text-primary group-hover:text-accent">
                    {a.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-secondary">{a.description}</p>
                  <span className="mt-4 font-mono text-xs text-dim group-hover:text-secondary">
                    Read →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* What Covate is */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Reading is step one
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-primary sm:text-3xl">
              The habit behind the guides
            </h2>
            <p className="mt-5 text-base leading-8 text-secondary">
              Every guide here points at the same idea: understanding is a habit, not a one-off. Covate
              turns that habit into a tool. It&rsquo;s an open-source MCP server that rides along with
              Claude, Cursor or Copilot, watches what actually changes in your codebase, and quizzes you
              on it — blocking further generation until you can explain what you just shipped. Sign in with GitHub
              and every session syncs into a learning ledger: each quiz you took, your running accuracy, and the
              topics you answer worst. Both halves are free — there is nothing to buy.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3">
              <SignInCta />
              <a
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary"
              >
                or install the free, open-source MCP now
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-dim sm:flex-row">
          <span className="font-mono">covate<span className="text-accent">.</span> — a DUOCODE TECHNOLOGY product</span>
          <div className="flex gap-5">
            <a href="/learn" className="hover:text-secondary">Learn</a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="hover:text-secondary">GitHub</a>
            <a href={SITE} className="hover:text-secondary">Home</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
