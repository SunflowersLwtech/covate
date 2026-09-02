import type { Metadata } from "next";
import { GITHUB, SITE } from "../../lib/site";
import { Evidence } from "../../_geo/Evidence";
import { SignInCta } from "../../SignInCta";
import { NAV, SiteHeader } from "../../_components/SiteHeader";
import { Breadcrumb } from "../../_components/Breadcrumb";
import { ArticleBackLink } from "../../_components/ArticleBackLink";

const PATH = "/learn/how-to-debug-with-ai-without-losing-the-skill";
const URL = SITE + PATH;

const TITLE = "How to Debug With AI Without Losing the Skill";
const DESCRIPTION =
  "Debugging with AI works when the AI is the second step, not the first: read the trace, form your own hypothesis, then bring the AI in with your reasoning attached. The loop that keeps debugging skill alive — and the paste-the-stack-trace habit that quietly kills it.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "debug with AI",
    "AI debugging assistant",
    "paste stack trace into ChatGPT",
    "debugging skill AI dependence",
    "how to use AI for debugging",
  ],
  alternates: { canonical: PATH },
  openGraph: { type: "article", siteName: "Covate", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const LOOP = [
  {
    n: "01",
    title: "Read the error yourself, first, always",
    body: "Before anything goes into a chat window: read the stack trace top to bottom, identify the file and line, and say out loud what the error claims happened. Half of all bugs die here — the trace names the problem plainly and you'd have seen it in ten seconds. The habit being trained is attention: errors almost always contain more information than people extract from them.",
  },
  {
    n: "02",
    title: "Commit to one hypothesis before consulting",
    body: "Write down (literally, or in a comment) what you think is wrong and what would prove it. 'The token is null because the refresh happens after this read — I'll log it.' Being wrong is fine; the point is that the diagnostic muscle — hypothesis, prediction, test — fires before the assistant does. This is the exact muscle that atrophies when pasting is the first move.",
  },
  {
    n: "03",
    title: "Bring the AI in with your reasoning attached",
    body: "Now use the assistant — but frame it as a colleague, not an oracle: here's the trace, here's what I've ruled out, here's my hypothesis, what's wrong with it? This framing changes what you get back (critique and alternatives rather than a confident guess), and it keeps you as the author of the investigation even when the AI contributes the key insight.",
  },
  {
    n: "04",
    title: "Verify the fix causally, not statistically",
    body: "'The tests pass now' is weaker evidence than it sounds. Ask why the change works: what was the mechanism, and why did the old code fail only in this path? If you can't explain the causal story, you haven't fixed the bug — you've displaced it. This is also where AI-suggested fixes most often mislead: they can mask symptoms while the underlying cause waits for production.",
  },
  {
    n: "05",
    title: "Bank the lesson where you'll find it again",
    body: "When it's solved, record the one-sentence lesson — the actual root cause, not the fix. Six weeks from now, when the same class of bug resurfaces, retrieval beats re-derivation. (This is the step Covate's debug memory exists to automate; more below.)",
  },
] as const;

const FAQ = [
  {
    q: "Is it bad to paste a stack trace into ChatGPT?",
    a: "As a first move, yes — not because the answer will be wrong (it's often useful), but because of what the habit does to you over months: the diagnostic loop of reading, hypothesizing, and testing gets skipped, and debugging skill is precisely that loop. As a second or third move, after you've read the trace and formed a hypothesis, pasting with your reasoning attached is exactly what a good colleague would do with a good senior engineer. The order is the skill; the tool is fine.",
  },
  {
    q: "How do I debug faster without losing debugging skill?",
    a: "Speed up the parts that aren't the skill: use AI to explain unfamiliar error messages, summarize unfamiliar library internals, and generate the logging or repro scaffolding around your hypothesis. Keep the core loop — read, hypothesize, test — human-authored. The fastest debuggers aren't the ones who outsource the loop; they're the ones whose hypotheses are sharp from having run thousands of loops themselves.",
  },
  {
    q: "What should I do when the AI's suggested fix doesn't work?",
    a: "Treat it as data about your problem statement, not as a vote to try the next suggestion blindly. A failed fix usually means the AI's model of the bug differs from reality — so tell it what the failed fix changed and what that rules out. Three consecutive failed AI fixes on the same bug is a strong signal to stop and go back to first principles: reproduce it minimally, read the code path with your own eyes, add instrumentation. The bug is telling you something the chat can't hear.",
  },
  {
    q: "How do I keep debugging skill while using AI daily?",
    a: "Keep the loop's first two steps non-negotiable — read the trace fully, and state one hypothesis of your own — before any AI consultation, on every bug regardless of pressure. Debugging skill decays through skipped reps, not through tool use, so the rule is a rep-preservation rule. Then record each solved root cause somewhere retrievable; pattern memory is most of what senior debugging ability actually is.",
  },
  {
    q: "How does Covate help with AI-assisted debugging?",
    a: "Two ways. Its open-source MCP plugs into your AI coding assistant (Claude, Cursor, Copilot and others) and turns your code changes — including fixes — into short, targeted quizzes, so the causal story behind each fix gets retrieved instead of just applied. And its debug_search tool keeps project-level debug memory: when the same class of failure resurfaces in the same codebase weeks later, the prior lesson is searchable instead of re-derived. Both halves are free — the MCP is MIT-licensed, and the learning ledger on covate.org has nothing to buy.",
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
    about: { "@type": "Thing", name: "debugging with AI while keeping the skill" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn" },
      { "@type": "ListItem", position: 3, name: "Debug with AI", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function DebugWithAi() {
  return (
    <div className="min-h-screen bg-deep text-primary">
      {ld.map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}

      <SiteHeader items={NAV.articleA} />

      <main className="mx-auto max-w-3xl px-6 pb-20 pt-10 sm:pt-14">
        <Breadcrumb current="Learn" />

        <header className="border-b border-border pb-8 pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">Practical guide</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
            How to debug with AI without losing the skill
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            Debugging with AI works when the AI is the second step, not the first: read the trace, commit to a
            hypothesis, then bring the assistant in with your reasoning attached. Here&rsquo;s the loop that keeps
            the diagnostic muscle alive — and the paste-first habit that quietly dissolves it.
          </p>
          <p className="mt-4 font-mono text-xs text-dim">By the Covate team · Updated August 16, 2026</p>
        </header>

        <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <p>
              Debugging is the skill AI most plausibly threatens, because the workflow is so naturally
              paste-shaped: an error appears, you paste it, an answer appears. Run that loop for a few months and
              something specific erodes — not knowledge, but the <em>diagnostic disposition</em>: the tolerance for
              sitting with a confusing trace, forming hypotheses, being wrong twice before being right. That
              disposition is most of what people mean by &ldquo;senior&rdquo;. The good news is that keeping it
              costs two steps, not two hours.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The five-step loop</h2>
            <ol className="mt-6 space-y-5">
              {LOOP.map((c) => (
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
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Why order matters more than tool</h2>
            <p className="mt-4">
              Nothing in this loop is anti-AI — three of the five steps use it. What the order protects is which
              mental events happen <em>before</em> the answer arrives. Reading the trace first means the error
              pattern registers; hypothesizing first means the diagnostic muscle fires; attaching your reasoning
              means the response engages your thinking instead of replacing it. The paste-first habit isn&rsquo;t
              worse because the answers are worse — often they&rsquo;re fine — it&rsquo;s worse because you skip
              every event that builds the skill. The broader pattern is the same one behind{" "}
              <a href="/learn/how-to-avoid-over-relying-on-ai-when-coding" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                avoiding over-reliance when coding
              </a>{" "}
              and the recovery plan in{" "}
              <a href="/learn/cant-code-without-ai-anymore" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                &ldquo;I can&rsquo;t code without AI anymore&rdquo;
              </a>: keep the load-bearing mental events human, delegate the scaffolding.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Debug memory, built in — with Covate</h2>
            <p className="mt-4 text-secondary">
              Covate turns the last two steps of the loop into infrastructure. The free, open-source MCP plugs into
              your AI coding assistant (Claude, Cursor, Copilot and others): its{" "}
              <code className="font-mono text-xs">debug_search</code> tool keeps project-level debug memory so
              solved root causes are retrievable when the same failure resurfaces, and{" "}
              <code className="font-mono text-xs">learning_session</code> turns your changes into short quizzes so
              the causal story behind each fix actually sticks. Sessions sync into the free{" "}
              <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
                learning ledger
              </a>{" "}
              on covate.org — sign in with GitHub, nothing to buy.
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
              <a href="/learn/how-to-avoid-over-relying-on-ai-when-coding" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to avoid over-relying on AI when coding →
              </a>
              <a href="/learn/keep-a-learning-ledger-from-your-commits" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to keep a learning ledger from your commits →
              </a>
            </div>
          </section>
        </article>

        <ArticleBackLink href={SITE} label="← Back to Covate" />
      </main>
    </div>
  );
}
