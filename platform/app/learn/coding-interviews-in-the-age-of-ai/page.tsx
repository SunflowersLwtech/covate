import type { Metadata } from "next";
import { GITHUB, SITE } from "../../layout";
import { Evidence } from "../../_geo/Evidence";
import { SignInCta } from "../../SignInCta";

const PATH = "/learn/coding-interviews-in-the-age-of-ai";
const URL = SITE + PATH;

const TITLE = "Coding Interviews in the Age of AI: What to Still Practice";
const DESCRIPTION =
  "Interviews are adapting to a world where everyone has an AI assistant: less syntax recall, more explaining decisions, reading unfamiliar code, and debugging live. What that means for what you should practice — and what you can safely stop drilling.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "coding interviews AI era",
    "what to practice for coding interviews with AI",
    "software engineering interviews 2026",
    "AI in technical interviews",
    "leetcode in the age of AI",
  ],
  alternates: { canonical: PATH },
  openGraph: { type: "article", siteName: "Covate", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const SHIFTS = [
  {
    n: "01",
    title: "Explaining code is becoming the core exercise",
    body: "When take-homes can be AI-written, the interview moves to what can't be delegated on the spot: 'walk me through this function', 'why is this slow', 'what breaks if this input is null'. Explaining code you didn't write — cold, out loud — is a trainable skill and almost nobody trains it. Practice by reading real diffs and narrating them: what, why, where it bites.",
  },
  {
    n: "02",
    title: "Reading unfamiliar code beats memorizing algorithms",
    body: "More interviews now hand you an unknown codebase and ask you to find a bug or trace a feature. That tests the exact skill daily AI use quietly erodes — navigating code you didn't write. Deliberate codebase reading (a new repo a month, even small ones) is better interview prep than another hundred array problems, for this format.",
  },
  {
    n: "03",
    title: "Live debugging is the new whiteboard",
    body: "'Here's a failing test and a stack trace — fix it' is a format where AI assistance can't help you and daily AI dependence actively hurts you. The people who struggle are the ones who haven't formed a hypothesis unassisted in a year. The fix is cheap: for every bug, read the trace and commit to one hypothesis before any tool sees it.",
  },
  {
    n: "04",
    title: "Syntax recall still matters — just less, and differently",
    body: "Classic algorithm drills aren't worthless: they build decomposition muscle and keep syntax retrieval fast, and plenty of interviewers still run them. But treat them as conditioning, not the sport. The high-leverage version is writing small programs from a blank file regularly — which is also the exact skill that atrophies most when AI writes your daily code.",
  },
  {
    n: "05",
    title: "Honest AI-use positioning is part of the interview now",
    body: "Some interviewers now ask directly how you use AI. 'I delegate everything and review the output' reads as a liability; 'I use it for boilerplate and explanations, I can re-derive the core, here's how I verify' reads as senior. Your answer is only as good as the truth behind it — which loops back to keeping the skills above real.",
  },
] as const;

const FAQ = [
  {
    q: "Are coding interviews still worth practicing for if AI can write code?",
    a: "Yes — the formats are shifting toward what AI can't do live in front of a stranger: explaining unfamiliar code, debugging a failing test, defending design decisions, and writing small programs from a blank file. If anything, daily AI use makes interview practice more important, not less, because the natural workflow no longer exercises those skills automatically. The efficient move is to redirect drilling time toward the shifted formats rather than abandoning practice.",
  },
  {
    q: "Is LeetCode dead in the age of AI?",
    a: "Not dead — declining in share and changing in role. Algorithm problems still appear, and they still build real decomposition muscle, but more interviewers pair them with code-reading, debugging, and explanation rounds that AI-assisted take-homes can't authenticate. Treat algorithm practice as conditioning for a broader game: keep it light and regular, and spend the freed hours on reading real codebases and narrating decisions out loud.",
  },
  {
    q: "What skills should I practice for technical interviews in 2026?",
    a: "Four, in rough order of rising weight: reading and explaining unfamiliar code (narrate real diffs regularly); live debugging from a stack trace (form one hypothesis before consulting anything); writing small programs unassisted from a blank file (the blank-file test); and articulating trade-offs out loud ('why this approach over the alternative'). All four are also the skills that erode fastest in a generate-first daily workflow.",
  },
  {
    q: "Should I mention my AI usage in an interview?",
    a: "If asked, answer specifically and honestly: what you delegate (boilerplate, explanations, scaffolding), what you keep (core logic, verification, debugging hypotheses), and how you verify what the AI writes. Interviewers aren't screening for AI abstinence — they're screening for whether you can still think without it. A concrete personal verification habit is a strong answer; a vague 'I review everything' is a weak one.",
  },
  {
    q: "How does Covate help prepare for interviews in the AI era?",
    a: "Covate trains exactly the skills the shifted formats test, using your daily work as the material. Its free, open-source MCP plugs into your AI coding assistant (Claude, Cursor, Copilot and others), turns your real diffs into short, targeted quizzes — effectively rehearsing 'explain this code' on the code you actually ship — and keeps project debug memory so the diagnostic patterns stick. The free ledger on covate.org (sign in with GitHub, nothing to buy) tracks accuracy and weak topics: a factual answer to 'how solid am I unassisted?' before someone else asks it.",
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
    datePublished: "2026-08-16",
    dateModified: "2026-08-27",
    mainEntityOfPage: { "@type": "WebPage", "@id": URL },
    author: { "@id": SITE + "#organization" },
    publisher: { "@id": SITE + "#organization" },
    about: { "@type": "Thing", name: "coding interviews and AI" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn" },
      { "@type": "ListItem", position: 3, name: "Interviews in the age of AI", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function InterviewsAiEra() {
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
            Coding interviews in the age of AI: what to still practice
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            Interviews are adapting to a world where everyone has an assistant: less syntax recall, more explaining
            decisions, reading unfamiliar code, and debugging live. What that means for your practice hours — and
            what you can safely stop drilling.
          </p>
          <p className="mt-4 font-mono text-xs text-dim">By the Covate team · Updated August 16, 2026</p>
        </header>

        <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <p>
              The uncomfortable truth for anyone who codes daily with AI: the interview room is one of the few
              remaining places where the assistant isn&rsquo;t in the room with you, and the skills it quietly
              stopped exercising are precisely the ones being tested. That&rsquo;s not a reason to panic — it&rsquo;s
              a reason to redirect practice toward the formats that actually appear now, instead of grinding the
              ones that matter less each year.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Five shifts worth training for</h2>
            <ol className="mt-6 space-y-5">
              {SHIFTS.map((c) => (
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
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The thread underneath</h2>
            <p className="mt-4">
              Every shifted format tests the same underlying thing: can you still think out loud, unassisted, about
              code? That&rsquo;s the same question our other guides circle from the daily-work side —{" "}
              <a href="/learn/should-you-still-learn-to-code-with-ai" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                whether to keep learning fundamentals
              </a>,{" "}
              <a href="/learn/cant-code-without-ai-anymore" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                rebuilding what dependence eroded
              </a>, and{" "}
              <a href="/learn/how-to-explain-ai-generated-code-in-a-code-review" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                explaining AI-generated code under questioning
              </a>. Interview prep and skill retention have converged: one practice regimen now serves both, and the
              blank-file test is its checkpoint.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Rehearse the real formats daily — with Covate</h2>
            <p className="mt-4 text-secondary">
              Covate turns your everyday AI-assisted work into interview reps. The free, open-source MCP plugs into
              your assistant (Claude, Cursor, Copilot and others), quizzes you on your real diffs — the
              &ldquo;explain this code&rdquo; round, on the code you actually ship — and its debug memory keeps the
              failure patterns you&rsquo;ve solved retrievable. The free{" "}
              <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
                learning ledger
              </a>{" "}
              on covate.org tracks accuracy and weakest topics, so prep targets your gaps instead of your comfort.
              Nothing to buy.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <SignInCta />
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary">
                Get the free open-source MCP →
              </a>
            </div>
            <p className="mt-4 font-mono text-[11px] text-dim">The MCP is free and open-source (MIT). So is the learning ledger on covate.org — sign in with GitHub, nothing to buy.</p>
          </section>

          {/* Shared evidence layer: sourced research, the verification comparison,
              the tool's own checkable numbers, and the source list. Kept in one
              module (app/_geo/Evidence.tsx) so the figures cannot drift apart
              across the 20 pages that quote them. */}
          <Evidence />

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">FAQ</h2>
            <div className="mt-4 divide-y divide-border border-y border-border">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="cursor-pointer list-none">
                    <h3 className="text-sm font-medium text-primary transition group-open:text-accent hover:text-accent">{f.q}</h3>
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
              <a href="/learn/should-you-still-learn-to-code-with-ai" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                Should you still learn to code in the age of AI? →
              </a>
              <a href="/learn/how-to-learn-a-new-programming-language-with-ai" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to learn a new programming language with AI →
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
