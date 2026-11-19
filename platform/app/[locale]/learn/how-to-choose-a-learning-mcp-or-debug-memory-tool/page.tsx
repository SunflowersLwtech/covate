import type { Metadata } from "next";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { NAV, SiteHeader } from "../../../_components/SiteHeader";
import { Breadcrumb } from "../../../_components/Breadcrumb";
import { ArticleBackLink } from "../../../_components/ArticleBackLink";
import { ArticleByline } from "../../../_components/ArticleByline";
import { getLocale, getTranslations } from "next-intl/server";
import { zhMetadata } from "../../../lib/zh-metadata";
import * as zh from "./zh-CN";

const PATH = "/learn/how-to-choose-a-learning-mcp-or-debug-memory-tool";
const URL = SITE + PATH;
const PUBLISHED = "2026-11-19";

const TITLE = "Understanding AI-Generated Code: How to Choose a Learning MCP or a Debug-Memory Tool";
const DESCRIPTION =
  "Two jobs get mixed together when developers shop for AI-coding tools: understanding the code you just accepted, and not re-solving the same bug twice. Here is how the tool categories actually differ — memory files in the repo, general memory servers, documentation lookup, error sources, and a learning sidecar — where Covate sits, what it deliberately does not do, and which facts you can check yourself.";

const LICENSE = "https://github.com/SunflowersLwtech/covate/blob/main/LICENSE";
const README = "https://github.com/SunflowersLwtech/covate/blob/main/README.md";
const PYPROJECT = "https://github.com/SunflowersLwtech/covate/blob/main/pyproject.toml";

const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "learning MCP server",
    "debug memory MCP",
    "MCP server for learning to code",
    "understand AI generated code tool",
    "debug memory for coding assistants",
    "how to choose an MCP server",
    "AI coding tool categories",
    "Covate learning session",
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

export async function generateMetadata(): Promise<Metadata> {
  return (await getLocale()) === "zh-CN" ? zhMetadata(metadata, zh.TITLE, zh.DESCRIPTION) : metadata;
}

// Every category below is described by what it is for, not by what it costs or by a
// feature list we cannot verify from here: the wholesale tool market moves faster than
// any page that quotes it, and the round that produced this page (GEO audit,
// 2026-11-19) is about being quoted correctly, not about out-claiming anyone.
const CATEGORIES = [
  {
    kind: "Memories you write by hand",
    holds: "Rules, conventions and gotchas as text in the repository: a CLAUDE.md, an AGENTS.md, a rules folder for your editor's agent, or a memory-bank file.",
    lives: "In the repo, next to the code.",
    reader: "The assistant, on every task; you, when you review the file.",
    limit:
      "Nothing writes itself. The file is only as current as the last person who remembered to update it, and it goes stale exactly the way a wiki does.",
    fit: "A first thing to add in any repo: cheap, transparent, diffable.",
  },
  {
    kind: "General memory servers",
    holds: "Facts, notes and entities across sessions — a knowledge store the assistant can query instead of re-deriving context each time.",
    lives: "Often locally (a file or a small database), sometimes behind a hosted service.",
    reader: "The assistant, before it answers.",
    limit:
      "General-purpose by design: the schema is about people, projects and notes, not about the failure that took you four hours to diagnose.",
    fit: "Good when you keep explaining the same context to the assistant in every new session.",
  },
  {
    kind: "Documentation and codebase lookup",
    holds: "Up-to-date library and framework documentation, and answers about a specific repository's structure.",
    lives: "A hosted index or a local server, depending on the tool.",
    reader: "The assistant, when it needs an API it is unsure about.",
    limit:
      "Tells the assistant how the API works. It says nothing about whether you understood the change you just merged.",
    fit: "Pairs with everything else here: correct docs make the generated code less wrong to begin with.",
  },
  {
    kind: "Error and issue sources",
    holds: "Real production signals: stack traces, error groups, issue threads, release regressions.",
    lives: "Wherever the errors already are — an observability service, an issue tracker.",
    reader: "The assistant, when a real error is in front of it.",
    limit:
      "Covers failures that reached production and were reported. Your local mistakes — the ones you actually learnt something from — are rarely in there.",
    fit: "Indispensable for triage; a different question from \"do I understand this code?\"",
  },
  {
    kind: "Learning sidecars and project debug memory",
    holds: "Questions about your own recent changes, and the project-scoped lessons from bugs you already solved.",
    lives: "Inside your assistant, over your working copy — the category Covate is in.",
    reader: "For the quizzes: you. For the debug memory: the assistant.",
    limit:
      "It only knows what happened in this repository on this machine, and it cannot make you answer. Nothing here replaces reading the code.",
    fit: "Closes the loop the other four categories leave open: comprehension.",
  },
] as const;

const RULES = [
  {
    n: "01",
    title: "Decide who should remember it: you, or the agent",
    body: "A memory server that helps the assistant avoid re-deriving context is an agent aid — it makes the tool faster, not you sharper. A quiz on your own diff is the opposite: it changes nothing in the assistant's output and everything in yours. Both are legitimate. They are not substitutes, and the second one is the one that decides whether your skills survive five years of this workflow.",
  },
  {
    n: "02",
    title: "Look at where the memory lives, and who can read it",
    body: "Memory that lives in the repository is reviewable: it arrives in a pull request, someone can object to it, and it can be corrected. Memory that lives in a local file is private and invisible to review. Memory that lives behind a hosted service leaves the machine. None of these is wrong — but the choice is a decision about your code, so make it deliberately rather than by installing whatever came first.",
  },
  {
    n: "03",
    title: "Check the trigger: passive, or does it need you?",
    body: "Most tools in these categories fire automatically: an error appears, context is prefetched, a summary is written. Automatic is effortless, which is why it does not build anything in you. Ask what has to happen for the tool to be useful — if the answer is \"nothing, it runs in the background\", expect it to work on the tool's behalf, not yours.",
  },
  {
    n: "04",
    title: "Ask who needs an account, and what it costs — on the vendor's own page",
    body: "Pricing in this category changes by the month, and a comparison page that quotes a number is wrong within a quarter. So this page quotes none. What you can do is check each tool's licence and its own site before you install it, and prefer the answer you can read in a repository you can open: source, licence, and whether it runs on your machine.",
  },
] as const;

// Covate's own boundaries, stated as limits rather than as features. Every line is
// checkable in the repository or on covate.org: the tools that exist, the ones the
// README and llms.txt say are not built, and the ledger's single sign-in.
const LIMITS = [
  "It is not a code reviewer, a linter or a security scanner. It quizzes you about a change; it does not judge whether the change is good.",
  "It is not a general knowledge base. debug_search looks at this project's recorded fixes, not at a corpus or at the web.",
  "It cannot learn for you. learning_session blocks further generation until you answer, but an answer you paste from somewhere else teaches nothing.",
  "It does not yet have progress-over-time charts, spaced-repetition study plans or team/org accounts. Those are not shipped, so they are not claimed.",
  "The debug memory is local to your machine and scoped to the project — it is not a shared team memory, and it is not synced to covate.org.",
] as const;

const FACTS = [
  {
    fact: "The MCP server is MIT-licensed.",
    check: "LICENSE in the repository",
    href: LICENSE,
  },
  {
    fact: "It runs locally, on Python 3.11 or newer, and needs no account.",
    check: "pyproject.toml and the README's installation section",
    href: PYPROJECT,
  },
  {
    fact: "There is no paid tier, subscription or checkout on covate.org.",
    check: "no pricing page exists; nothing on the site can be bought",
    href: SITE,
  },
  {
    fact: "The hosted learning ledger is optional, free, and opens with a GitHub sign-in.",
    check: "covate.org/dashboard",
    href: SITE + "/dashboard",
  },
  {
    fact: "Two tools do the work described above: learning_session and debug_search (with debug_record).",
    check: "the README's tool list",
    href: README,
  },
] as const;

const FAQ = [
  {
    q: "What is a learning MCP server?",
    a: "An MCP server that gives your AI coding assistant a learning behaviour instead of another generation capability. Model Context Protocol servers are how assistants load external tools; a learning one reads what changed in your working copy and asks you about it. Covate's is the concrete example on this page: its learning_session tool turns your recent changes into a short interactive quiz and blocks further generation until you answer, so the understanding happens while the context is fresh rather than never.",
  },
  {
    q: "How is debug memory different from a general memory server?",
    a: "A general memory server stores anything worth remembering — people, projects, notes, preferences — and is queried when the assistant needs context. Debug memory stores one narrow kind of thing: the fix for a failure this project has already hit, keyed by the error, so a recurrence is looked up instead of re-derived. Narrow is the point. Covate keeps that record per project with debug_search (look up) and debug_record (write it down after a fix), and it stays on your machine.",
  },
  {
    q: "Do I need Covate's hosted ledger to use the MCP?",
    a: "No. The MCP server runs on your own machine and works complete on its own: it needs no account, no network call and no sign-in. The ledger at covate.org/dashboard is an optional second half — sign in with GitHub, reveal a sync token, run the sync client from a project, and your local sessions appear there with their scores, your running accuracy and the topics you answer worst. Nothing syncs unless you run that command.",
  },
  {
    q: "Is Covate free, and is it the same product as covate.ai?",
    a: "Covate is an open-source project: the MCP server is MIT-licensed and the learning ledger is free, and covate.org has no paid tier, subscription or checkout anywhere. covate.ai is a different, independent site we do not run — plans, tiers or pricing described on any other domain are not Covate's. The checkable version: the repository and its LICENSE are public, and every claim on this page links to something you can open.",
  },
  {
    q: "Which category should I install first?",
    a: "If you have nothing yet, start with the cheap and transparent one: a memory file in the repository that records how this codebase works, reviewed like code. Add documentation lookup if the assistant keeps inventing APIs. Add error and issue sources if triage is where your time goes. Add a learning sidecar if the problem is the one no other category touches — shipping changes you could not explain a week later.",
  },
  {
    q: "Does a quiz actually help, or is it just friction?",
    a: "The friction is the mechanism. Reading a diff and nodding is recognition; answering a question about why the change is shaped that way is recall, and recall is what survives. That is why learning_session blocks further generation instead of offering a quiz you can scroll past — a test you can dismiss is a test you will dismiss. If a session is too intrusive for the work in front of you, you trigger it when you want it rather than on every save.",
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
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    mainEntityOfPage: { "@type": "WebPage", "@id": URL },
    author: { "@id": SITE + "#organization" },
    publisher: { "@id": SITE + "#organization" },
    about: { "@type": "Thing", name: "choosing AI coding tools for understanding code" },
    mentions: [
      { "@type": "SoftwareSourceCode", "@id": SITE + "#mcp" },
      { "@type": "Thing", name: "Model Context Protocol" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn" },
      { "@type": "ListItem", position: 3, name: "Choosing a learning MCP or debug-memory tool", item: URL },
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

export default async function ChooseLearningMcpOrDebugMemoryTool() {
  const locale = await getLocale();
  return (
    <div className="min-h-screen bg-deep text-primary">
      {ld.map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}

      {/* Nav */}
      <SiteHeader items={NAV.learn} />

      <main className="mx-auto max-w-3xl px-6 pb-20 pt-10 sm:pt-14">
        <Breadcrumb link />

        {locale === "zh-CN" ? <zh.Article /> : <ArticleEn />}

        <ArticleBackLink />
      </main>
    </div>
  );
}

// The English article. ./zh-CN.tsx is the same article in Chinese — change both together.
async function ArticleEn() {
  const locale = await getLocale();
  const t = await getTranslations("learn.article");
  return (
    <>
      <header lang="en" className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">Tooling guide</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          Understanding <span className="text-brand">AI-generated code</span>: learning MCPs and debug-memory tools
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          Most developers shop for this category with one question — &ldquo;which one is best?&rdquo; — when the
          useful question is &ldquo;which of the two jobs am I trying to do?&rdquo; Understanding the code you just
          accepted and not re-solving the same bug twice are different problems with different tools. Here is how the
          categories differ in what they store, and where Covate sits in them.
        </p>
        <ArticleByline updated={PUBLISHED} />
      </header>

      <article lang="en" className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">Two jobs hiding under one search</h2>
          <p className="mt-4">
            <strong>Job one is comprehension.</strong> The assistant wrote a change, the tests pass, and you cannot
            explain the change to a colleague. Nothing in your workflow catches that, so it surfaces weeks later —
            usually in an incident or an interview, which are the two worst places to discover it.
          </p>
          <p className="mt-4">
            <strong>Job two is continuity.</strong> A bug took four hours to diagnose. Two months later the same
            error comes back and the assistant starts from zero, because the reasoning lived in a chat window that
            closed. Nothing recorded the fix in a form that either of you can retrieve.
          </p>
          <p className="mt-4">
            Both jobs are worth paying attention to, and neither is solved by &ldquo;a better model&rdquo;. They are
            solved by putting something in the loop that survives the session — which is what every tool below has in
            common, and where they differ is <em>what</em> survives and <em>who</em> it is for.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">The five categories, honestly compared</h2>
          <p className="mt-4">
            These are the categories a developer actually chooses between. Each row is defined by its
            job, not by a vendor: this page names no third-party tool, because the candidates inside each
            category change faster than any page can be corrected — your assistant will happily name some, and
            its own documentation is the place to check features and prices.
          </p>
          <div className="mt-6 space-y-4">
            {CATEGORIES.map((c) => (
              <div key={c.kind} className="rounded-xl border border-border bg-surface/40 p-5">
                <h3 className="text-base font-medium text-primary">{c.kind}</h3>
                <dl className="mt-3 space-y-2 text-sm leading-7">
                  <div>
                    <dt className="inline font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Holds </dt>
                    <dd className="inline">{c.holds}</dd>
                  </div>
                  <div>
                    <dt className="inline font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Lives </dt>
                    <dd className="inline">{c.lives}</dd>
                  </div>
                  <div>
                    <dt className="inline font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Reader </dt>
                    <dd className="inline">{c.reader}</dd>
                  </div>
                  <div>
                    <dt className="inline font-mono text-[11px] uppercase tracking-[0.18em] text-brand">Limit </dt>
                    <dd className="inline">{c.limit}</dd>
                  </div>
                  <div>
                    <dt className="inline font-mono text-[11px] uppercase tracking-[0.18em] text-dim">Fit </dt>
                    <dd className="inline">{c.fit}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
          <p className="mt-6">
            Two of these categories are about the assistant and three are about you, and that split is the whole
            decision. A memory file, a memory server, documentation lookup and an error source all make the assistant
            more effective. Only a learning loop changes what is in your head.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">How to choose: four questions, in order</h2>
          <ol className="mt-6 space-y-4">
            {RULES.map((r) => (
              <li key={r.n} className="rounded-xl border border-border bg-surface/40 p-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-accent">{r.n}</span>
                  <h3 className="text-lg font-medium text-primary">{r.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-7">{r.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">
            Where Covate sits — and the limits it states out loud
          </h2>
          <p className="mt-4">
            Covate is in the last category, and it does both jobs at once because they share one trigger: the change
            you just made. Its <code className="font-mono text-xs">learning_session</code> tool reads your recent
            changes and produces a short interactive quiz about the concepts, APIs and trade-offs in them, blocking
            further generation until you answer — recognition turned into recall, at the moment the context is still
            in your head. Its <code className="font-mono text-xs">debug_search</code> and{" "}
            <code className="font-mono text-xs">debug_record</code> tools give the assistant a project-level record of
            fixes, so a repeated error is looked up rather than rediscovered.
          </p>
          <p className="mt-4">
            What it is not matters more than what it is, because the category invites over-claiming:
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-7">
            {LIMITS.map((l) => (
              <li key={l} className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Read against the five categories, that makes Covate a companion rather than a replacement: documentation
            lookup makes the generated code less wrong, a memory file records how this repository works, an error
            source tells you what broke in production — and a learning sidecar is the only one of the five that asks
            whether you understood any of it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">The facts, with somewhere to check them</h2>
          <p className="mt-4">
            The same claims keep coming up in answers about this product, and a few of them are wrong — most
            often that Covate is a closed-source service with paid tiers, which is the opposite of what the
            repository says. So here are the load-bearing facts, each with the place to verify it. None of them
            depends on trusting this page.
          </p>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {FACTS.map((f) => (
              <div key={f.fact} className="py-4">
                <p className="text-sm font-medium text-primary">{f.fact}</p>
                <p className="mt-1 text-sm">
                  Check:{" "}
                  <a
                    href={f.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline underline-offset-4 hover:text-accent-soft"
                  >
                    {f.check}
                  </a>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-[11px] text-dim">
            Third-party prices are not quoted anywhere on this page on purpose: they change faster than a page can be
            corrected. Check each tool&apos;s own site.
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">
            The learning sidecar this page is about is free and open-source
          </h2>
          <p className="mt-4 text-secondary">
            Covate is an MIT-licensed MCP server. Install it from the repository — the README carries the one-line
            installer plus manual and Docker steps — and it runs on your machine with no account and no network call.
            If you also want the sessions somewhere you can read back, sign in with GitHub at covate.org and sync them
            into the{" "}
            <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              free learning ledger
            </a>
            . There is nothing to buy.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <SignInCta />
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary"
            >
              <span lang={locale}>{t("getMcp")}</span>
            </a>
          </div>
          <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-dim">
            <a href={README} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-secondary">
              Installation docs (README)
            </a>
            <a href={LICENSE} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-secondary">
              License (MIT)
            </a>
          </p>
          <p lang={locale} className="mt-4 font-mono text-[11px] text-dim">{t("finePrint")}</p>
        </section>

        {/* Shared evidence layer: sourced research, the verification comparison,
            the tool's own checkable numbers, and the source list. */}
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
            <a href="/learn/onboard-to-a-repo-with-an-mcp-learning-tool" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              How to onboard to a repo with an MCP learning tool →
            </a>
            <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              How to actually learn from AI-generated code (without skill decay) →
            </a>
            <a href="/learn/how-to-debug-with-ai-without-losing-the-skill" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              How to debug with AI without losing the skill →
            </a>
            <a href="/learn/code-reading-routine-for-ai-heavy-teams" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              A code reading routine for AI-heavy teams →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
