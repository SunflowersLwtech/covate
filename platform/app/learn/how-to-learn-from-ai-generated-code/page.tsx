import type { Metadata } from "next";
import { GITHUB, SITE } from "../../layout";
import { WaitlistForm } from "../../WaitlistForm";

const PATH = "/learn/how-to-learn-from-ai-generated-code";
const URL = SITE + PATH;

const TITLE = "How to Actually Learn From AI-Generated Code (Without Skill Decay)";
const DESCRIPTION =
  "AI writes most of your code now — so how do you keep learning instead of quietly losing your skills? A practical guide to understanding AI-generated code, avoiding vibe-coding skill decay, and turning every diff into durable knowledge with active recall.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "how to learn from AI-generated code",
    "understand code AI wrote",
    "vibe coding skill decay",
    "learn to code while using AI",
    "retain programming skills with AI assistant",
    "learn with Copilot Cursor Claude",
    "active recall for programmers",
    "avoid over-reliance on AI coding",
    "understand generated code you didn't write",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    siteName: "Covate",
    url: URL,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const FAQ = [
  {
    q: "Why is it so hard to learn from code an AI wrote for me?",
    a: "Because you skip the part where learning actually happens. When you write code yourself, you're forced to make hundreds of small decisions — which API, which data structure, how to handle the edge case — and each decision leaves a memory trace. When an AI writes it, you read a finished, plausible-looking solution and move on. Reading is passive; your brain treats a solution you merely accepted very differently from one you had to construct. The result is that you can ship a feature and, a week later, be unable to explain or modify it — the code exists in your repository but never made it into your head.",
  },
  {
    q: "What is 'vibe coding' skill decay?",
    a: "'Vibe coding' is the increasingly common workflow of describing what you want in natural language, accepting whatever the AI generates, and iterating on vibes rather than understanding. It's fast and often works — but if it's all you do, your own ability to reason about code, recall APIs, and debug from first principles quietly atrophies from disuse, the same way any unused skill does. Skill decay is dangerous precisely because it's invisible: everything feels fine while the AI is available and the problems are routine, and the gap only shows up when you hit something the AI can't solve, need to review code critically, or interview. The fix isn't to stop using AI — it's to stay an active participant in the code it writes.",
  },
  {
    q: "What's the single most effective way to learn from generated code?",
    a: "Active recall, applied immediately. The research on how people learn is consistent: you remember things far better when you retrieve them from memory than when you re-read them, and best of all when you're tested on them shortly after first exposure, while the context is still fresh. Applied to AI coding, that means: right after the AI generates a change, before you move on, quiz yourself on it. Cover the diff and try to explain what each part does and why; predict what would break if you changed a line; name the API or pattern it used and one alternative. Turning passive reading into active retrieval is the difference between code that passes through you and code that sticks.",
  },
  {
    q: "How do I do this without slowing myself down too much?",
    a: "Keep it small, frequent, and tied to the code you're already shipping — not a separate study session you'll never get to. A good rhythm is a 60-second check after each meaningful change: two or three questions about the concepts that just entered your codebase. The point isn't to re-derive everything from scratch; it's to make sure the ideas landed while the context is fresh, which is cheap when you do it immediately and expensive when you defer it. Over a week this adds a few minutes a day and compounds into genuinely understanding your own codebase — which pays for itself the first time you have to debug or extend it.",
  },
  {
    q: "How does Covate help with this?",
    a: "Covate automates exactly this loop. It's a free, open-source MCP tool that plugs into your AI coding assistant (Claude, Cursor, Copilot, and others), watches what actually changes in your codebase, and generates short, targeted quizzes from your real diffs — blocking further generation until you've answered, so you learn while the context is fresh instead of moving on. Every session is saved, and the optional paid Covate Learning Platform syncs those records to the cloud to give you a review dashboard, progress tracking, weak-topic analysis, and a personalized study plan with spaced repetition. In other words: it turns the 'quiz yourself on the diff' habit from something you have to remember to do into something that just happens as you code.",
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
    about: { "@type": "Thing", name: "learning from AI-generated code and avoiding skill decay" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn/how-to-learn-from-ai-generated-code" },
      { "@type": "ListItem", position: 3, name: "Learn from AI-generated code", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

const STEPS = [
  {
    n: "01",
    title: "Read the diff to explain it, not to approve it",
    body: "Before you accept a generated change, cover the explanation and read only the code. Can you say, out loud, what each part does and why the AI chose it over the obvious alternative? If you can't, that's the exact gap to close — you've found the thing you were about to ship without understanding.",
  },
  {
    n: "02",
    title: "Quiz yourself immediately, while the context is fresh",
    body: "Right after the change lands — not later, not 'when you have time' — retrieve it from memory. Name the API or pattern used and one alternative. Predict what breaks if you change a specific line. Active recall in the first minute is worth more than an hour of re-reading next week.",
  },
  {
    n: "03",
    title: "Track what you keep missing and revisit it",
    body: "The concepts you fumble the same way twice are your real weak spots. Note them, and let spaced repetition bring them back a few days later. Over weeks this turns a pile of accepted diffs into a map of what you actually know — and a shrinking list of what you don't.",
  },
];

export default function LearnFromAiCode() {
  return (
    <div className="min-h-screen bg-deep text-primary">
      {ld.map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}

      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href={SITE} className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-primary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Covate" width={26} height={26} className="rounded-md" />
          covate<span className="text-accent">.</span>
        </a>
        <nav className="flex items-center gap-6 text-sm text-secondary">
          <a href={SITE + "#how"} className="transition-colors hover:text-primary">How it works</a>
          <a href={SITE + "#pricing"} className="hidden transition-colors hover:text-primary sm:inline">Open-core</a>
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
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">The learning problem</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
            How to actually learn from AI-generated code
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            AI writes most of your code now. That makes you faster — but if you only ever accept what it
            generates, your own understanding quietly erodes. Here&apos;s how to keep learning while you build:
            why generated code doesn&apos;t stick, what &ldquo;vibe coding&rdquo; skill decay really is, and the
            one habit — active recall on your own diffs — that turns every change into durable knowledge.
          </p>
          <p className="mt-4 font-mono text-xs text-dim">By the Covate team · Updated August 4, 2026</p>
        </header>

        <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Why generated code doesn&apos;t stick</h2>
            <p className="mt-4">
              When you write code yourself, you make hundreds of tiny decisions — which API, which data
              structure, how to handle the edge case — and each one leaves a memory trace. When an AI writes
              it, you read a finished, plausible-looking solution and move on. Reading is passive; your brain
              treats a solution you merely approved very differently from one you had to construct. That&apos;s
              why you can ship a feature on Monday and, by Friday, be unable to explain or safely modify it: the
              code is in your repository, but it never made it into your head.
            </p>
            <p className="mt-4">
              None of this is an argument against AI. Used well, an assistant is the best learning accelerator
              programming has ever had — it can explain, compare approaches, and answer &ldquo;why&rdquo; on
              demand. The problem is only the default workflow: generate, glance, accept, repeat. That loop
              optimizes for shipping and skips the step where learning happens.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">&ldquo;Vibe coding&rdquo; skill decay is real — and invisible</h2>
            <p className="mt-4">
              &ldquo;Vibe coding&rdquo; — describing what you want, accepting what the AI produces, and iterating
              on vibes rather than understanding — is fast and often works. But if it&apos;s <em>all</em> you do,
              the skills you&apos;re not using start to fade: reasoning about code, recalling APIs, debugging from
              first principles. Skill decay is dangerous precisely because it&apos;s invisible. Everything feels
              fine while the AI is available and the problems are routine; the gap only shows up when you hit
              something the model can&apos;t solve, have to review code critically, or need to explain your own
              system to someone else. The goal isn&apos;t to code slower — it&apos;s to stay an active participant
              in the code the AI writes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The fix: active recall on your own diffs</h2>
            <p className="mt-4">
              Decades of learning research point to one robust finding: you remember things far better when you
              <em> retrieve</em> them from memory than when you re-read them — and best of all when you&apos;re
              tested shortly after first exposure, while the context is still fresh. This is the
              <strong> testing effect</strong>, and it maps perfectly onto AI-assisted coding. The moment a change
              is generated is the moment its context is richest in your mind and the cheapest time to lock it in.
              So instead of accepting and moving on, run a tiny active-recall loop on the diff:
            </p>
            <ol className="mt-6 space-y-5">
              {STEPS.map((s) => (
                <li key={s.n} className="rounded-xl border border-border bg-surface/40 p-5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm text-accent">{s.n}</span>
                    <h3 className="text-lg font-medium text-primary">{s.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-secondary">{s.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6">
              Done immediately, this costs about a minute per meaningful change and compounds into genuinely
              understanding your own codebase — which pays for itself the first time you have to debug or extend
              it. Deferred, it never happens. The whole trick is to make the check automatic and tied to the code
              you&apos;re already shipping.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Make the loop automatic with Covate</h2>
            <p className="mt-4 text-secondary">
              Covate is a free, open-source MCP tool that turns this habit from something you have to remember
              into something that just happens as you code. It plugs into your AI assistant (Claude, Cursor,
              Copilot and others), watches what actually changes, and generates short, targeted quizzes from your
              real diffs — blocking further generation until you answer, so you learn while the context is fresh.
              Every session is saved locally. The optional{" "}
              <a href={SITE} className="text-accent underline underline-offset-4 hover:text-accent-soft">
                Covate Learning Platform
              </a>{" "}
              syncs those records to the cloud for a review dashboard, progress tracking, weak-topic analysis, and
              a personalized study plan with spaced repetition.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <WaitlistForm />
              <a
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary"
              >
                Get the free open-source MCP →
              </a>
            </div>
            <p className="mt-4 font-mono text-[11px] text-dim">
              The MCP is free and open-source (MIT), forever. The Learning Platform is the paid, opt-in layer.
            </p>
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
              <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                Does using AI make you a worse programmer? An honest look →
              </a>
              <a href="/learn/how-to-review-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to review AI-generated code before you merge it →
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
