import type { Metadata } from "next";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { NAV, SiteHeader } from "../../../_components/SiteHeader";
import { Breadcrumb } from "../../../_components/Breadcrumb";
import { ArticleBackLink } from "../../../_components/ArticleBackLink";
import { ArticleByline } from "../../../_components/ArticleByline";
import { getLocale, getTranslations } from "next-intl/server";

const PATH = "/learn/how-juniors-should-use-ai";
const URL = SITE + PATH;

const TITLE = "How Juniors Should Use AI Without Stalling Growth";
const DESCRIPTION =
  "Junior developers can use AI safely by staying in the verification loop: ask for explanations and drafts, but personally trace, test, and rewrite enough code that understanding — not output — remains the unit of progress. The risky patterns, the safe ones, and what to always do yourself.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "how juniors should use AI",
    "junior developers AI coding assistants",
    "AI and junior developer growth",
    "new developers using Copilot",
    "junior dev AI dependence",
    "learning to code with AI as a beginner",
  ],
  alternates: { canonical: PATH },
  openGraph: { type: "article", siteName: "Covate", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const SAFE_PATTERNS = [
  {
    n: "01",
    title: "AI as explainer first, author second",
    body: "Flip the default order: instead of 'write this function', ask 'walk me through how this module works' or 'what's the difference between these two approaches here?' Explanations compound into judgment — your scarcest asset in the first years. When you do ask for code, ask it to narrate the reasoning it used, and read that narration before the code.",
  },
  {
    n: "02",
    title: "Draft-then-rewrite on anything load-bearing",
    body: "For code that matters (core logic, anything you'd debug), let AI produce a draft — then rewrite the important functions yourself before merging. You keep the speedup on scaffolding while forcing the key logic through your fingers. The diff between its draft and your rewrite is a precise, personal list of what you didn't know yet.",
  },
  {
    n: "03",
    title: "Explain every merged diff out loud",
    body: "Before accepting any change, say what it does and why in plain words — to a teammate, a rubber duck, or a note. If you can't, you've found the exact thing to learn, at the exact moment it's cheapest to learn it. This one habit is the single biggest fork between juniors who grow with AI and juniors who stall.",
  },
  {
    n: "04",
    title: "Debug yourself first, one hypothesis at a time",
    body: "Read the stack trace before pasting it. Form one hypothesis of your own and test it. Only then bring the AI in — with your hypothesis attached, so the conversation starts from your reasoning rather than replacing it. Debugging is where seniority is actually built; don't outsource the whole gym.",
  },
  {
    n: "05",
    title: "Use AI to generate your practice, not replace it",
    body: "Ask for exercises on the concept you just touched ('give me five edge cases for this function'), or quiz-style questions about the module you're working in. Turning the assistant from an author into a coach keeps the reps coming while keeping them yours.",
  },
  {
    n: "06",
    title: "Keep a record of what you keep getting wrong",
    body: "The strongest juniors we see track their gaps — the concepts that appear in quiz-after-quiz or review-after-review — and aim their learning time there. A running ledger turns 'I feel behind' into 'these three topics are my actual queue', which is a much easier problem.",
  },
] as const;

const FAQ = [
  {
    q: "Should junior developers use AI coding assistants at all?",
    a: "Yes — with the loop kept intact. The first years of a dev career build the foundation everything else sits on: reading code, decomposing problems, debugging, and judgment about design. AI can accelerate all of that when it's used as explainer, coach, and drafting partner — and can quietly replace all of it when it's used as an oracle that outputs working code you accept. The practical rule: keep yourself in the verification loop on every change you merge. If you can explain it, you're using AI; if you can't, it's using you.",
  },
  {
    q: "How can juniors use Copilot or Cursor without becoming dependent?",
    a: "Structure your usage so understanding stays mandatory rather than optional. Concretely: ask for explanations before code; rewrite the load-bearing parts of any AI draft by hand; explain every diff out loud before merging; debug from the stack trace yourself before pasting it to the assistant; and review your own accuracy over time — if there are concepts you keep missing, that's your study queue, not a signal to lean harder on the tool. Dependence isn't caused by using AI; it's caused by removing the moments where you'd otherwise have to produce understanding yourself.",
  },
  {
    q: "What skills should junior developers never delegate to AI?",
    a: "Reading and navigating real codebases; debugging from stack traces and forming your own hypotheses; decomposing a fuzzy requirement into a design before any code gets written; code review (both reviewing others and responding to review of your work — write the PR description yourself); and anything in a language or framework you're still learning. These are precisely the skills that are hardest to recover later, and they share one property: they're built by doing them slowly before doing them quickly.",
  },
  {
    q: "Will managers or seniors be able to tell if I'm just accepting AI code?",
    a: "Usually, quickly — and not through any surveillance, just conversation. Accept-only workflows produce a distinctive pattern: shipped output that outpaces the developer's ability to discuss it. In standup, code review, or an incident, 'why did you do it this way here?' separates understanding from throughput in about thirty seconds. The fix isn't to use AI less visibly; it's to make sure the understanding is real, which the habits above do as a side effect.",
  },
  {
    q: "How does Covate help junior developers use AI well?",
    a: "Covate turns 'make sure I understand my own changes' from a discipline into a mechanism. It's a free, open-source MCP tool that plugs into your AI coding assistant (Claude, Cursor, Copilot and others), watches what actually changes in your codebase, and turns your real diffs into short, targeted quizzes — blocking further generation until you answer. Every session syncs into a learning ledger on covate.org (sign in with GitHub; free, nothing to buy) showing each session, your running accuracy, and the topics you answer worst — which is exactly the 'what do I keep getting wrong' queue that directs a junior's limited study time.",
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
    about: { "@type": "Thing", name: "junior developers using AI coding assistants safely" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn" },
      { "@type": "ListItem", position: 3, name: "Juniors and AI", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default async function JuniorsAi() {
  const locale = await getLocale();
  const t = await getTranslations("learn.article");
  return (
    <div className="min-h-screen bg-deep text-primary">
      {ld.map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}

      <SiteHeader items={NAV.learn} />

      <main className="mx-auto max-w-3xl px-6 pb-20 pt-10 sm:pt-14">
        <Breadcrumb link />

        <header lang="en" className="border-b border-border pb-8 pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">Practical guide</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
            How junior developers should use AI without stalling their growth
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            Juniors can use AI safely by keeping themselves in the verification loop: ask for explanations and
            drafts, but personally trace, test, and rewrite enough code that understanding — not output — remains
            the unit of progress. The risky patterns, the safe ones, and the skills you should never delegate.
          </p>
          <ArticleByline updated="2026-08-16" />
        </header>

        <article lang="en" className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <p>
              The junior years are when the foundations get poured: reading real codebases, decomposing problems,
              debugging, forming taste. AI assistants are superchargers for all of it — or replacements for all of
              it, depending on one structural choice: whether understanding stays <em>mandatory</em> in your
              workflow or becomes optional. A senior delegating boilerplate is spending saved time on architecture;
              a junior defaulting the same way is skipping the only reps that build the career. The difference
              isn’t discipline or talent — it’s workflow design, and it’s buildable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The risky default — and why it’s invisible</h2>
            <p className="mt-4">
              The danger pattern is <strong>accept-first development</strong>: prompt, receive, paste, green tests,
              merge. It feels like productivity, reviews pass, tickets close — and nothing in the surrounding
              process forces you to understand what shipped. The cost arrives later and denominated in the exact
              currency juniors are supposed to be accumulating: you can’t debug it, can’t extend it confidently,
              can’t answer “why this way?” in standup, and the gap only shows up when the context is gone.
              We unpack the mechanism in{" "}
              <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                does using AI make you a worse programmer?
              </a>{" "}
              — the short version: passive use decays skills while output looks fine.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Six patterns that keep juniors growing with AI</h2>
            <ol className="mt-6 space-y-5">
              {SAFE_PATTERNS.map((c) => (
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
            <h2 className="text-2xl font-semibold tracking-tight text-primary">A week in the life</h2>
            <p className="mt-4">
              Monday: new ticket. You write the three-step decomposition yourself before prompting anything, then
              ask the assistant to critique the plan — not write the code. Tuesday: implementation. Boilerplate
              (config, scaffolding, imports) delegated; the core function written by hand from your plan. Wednesday:
              the AI drafts a module you find confusing; you rewrite its key parts yourself and note the gaps.
              Thursday: bug. You read the trace, form one hypothesis, test it, then bring the assistant in with your
              findings. Friday: ten minutes reviewing your week’s weak spots — the topics that came up in reviews or
              quizzes — and that list sets next week’s study. None of this is slower in any way that matters;
              all of it keeps the understanding yours. For the mechanics of making review stick, see{" "}
              <a href="/learn/how-to-review-ai-generated-code" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                how to review AI-generated code before you merge it
              </a>.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Make the understanding check automatic — with Covate</h2>
            <p className="mt-4 text-secondary">
              Covate was built for exactly this fork in the road. It&rsquo;s a free, open-source MCP tool that
              plugs into your AI coding assistant (Claude, Cursor, Copilot and others), watches what actually
              changes in your codebase, and turns your real diffs into short, targeted quizzes — blocking further
              generation until you answer — so the explain-before-merge step can&rsquo;t be skipped on a busy day.
              Sessions sync into the free{" "}
              <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
                learning ledger
              </a>{" "}
              on covate.org: sign in with GitHub and see every synced session, your running accuracy, and the
              topics you answer worst — your actual study queue. Nothing to buy.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <SignInCta />
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary">
                <span lang={locale}>{t("getMcp")}</span>
              </a>
            </div>
            <p lang={locale} className="mt-4 font-mono text-[11px] text-dim">{t("finePrint")}</p>
          </section>

          {/* Shared evidence layer: sourced research, the verification comparison,
              the tool's own checkable numbers, and the source list. Kept in one
              module (app/_geo/Evidence.tsx) so the figures cannot drift apart
              across the 20 pages that quote them. */}
          <Evidence />

          {/* FAQ */}
          <section>
            <h2 lang={locale} className="text-2xl font-semibold tracking-tight text-primary">{t("faq")}</h2>
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
            <p lang={locale} className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">{t("related")}</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href="/learn/how-to-avoid-over-relying-on-ai-when-coding" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to avoid over-relying on AI when coding →
              </a>
              <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to actually learn from AI-generated code (without skill decay) →
              </a>
            </div>
          </section>
        </article>

        <ArticleBackLink />
      </main>
    </div>
  );
}
