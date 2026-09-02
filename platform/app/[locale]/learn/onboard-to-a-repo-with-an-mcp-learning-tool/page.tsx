import type { Metadata } from "next";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { NAV, SiteHeader } from "../../../_components/SiteHeader";
import { Breadcrumb } from "../../../_components/Breadcrumb";
import { ArticleBackLink } from "../../../_components/ArticleBackLink";
import { ArticleByline } from "../../../_components/ArticleByline";
import { getLocale, getTranslations } from "next-intl/server";

const PATH = "/learn/onboard-to-a-repo-with-an-mcp-learning-tool";
const URL = SITE + PATH;

const TITLE = "How to Onboard to a Repo With an MCP Learning Tool";
const DESCRIPTION =
  "Onboarding to a new repository while an AI does most of the writing is dangerous unless understanding is being measured. How to combine the standard onboarding method with an MCP learning sidecar that quizzes you on your own changes — and an honest list of what it does not do.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "onboard to a repo with MCP",
    "MCP learning tool",
    "Model Context Protocol coding",
    "learn a codebase with AI",
    "onboarding developer tools",
  ],
  alternates: { canonical: PATH },
  openGraph: { type: "article", siteName: "Covate", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const STEPS = [
  {
    n: "01",
    title: "Do the standard onboarding first — the tool rides along, not instead",
    body: "Map the structure, run it locally, trace one request end to end, read the tests, use the git history: the method in our guide to learning a new codebase fast still applies in full. An MCP learning tool doesn't replace any of it — it measures whether the understanding is actually sticking while you work, which is the part onboarding normally leaves to hope.",
  },
  {
    n: "02",
    title: "Install the MCP server into your AI coding assistant",
    body: "MCP — Model Context Protocol — is the standard these assistants use to load external tools. Covate's server is MIT-licensed open source, runs locally, and needs no account: once it's plugged into Claude, Cursor, Copilot or another MCP-capable assistant, the assistant gains a learning_session tool alongside its normal ones.",
  },
  {
    n: "03",
    title: "Work on the repo the way you normally would",
    body: "No dedicated study mode: you take real tasks, ask the assistant real questions, make real changes. As you do, the learning sidecar watches what actually changed in the codebase — your diffs, not hypothetical exercises — and generates short, targeted quizzes about the concepts, APIs and edge cases in them, blocking further generation until you answer. Onboarding practice made of the work itself.",
  },
  {
    n: "04",
    title: "Use the quiz results as your onboarding map",
    body: "Every wrong answer is a precise signal about where your picture of the repo is thin — and 'thin' discovered in week one is a reading list, while the same gap discovered in an incident is a cost. Sync sessions to the ledger (next step) and the topics you keep missing become a ranked queue that directs the next day's reading.",
  },
  {
    n: "05",
    title: "Keep project-level debug memory as you go",
    body: "The sidecar's second tool, debug_search, keeps project-scoped memory of past debugging — so when the same weird behavior resurfaces in week three, the lesson from week one is retrievable instead of re-learned. On a codebase you didn't write, this is the closest thing to the thing seniors actually have: scars, organized.",
  },
  {
    n: "06",
    title: "Sync the ledger and watch the trend",
    body: "Sign in with GitHub at covate.org/dashboard, reveal your sync token, and run COVATE_SYNC_URL=https://covate.org COVATE_SYNC_TOKEN=<token> python -m covate.platform_sync from the project. The ledger shows each synced session with its score, your running accuracy, and the topics you answer worst — onboarding progress as a curve instead of a feeling.",
  },
] as const;

const FAQ = [
  {
    q: "What is an MCP learning tool?",
    a: "An MCP (Model Context Protocol) server that plugs into your AI coding assistant and adds learning mechanics to it. Covate's is the concrete example: a free, open-source server that runs locally, exposes a learning_session tool which generates blocking, interactive quizzes from your recent code changes, and a debug_search tool for project-level debug memory. The assistant you already use gains a tutor that quizzes you on your own diffs.",
  },
  {
    q: "How does an MCP tool help with onboarding to a new repo?",
    a: "Onboarding fails quietly: you ship changes without building a durable mental model, and nothing measures the difference. An MCP learning sidecar measures it — every change you make becomes quiz material, so gaps in your understanding of the repo surface in week one as wrong answers instead of in month three as incidents. It doesn't replace the standard method (run it, trace a request, read tests); it adds the feedback loop that method has always lacked.",
  },
  {
    q: "Do I need an account to use it?",
    a: "No — the MCP server runs locally with no account required, and works fully offline of any identity. The cloud learning ledger on covate.org is optional on top: sign in with GitHub (device flow), reveal a sync token in the dashboard, and push sessions up with python -m covate.platform_sync to track accuracy and weak topics across projects and time.",
  },
  {
    q: "What does it not do? ",
    a: "It doesn't generate documentation, answer questions about architecture you haven't touched, or replace reading the code — the quizzes come from your own changes, so untouched corners of the repo stay untouched. There's no editor, no AI code generation of its own, and no team dashboards or progress charts — those don't exist yet, and we won't describe them as if they did. It measures and reinforces understanding; the understanding itself is still your job.",
  },
  {
    q: "Does it cost anything?",
    a: "No. The MCP server is MIT-licensed open source; the learning ledger on covate.org is free — sign in with GitHub, nothing to buy. There is no paid tier, subscription or checkout anywhere on the site.",
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
    about: { "@type": "Thing", name: "onboarding to a repository with an MCP learning tool" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn" },
      { "@type": "ListItem", position: 3, name: "Onboard with an MCP tool", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default async function OnboardWithMcp() {
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
            How to onboard to a repo with an MCP learning tool
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            Onboarding while an AI does most of the writing is dangerous unless something is measuring whether
            understanding is actually forming. Here&rsquo;s how to pair the standard onboarding method with an MCP
            learning sidecar that quizzes you on your own changes — and an honest list of what it does not do.
          </p>
          <ArticleByline updated="2026-08-16" />
        </header>

        <article lang="en" className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <p>
              The classic onboarding problem has a new edge. Joining a repo used to force understanding on you
              gradually — to change anything, you had to read a lot first. With an AI assistant, you can ship
              competent-looking changes in a codebase you barely understand, which means onboarding can now
              <em> silently fail</em>: output looks fine, and the mental model never forms. The fix isn&rsquo;t less
              AI — it&rsquo;s a feedback loop that notices the gap while it&rsquo;s cheap. That&rsquo;s what an MCP
              learning sidecar is for.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The method, step by step</h2>
            <ol className="mt-6 space-y-5">
              {STEPS.map((c) => (
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
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Where this fits with the rest</h2>
            <p className="mt-4">
              The base method — map, run, trace, tests, history — is covered in{" "}
              <a href="/learn/how-to-learn-a-new-codebase-fast" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                how to learn a new codebase fast
              </a>. The sidecar adds measurement on top of it. If you want the memory science behind why
              quiz-on-your-own-diffs works, see{" "}
              <a href="/learn/spaced-repetition-for-developers" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                spaced repetition for developers
              </a>; if you want the ledger concept that the sync produces, see{" "}
              <a href="/learn/keep-a-learning-ledger-from-your-commits" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                how to keep a learning ledger from your commits
              </a>. Together they turn onboarding from a leap into a curve.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Covate is that MCP learning sidecar</h2>
            <p className="mt-4 text-secondary">
              Free and open source (MIT), running locally with no account: plug it into Claude, Cursor, Copilot or
              another MCP-capable assistant, and its <code className="font-mono text-xs">learning_session</code>{" "}
              tool turns your real code changes into blocking quizzes while{" "}
              <code className="font-mono text-xs">debug_search</code> keeps project-level debug memory. Sign in with
              GitHub and sync sessions into the free{" "}
              <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
                learning ledger
              </a>{" "}
              on covate.org to watch your accuracy and weakest topics trend across the first weeks in the repo.
              Nothing to buy.
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
              <a href="/learn/how-to-learn-a-new-codebase-fast" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to learn a new codebase fast →
              </a>
              <a href="/learn/keep-a-learning-ledger-from-your-commits" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to keep a learning ledger from your commits →
              </a>
            </div>
          </section>
        </article>

        <ArticleBackLink />
      </main>
    </div>
  );
}
