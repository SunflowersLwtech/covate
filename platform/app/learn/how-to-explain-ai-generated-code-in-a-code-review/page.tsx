import type { Metadata } from "next";
import { GITHUB, SITE } from "../../layout";
import { SignInCta } from "../../SignInCta";

const PATH = "/learn/how-to-explain-ai-generated-code-in-a-code-review";
const URL = SITE + PATH;

const TITLE = "How to Explain AI-Generated Code in a Code Review";
const DESCRIPTION =
  "When reviewers ask about AI-generated code, 'the AI wrote it' ends the conversation and your credibility with it. How to explain generated changes — the four-question structure, what to put in the PR description, and what to say honestly when you don't know.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "explain AI generated code",
    "code review AI code",
    "answer questions about AI code",
    "PR description AI generated",
    "defend AI written code review",
  ],
  alternates: { canonical: PATH },
  openGraph: { type: "article", siteName: "Covate", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const STRUCTURE = [
  {
    n: "01",
    title: "What it does, in one sentence",
    body: "Lead with behavior, not implementation: 'this retries failed webhook deliveries with exponential backoff, capped at five attempts.' If you can't produce that sentence, you're not ready to explain the change — you're ready to go read it. The one-sentence behavior summary is the ticket to the rest of the conversation.",
  },
  {
    n: "02",
    title: "Why this approach and not the obvious alternative",
    body: "Reviewers trust changes more when the road not taken is visible. 'I considered a queue, but delivery latency matters more than ordering here, so in-process retry won.' For generated code this is exactly where 'the AI picked it' fails: you have to reconstruct the trade-off yourself, and doing so is also the fastest way to actually understand the change.",
  },
  {
    n: "03",
    title: "Where it bites: edge cases and failure modes",
    body: "Name the boundaries out loud — empty inputs, concurrent calls, timeouts, what happens when the third retry also fails. Generated code tends to nail the happy path and skip the rest, so the honest answer here is often 'I checked these two; I did not check that one, and here's why I think it's safe.' That sentence, said plainly, is what credibility sounds like.",
  },
  {
    n: "04",
    title: "How I verified it",
    body: "Close with evidence: which tests you ran, what you changed to watch them fail, what you read in the surrounding code to confirm the fit. 'The tests passed' is not verification — the AI wrote tests that encode whatever the code happens to do. 'I broke the retry cap and watched the test fail' is verification, and reviewers can tell the difference immediately.",
  },
] as const;

const FAQ = [
  {
    q: "What do I say when a reviewer asks about code the AI wrote?",
    a: "Answer with the same four things you'd say about code you wrote by hand: what it does in one sentence, why this approach over the alternative, where the edge cases and failure modes are, and how you verified it. The fact that AI generated it changes none of the structure — it only raises the odds you're missing a piece, which is exactly why going through the structure matters. 'The AI wrote it' answers none of the four questions and tells the reviewer to trust code that nobody in the room can explain.",
  },
  {
    q: "Should I disclose that code was AI-generated in the PR?",
    a: "Follow your team's policy on labeling, and regardless of labeling, write the PR description as if a senior engineer will interrogate the diff — because they will. What matters in review is not provenance but accountability: someone must be able to explain and defend every line, and that someone is you. Teams differ on whether generation is disclosed explicitly; no team benefits from a description that couldn't survive the questions.",
  },
  {
    q: "What should an AI-generated change's PR description contain?",
    a: "The same skeleton as any good description, with two AI-specific additions: the behavior summary and the trade-off discussion (what was considered and why this won), then the edge cases you checked — and named ones you didn't — and how you verified the change beyond 'tests pass'. If the AI's own commit-message suggestion is all you have, you don't have a description yet; reconstruct the four parts yourself before requesting review.",
  },
  {
    q: "What if I genuinely can't answer a question about generated code?",
    a: "Say so, precisely: 'I don't know what happens under concurrent calls — I'll find out before this merges' is a professional answer that earns trust. Guessing, or improvising a plausible-sounding rationale the AI might have had, is the one truly bad move: it converts a knowledge gap into a credibility problem. Then close the gap, and notice that the question you couldn't answer is a permanent entry for your personal weak-spot list.",
  },
  {
    q: "How does Covate help with explaining AI code in reviews?",
    a: "Covate rehearses exactly this conversation before a human has it with you. Its free, open-source MCP plugs into your AI coding assistant (Claude, Cursor, Copilot and others), watches what actually changes, and turns your real diffs into short, targeted quizzes — the questions a sharp reviewer would ask — blocking further generation until you answer. Sessions sync to the free learning ledger on covate.org (sign in with GitHub, nothing to buy), tracking your accuracy and the topics you keep missing, so the gaps get found in private before they surface in review.",
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
    dateModified: "2026-08-16",
    mainEntityOfPage: { "@type": "WebPage", "@id": URL },
    author: { "@id": SITE + "#organization" },
    publisher: { "@id": SITE + "#organization" },
    about: { "@type": "Thing", name: "explaining AI-generated code in code review" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn" },
      { "@type": "ListItem", position: 3, name: "Explain AI code in review", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function ExplainAiCode() {
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
            How to explain AI-generated code in a code review
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            &ldquo;The AI wrote it&rdquo; ends the conversation and your credibility with it. Explaining generated
            changes well is a learnable structure: four questions, an honest account of what you didn&rsquo;t check,
            and a PR description that survives interrogation.
          </p>
          <p className="mt-4 font-mono text-xs text-dim">By the Covate team · Updated August 16, 2026</p>
        </header>

        <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <p>
              There&rsquo;s a specific silence that lands in a review when someone asks <em>why does this work this
              way?</em> and the author starts with &ldquo;so, the AI…&rdquo;. Reviewers aren&rsquo;t hostile to
              generated code — they&rsquo;re hostile to <em>unowned</em> code, and the fastest way to convert one
              into the other is to answer questions the same way you would for hand-written code: with structure.
              The moment you merge it, it&rsquo;s yours; the review is where you demonstrate that.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The four-question structure</h2>
            <ol className="mt-6 space-y-5">
              {STRUCTURE.map((c) => (
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
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Rehearse it before a human asks</h2>
            <p className="mt-4">
              The four questions are predictable — which means the gap between being able to answer them and not is
              detectable in private, before review. Walk the diff asking yourself each one; every stumble is a
              reading assignment, not a character flaw. The mechanics of reviewing the change itself are covered in{" "}
              <a href="/learn/how-to-review-ai-generated-code" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                how to review AI-generated code before you merge it
              </a>, and keeping the explanations alive across a team is covered in{" "}
              <a href="/learn/code-reading-routine-for-ai-heavy-teams" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                a code reading routine for AI-heavy teams
              </a>. Explaining is the same skill as understanding, performed out loud.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Get asked the hard questions first — with Covate</h2>
            <p className="mt-4 text-secondary">
              Covate is a private rehearsal for the review conversation. The free, open-source MCP plugs into your AI
              coding assistant (Claude, Cursor, Copilot and others), watches what actually changes, and turns your
              real diffs into short, targeted quizzes — behavior, trade-offs, edge cases — blocking further
              generation until you answer. The free{" "}
              <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
                learning ledger
              </a>{" "}
              on covate.org then tracks each synced session, your running accuracy, and the topics you keep getting
              wrong — so by the time a human reviewer asks, you&rsquo;ve already answered. Nothing to buy, on either
              half.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <SignInCta />
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary">
                Get the free open-source MCP →
              </a>
            </div>
            <p className="mt-4 font-mono text-[11px] text-dim">The MCP is free and open-source (MIT). So is the learning ledger on covate.org — sign in with GitHub, nothing to buy.</p>
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
              <a href="/learn/how-to-review-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to review AI-generated code before you merge it →
              </a>
              <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to actually learn from AI-generated code (without skill decay) →
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
