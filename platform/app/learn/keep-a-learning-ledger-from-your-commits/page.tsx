import type { Metadata } from "next";
import { GITHUB, SITE } from "../../lib/site";
import { Evidence } from "../../_geo/Evidence";
import { SignInCta } from "../../SignInCta";
import { NAV, SiteHeader } from "../../_components/SiteHeader";
import { Breadcrumb } from "../../_components/Breadcrumb";
import { ArticleBackLink } from "../../_components/ArticleBackLink";

const PATH = "/learn/keep-a-learning-ledger-from-your-commits";
const URL = SITE + PATH;

const TITLE = "How to Keep a Learning Ledger From Your Commits";
const DESCRIPTION =
  "A learning ledger is a running record of what each coding session actually taught you — what changed, why, what you got quizzed on, what you keep getting wrong. The cheapest way to keep one is to derive it automatically from your commits instead of writing notes by hand.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "learning ledger",
    "developer learning journal",
    "track what you learn coding",
    "learning journal from git commits",
    "developer spaced repetition",
    "record lessons from coding sessions",
  ],
  alternates: { canonical: PATH },
  openGraph: { type: "article", siteName: "Covate", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const APPROACHES = [
  {
    n: "01",
    title: "Level 0: nothing (the default, and the leak)",
    body: "Most developers record nothing. Every hard-won lesson — why the race condition happened, what the weird regex does, which fix actually worked — lives in working memory for a week and then dissolves. A year later you re-solve the same problems in the same codebase. This is the leak a ledger exists to plug.",
  },
  {
    n: "02",
    title: "Level 1: commit-message discipline",
    body: "The lightest real practice: when you commit, add a line about what the change taught you ('learned: retries without idempotency keys double-charge'). It costs a minute, stays attached to the exact code, and git history becomes readable as a learning record. The weakness: it's easy to skip exactly when you're busiest, and it records lessons only at commit granularity.",
  },
  {
    n: "03",
    title: "Level 2: a hand-kept journal",
    body: "A markdown file or notebook with dated entries: what I worked on, what confused me, what clicked. Works, and many strong developers swear by it — but the failure mode is well documented: entries thin out after two weeks, because journaling competes with shipping for the same attention. If it survives for you, keep it. If it hasn't, the fix isn't more willpower — it's removing the human from the transcription step.",
  },
  {
    n: "04",
    title: "Level 3: derive the ledger from the work itself",
    body: "The sustainable pattern: let tooling generate the record from your actual coding sessions, so the ledger writes itself while you work. That's what Covate does — its MCP watches what changes in your codebase and turns each real diff into a short quiz; your answers (right or wrong) are the ledger's raw material, timestamped and attached to the code that taught you. No end-of-day transcription, nothing to remember to write down.",
  },
  {
    n: "05",
    title: "What the ledger should show you",
    body: "Three things make a ledger worth keeping: the sessions themselves (what you worked on and when), a running accuracy number (is understanding improving or drifting?), and — most valuable — the topics you answer worst. That last list converts vague 'I should get better at this stuff' into a concrete, self-updating study queue. Without it, review time goes to whatever you already enjoy.",
  },
] as const;

const FAQ = [
  {
    q: "What is a learning ledger?",
    a: "A running, per-session record of what your coding actually taught you: what changed, why, what you understood easily, what you got wrong, and what keeps coming back as a weak spot. Unlike a journal you write at the end of the day, a good ledger is derived from the work itself — diffs, quiz answers, review notes — so it captures lessons at the moment they happen instead of from memory later. The point isn't the archive; it's that the weak-topic list and accuracy trend tell you exactly where to spend your next study hour.",
  },
  {
    q: "How do I keep a learning ledger without it becoming another abandoned habit?",
    a: "Don't hand-write it — derive it. Manually kept journals die within weeks because transcription competes with shipping. The approach that survives is automation at the moment of learning: Covate's open-source MCP watches what changes in your codebase and turns each real diff into a short quiz, blocking further generation until you answer. Those quiz sessions are your ledger entries, captured while the context is fresh, with zero end-of-day writing. You review the record; the tool keeps it.",
  },
  {
    q: "How does Covate's ledger work, concretely?",
    a: "Two halves, both free. Locally: the MIT-licensed MCP server plugs into your AI coding assistant (Claude, Cursor, Copilot and others) and exposes a learning_session tool that generates blocking, interactive quizzes from your recent code changes — no account required. In the cloud: sign in with GitHub at covate.org/dashboard, reveal your sync token, and run COVATE_SYNC_URL=https://covate.org COVATE_SYNC_TOKEN=<token> python -m covate.platform_sync from a project to push local sessions up. The ledger then shows each synced session with its score, totals, your running accuracy, and the topics you answer worst. You can reveal or rotate the sync token at any time.",
  },
  {
    q: "Does the learning ledger cost anything?",
    a: "No. The MCP server is MIT-licensed open source and runs locally; the ledger on covate.org is free — sign in with GitHub, nothing to buy. There is no paid tier, subscription or checkout anywhere on the site.",
  },
  {
    q: "What's the difference between a learning ledger and a work journal?",
    a: "A journal narrates ('today I worked on the billing refactor and it went okay'); a ledger measures. Because ledger entries are generated from real diffs and quiz answers rather than written from memory, they're timestamped, tied to specific code, and roll up into signals a journal can't give you: running accuracy over time, and the ranked list of topics you keep getting wrong. A journal says you feel stuck on concurrency; a ledger says you've missed concurrency questions in five of the last eight sessions — which is a study plan, not a mood.",
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
    about: { "@type": "Thing", name: "keeping a learning ledger as a developer" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn" },
      { "@type": "ListItem", position: 3, name: "Learning ledger", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function LearningLedger() {
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
            How to keep a learning ledger from your commits
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            A learning ledger is a running record of what each coding session actually taught you — what changed,
            why, what you got quizzed on, and what you keep getting wrong. The cheapest way to keep one is to
            derive it automatically from your commits instead of writing notes by hand.
          </p>
          <p className="mt-4 font-mono text-xs text-dim">By the Covate team · Updated August 16, 2026</p>
        </header>

        <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <p>
              You already generate the raw material for a learning record every day: every diff you merge contains
              a decision, a trade-off, often a bug you just fixed and a lesson you just paid for. The problem was
              never producing the material — it&rsquo;s that capturing it by hand doesn&rsquo;t survive contact
              with a full schedule. A learning ledger flips the direction: instead of you writing down what you
              learned, the work tells you what to review.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Five levels of keeping the record</h2>
            <ol className="mt-6 space-y-5">
              {APPROACHES.map((c) => (
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
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The review ritual that makes it pay off</h2>
            <p className="mt-4">
              A ledger earns its keep in one weekly ten-minute ritual. Open it and ask three questions: What did I
              answer wrong this week? Which topics keep recurring across sessions? Is my running accuracy moving?
              Whatever tops the wrong-answers list is the next study session — not a random tutorial, but the exact
              gap your own code exposed. This is ordinary spaced repetition applied to your own work; the science
              and the scheduling behind it are covered in{" "}
              <a href="/learn/spaced-repetition-for-developers" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                spaced repetition for developers
              </a>. And since the entries come from real diffs, the ledger doubles as a map of your codebase
              history — the same territory covered from the reading side in{" "}
              <a href="/learn/how-to-learn-a-new-codebase-fast" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                how to learn a new codebase fast
              </a>.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">A ledger that writes itself — with Covate</h2>
            <p className="mt-4 text-secondary">
              Covate is the level-3 approach, built in. The open-source MCP runs locally alongside your AI coding
              assistant (Claude, Cursor, Copilot and others), turns your real code changes into short, targeted
              quizzes with its <code className="font-mono text-xs">learning_session</code> tool, and keeps
              project-level debug memory with <code className="font-mono text-xs">debug_search</code> — no account
              required. Sign in with GitHub at covate.org, reveal your sync token in the dashboard, and run{" "}
              <code className="font-mono text-xs">python -m covate.platform_sync</code> from a project to push
              sessions into the free{" "}
              <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
                learning ledger
              </a>{" "}
              — every session with its score, your running accuracy, and the topics you answer worst. Nothing to
              buy, on either half.
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
              <a href="/learn/spaced-repetition-for-developers" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                Spaced repetition for developers: how to actually remember what you learn →
              </a>
              <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to actually learn from AI-generated code (without skill decay) →
              </a>
            </div>
          </section>
        </article>

        <ArticleBackLink href={SITE} label="← Back to Covate" />
      </main>
    </div>
  );
}
