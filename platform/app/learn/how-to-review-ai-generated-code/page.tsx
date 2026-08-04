import type { Metadata } from "next";
import { GITHUB, SITE } from "../../layout";
import { WaitlistForm } from "../../WaitlistForm";

const PATH = "/learn/how-to-review-ai-generated-code";
const URL = SITE + PATH;

const TITLE = "How to Review AI-Generated Code Before You Merge It";
const DESCRIPTION =
  "AI writes the code, but you're still responsible for it. A practical checklist for reviewing AI-generated code before you merge — what to actually check, the failure modes to watch for, and how to review it while you still understand it.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "how to review AI-generated code",
    "reviewing AI code",
    "code review AI-generated",
    "review Copilot code",
    "check AI code before merging",
    "AI code review checklist",
    "is AI-generated code safe to merge",
    "review code you didn't write",
  ],
  alternates: { canonical: PATH },
  openGraph: { type: "article", siteName: "Covate", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const CHECKS = [
  {
    n: "01",
    title: "Can you explain what it does — and why this way?",
    body: "Before anything else, cover the AI's explanation and read only the diff. If you can't say, in your own words, what each part does and why it chose this approach over the obvious alternative, you can't review it — you can only rubber-stamp it. This is the single most important check, because everything else depends on actually understanding the change.",
  },
  {
    n: "02",
    title: "Does it do what you asked — and only that?",
    body: "AI loves to be helpful. Check that the change solves the actual problem, and watch for scope creep: extra 'improvements', renamed variables, reformatted files, or a refactor you didn't ask for, all buried in the same diff. Unrequested changes are where surprises hide. Trim the diff down to the change you actually wanted.",
  },
  {
    n: "03",
    title: "The edge cases and error paths",
    body: "Generated code usually nails the happy path and skips the rest. Check the boundaries: empty inputs, nulls, an empty list, a failed network call, a timeout, concurrent access. Ask specifically 'what happens if this returns nothing / throws / is called twice?' — the answer is often 'nobody thought about it,' and that's your bug before it ships.",
  },
  {
    n: "04",
    title: "Security and data handling",
    body: "Read every place the code touches input, auth, secrets, or the database. Is user input validated and escaped (SQL, shell, HTML)? Are permissions actually checked, not assumed? Are secrets read from env, not hardcoded? AI reproduces the patterns in its training data — including insecure ones — so this is exactly where a fresh human eye pays off.",
  },
  {
    n: "05",
    title: "Does it fit your codebase — not just work in isolation?",
    body: "The snippet may be correct on its own yet wrong for your project: it uses a library you don't use, ignores your existing helper, invents a new pattern where you already have a convention, or duplicates logic that lives elsewhere. Good code is consistent with the code around it. Make it match your project, not a generic Stack Overflow answer.",
  },
  {
    n: "06",
    title: "Are there tests — and do they test the right thing?",
    body: "If the change has no tests, that's a flag. If it has AI-written tests, read them critically: do they assert real behaviour, or do they just confirm the code does whatever it happens to do (tautological tests that pass no matter what)? Run them, and try breaking the code to confirm the tests actually catch it.",
  },
] as const;

const FAQ = [
  {
    q: "Do I really need to review AI-generated code carefully?",
    a: "Yes — arguably more carefully than code a human wrote, not less. When a colleague writes code, they've reasoned about your codebase, your conventions, and the specific problem; when an AI writes it, it has produced a plausible-looking solution based on patterns in its training data, with no real understanding of your system or accountability for the outcome. It's often right, but when it's wrong it's confidently wrong, and the failure modes are sneaky: subtle edge-case bugs, security patterns copied from insecure examples, scope creep, or code that works in isolation but doesn't fit your project. Crucially, once you merge it, it's your code — you own it, you'll maintain it, and you'll be the one debugging it at 2am. So the review isn't a formality; it's where you take back ownership of code you didn't write, and it's the difference between using AI to move faster and using AI to ship things you don't understand.",
  },
  {
    q: "What should I actually check when reviewing AI code?",
    a: "Start with understanding — if you can't explain what the change does and why, stop and figure that out first, because you can't review what you don't understand. Then work through a checklist: (1) does it solve the actual problem, and only that (watch for unrequested 'improvements' and scope creep)? (2) the edge cases and error paths — empty inputs, nulls, failures, timeouts, concurrency, the stuff generated code tends to skip; (3) security and data handling — input validation, auth checks, no hardcoded secrets, since AI can reproduce insecure patterns from its training data; (4) fit with your codebase — does it use your conventions and existing helpers, or invent new patterns and duplicate logic? (5) tests — are there any, and do they assert real behaviour rather than just passing tautologically? The theme across all of these is that AI is great at the happy path and generic correctness, and weak on the specifics of your system, the failure modes, and the things nobody explicitly asked about — so that's where to look.",
  },
  {
    q: "How do I review AI code faster without missing things?",
    a: "The trick is to review at the right moment and in small pieces, not to review less. Review each change right after it's generated, while the context is fresh in your head and the diff is small — a 60-second read of a focused change is far more effective than trying to review a giant pile of accumulated AI output later, when you've forgotten why any of it exists. Keep the diffs small by asking the AI for one focused change at a time. Read to explain, not just to approve. And lean on tooling for the mechanical parts (linters, type checkers, security scanners, your test suite) so your human attention goes to the things tools can't judge: does this actually solve the problem, does it fit the system, and did anyone think about the edge cases? Small, immediate, understanding-first reviews are both faster and more thorough than a big deferred rubber-stamp.",
  },
  {
    q: "How does Covate help me review and understand AI-generated code?",
    a: "Covate builds the 'understand it before you merge it' step directly into your workflow. It's a free, open-source MCP tool that plugs into your AI coding assistant (Claude, Cursor, Copilot and others), watches what actually changes in your codebase, and turns your real diffs into short, targeted quizzes — asking you about the concepts, APIs, edge cases, and trade-offs in the change, and blocking further generation until you answer. In other words, it forces the exact review-and-understand check this article is about, at the exact moment it matters most: right after the code is generated, while the context is fresh. Every session is saved, and the optional paid Covate Learning Platform syncs them to the cloud for a review dashboard, progress tracking, weak-topic analysis, and a personalized study plan — so reviewing AI code turns into compounding understanding instead of a step you skip when you're busy.",
  },
] as const;

const ld = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": URL + "#article",
    headline: TITLE,
    description: DESCRIPTION,
    inLanguage: "en",
    datePublished: "2026-08-04",
    dateModified: "2026-08-04",
    mainEntityOfPage: { "@type": "WebPage", "@id": URL },
    author: { "@id": SITE + "#organization" },
    publisher: { "@id": SITE + "#organization" },
    about: { "@type": "Thing", name: "reviewing AI-generated code before merging" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn/how-to-review-ai-generated-code" },
      { "@type": "ListItem", position: 3, name: "Review AI-generated code", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function ReviewAiCode() {
  return (
    <div className="min-h-screen bg-deep text-primary">
      {ld.map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href={SITE} className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-primary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Covate" width={26} height={26} className="rounded-md" />
          covate<span className="text-accent">.</span>
        </a>
        <nav className="flex items-center gap-6 text-sm text-secondary">
          <a href={SITE + "#how"} className="transition-colors hover:text-primary">How it works</a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">GitHub</a>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-20 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
          <a href={SITE} className="transition-colors hover:text-accent">Covate</a>
          <span aria-hidden> / </span>
          <span className="text-secondary">Learn</span>
        </nav>

        <header className="border-b border-border pb-8 pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">Practical guide</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
            How to review AI-generated code before you merge it
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            The AI writes the code, but the moment you merge it, it&apos;s yours — you own it, you maintain it, you
            debug it. Reviewing AI-generated code isn&apos;t a formality; it&apos;s where you take back ownership of
            code you didn&apos;t write. Here&apos;s a practical checklist of what to actually check, the failure modes
            to watch for, and how to review it while you still understand it.
          </p>
          <p className="mt-4 font-mono text-xs text-dim">By the Covate team · Updated August 4, 2026</p>
        </header>

        <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <p>
              AI coding assistants are genuinely good — but they produce <em>plausible</em> code, not
              <em> understood</em> code. They pattern-match against their training data with no real model of your
              system and no accountability for what happens after. That combination — usually right, occasionally
              confidently wrong, always your responsibility once merged — is exactly why a real review matters.
              Work through these six checks on every AI-generated change.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The 6-point review checklist</h2>
            <ol className="mt-6 space-y-5">
              {CHECKS.map((c) => (
                <li key={c.n} className="rounded-xl border border-border bg-surface/40 p-5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm text-accent">{c.n}</span>
                    <h3 className="text-lg font-medium text-primary">{c.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-secondary">{c.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Review at the right moment</h2>
            <p className="mt-4">
              The biggest lever isn&apos;t reviewing more — it&apos;s reviewing at the right time. Review each change
              <strong> right after it&apos;s generated</strong>, while the context is fresh and the diff is small. A
              60-second read of a focused change beats trying to review a giant pile of accumulated AI output later,
              when you&apos;ve forgotten why any of it exists. Keep diffs small (ask for one change at a time), let
              tooling handle the mechanical checks (linters, type checkers, scanners, tests), and spend your human
              attention on what tools can&apos;t judge: does this solve the problem, does it fit your system, and did
              anyone think about the edge cases?
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Make the review step automatic — with Covate</h2>
            <p className="mt-4 text-secondary">
              The hardest part of reviewing AI code is remembering to do it while you still have the context. Covate
              builds it in. It&apos;s a free, open-source MCP tool that plugs into your AI assistant (Claude, Cursor,
              Copilot and others), watches what actually changes, and turns your real diffs into short, targeted
              quizzes about the concepts, edge cases, and trade-offs — blocking further generation until you answer,
              so you understand each change before it moves on. Every session is saved; the optional{" "}
              <a href={SITE} className="text-accent underline underline-offset-4 hover:text-accent-soft">
                Covate Learning Platform
              </a>{" "}
              turns them into a review dashboard, progress tracking, and a personalized study plan.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <WaitlistForm />
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary">
                Get the free open-source MCP →
              </a>
            </div>
            <p className="mt-4 font-mono text-[11px] text-dim">The MCP is free and open-source (MIT), forever. The Learning Platform is the paid, opt-in layer.</p>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">FAQ</h2>
            <div className="mt-4 divide-y divide-border border-y border-border">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="cursor-pointer list-none text-sm font-medium text-primary transition hover:text-accent">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm leading-7 text-secondary">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Related */}
          <section className="border-t border-border pt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">Related</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to actually learn from AI-generated code (without skill decay) →
              </a>
              <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                Does using AI make you a worse programmer? →
              </a>
            </div>
          </section>
        </article>

        <div className="mt-12 border-t border-border pt-6 font-mono text-xs text-dim">
          <a href={SITE} className="hover:text-secondary">← Back to Covate</a>
        </div>
      </main>
    </div>
  );
}
