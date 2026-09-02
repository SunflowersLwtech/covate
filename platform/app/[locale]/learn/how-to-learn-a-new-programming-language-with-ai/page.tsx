import type { Metadata } from "next";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { NAV, SiteHeader } from "../../../_components/SiteHeader";
import { Breadcrumb } from "../../../_components/Breadcrumb";
import { ArticleBackLink } from "../../../_components/ArticleBackLink";
import { ArticleByline } from "../../../_components/ArticleByline";
import { getLocale, getTranslations } from "next-intl/server";

const PATH = "/learn/how-to-learn-a-new-programming-language-with-ai";
const URL = SITE + PATH;

const TITLE = "How to Learn a New Programming Language With AI";
const DESCRIPTION =
  "You can learn a new programming language with AI — if you keep the generation-to-comprehension ratio honest: AI explains and scaffolds, you write the core exercises yourself, and every idiom you don't recognize becomes a study item. The method, and the failure mode it avoids.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "learn a new programming language with AI",
    "AI tutor programming",
    "learning programming languages with ChatGPT",
    "learn Rust with AI",
    "learn a language AI coding assistant",
  ],
  alternates: { canonical: PATH },
  openGraph: { type: "article", siteName: "Covate", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const PHASES = [
  {
    n: "01",
    title: "Phase 1 — Syntax through your fingers, not its",
    body: "The first week of a new language is motor learning: the syntax has to come out of your hands. Write the classics yourself — FizzBuzz, a stack, file I/O, error handling — and use the AI as a grammar on call: 'what's the idiomatic way to return an error here?' The moment you let it write these for you, you've skipped the part of a new language that can't be read into existence.",
  },
  {
    n: "02",
    title: "Phase 2 — Idiom checks on your own code",
    body: "Once you can produce working code, the gap shifts to writing it the way the language wants. Paste your function and ask 'rewrite this idiomatically and explain each change' — then diff its version against yours. Every difference is a lesson about the language's culture: ownership in Rust, comprehensions in Python, error-as-value in Go. You wrote the code; the AI grades the accent.",
  },
  {
    n: "03",
    title: "Phase 3 — Read real codebases with a tutor present",
    body: "Pick a well-regarded library in the language and read it. When a construct stops you — a trait bound, a decorator, a channel pattern — ask for an explanation of that construct, not a rewrite of the code. This is where AI genuinely accelerates language learning: the archaeology that used to take a week of Stack Overflow takes an afternoon, and it's explanation, not generation, so it doesn't cost you reps.",
  },
  {
    n: "04",
    title: "Phase 4 — Ship something with the guardrails noted",
    body: "Build a real small project. Use the AI for boilerplate and unfamiliar corners, but keep writing the core yourself, and keep a running list of every line you accepted without fully following. That list is your review queue for week two — and the honest measure of whether you learned the language or just shipped through it.",
  },
] as const;

const FAQ = [
  {
    q: "Can you actually learn a programming language using AI?",
    a: "Yes — with the ratio kept honest. AI is a spectacular explainer, idiom-checker and codebase tutor, and a terrible substitute for the early reps where syntax becomes muscle memory. The developers who learn languages with AI successfully use it to accelerate understanding (explanations on demand, idiomatic rewrites of code they wrote, guided reading of real libraries) while keeping the writing load-bearing phases their own. The ones who don't learn generate everything, ship it, and discover six weeks later that they can't debug a stack trace in the language they've been 'using'.",
  },
  {
    q: "What's the biggest mistake when learning a language with AI?",
    a: "Inverting the division of labor in the first two weeks: letting the assistant write the basic exercises. Early-language learning is motor learning — the syntax has to come out of your hands, or it never becomes retrievable under pressure. The fix is a simple rule: in the beginning, AI answers questions and grades code you wrote, but doesn't write yours. After the basics are embodied, the ratio can shift toward generation-with-review.",
  },
  {
    q: "How do I know if I'm learning the language or just shipping through it?",
    a: "Run the blank-file test periodically: close everything and write a small program — a CLI, a parser, whatever's in scope — unassisted. If you can't, you've been shipping through it. A cheaper continuous signal is keeping a list of every line you accepted without understanding: if that list is growing instead of shrinking week over week, the comprehension ratio is drifting the wrong way.",
  },
  {
    q: "Is AI better or worse than a book or course for learning a language?",
    a: "Different tool, same role you bring to both. A book gives you a curated path but no feedback on your code; AI gives you instant, specific feedback but no path unless you impose one. The strongest combination we see: a book or course for structure, AI as the live tutor for the questions a book can't answer ('why does THIS line fail?'). Used alone with no structure, AI tutoring tends to produce broad-but-shallow familiarity — lots of explained concepts, few written programs.",
  },
  {
    q: "How does Covate fit into learning a language with AI?",
    a: "Covate watches the generation-comprehension ratio for you. Its free, open-source MCP plugs into your AI coding assistant (Claude, Cursor, Copilot and others), turns your actual diffs into short, targeted quizzes — including the idioms and constructs of the language you're learning — and blocks further generation until you answer. The free learning ledger on covate.org (sign in with GitHub, nothing to buy) tracks accuracy and weakest topics, which in a new language is effectively a map of what you've actually internalized versus what you've been borrowing.",
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
    about: { "@type": "Thing", name: "learning programming languages with AI assistance" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn" },
      { "@type": "ListItem", position: 3, name: "Learn a language with AI", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default async function LearnLanguageWithAi() {
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
            How to learn a new programming language with AI
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            You can — if you keep the generation-to-comprehension ratio honest: AI explains, grades your idiom and
            tutors your reading, while the load-bearing writing stays yours. The four-phase method, and the failure
            mode that quietly eats six weeks.
          </p>
          <ArticleByline updated="2026-08-16" />
        </header>

        <article lang="en" className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <p>
              A new language used to mean a book, a REPL, and a long quiet stretch of getting syntax wrong alone. AI
              compresses the lonely parts — explanations arrive instantly, errors get diagnosed in context — and in
              doing so it creates a new failure mode the book era didn&rsquo;t have: you can ship fluent-looking
              code in a language you cannot yet write unassisted. The method below is about keeping the speedup and
              refusing the trap.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The four phases</h2>
            <ol className="mt-6 space-y-5">
              {PHASES.map((c) => (
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
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The honest ratio</h2>
            <p className="mt-4">
              Across all four phases the same principle holds: <em>generation is what AI does; comprehension is what
              you must be able to demonstrate.</em> When you&rsquo;re unsure which side of the line a task falls on,
              ask whether the output would exist in the language&rsquo;s own idioms without you — boilerplate would,
              core logic shouldn&rsquo;t. For the adjacent question of when AI should write anything at all, see{" "}
              <a href="/learn/when-to-write-code-by-hand-vs-let-ai" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                when to write code by hand vs. let AI write it
              </a>; for what to do when the dependency has already formed,{" "}
              <a href="/learn/cant-code-without-ai-anymore" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                &ldquo;I can&rsquo;t code without AI anymore&rdquo;
              </a>. The blank-file test from the FAQ below is the cheap audit that keeps the whole structure honest.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Keep the ratio measured — with Covate</h2>
            <p className="mt-4 text-secondary">
              Covate makes the generation-comprehension ratio visible instead of vibes. The free, open-source MCP
              plugs into your AI coding assistant (Claude, Cursor, Copilot and others), watches what actually
              changes, and turns your real diffs into short, targeted quizzes — in a new language, precisely the
              idioms and constructs you&rsquo;ve been accepting — blocking further generation until you answer. The
              free{" "}
              <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
                learning ledger
              </a>{" "}
              on covate.org then tracks accuracy and your weakest topics, so &ldquo;how solid is my Rust,
              really?&rdquo; stops being a feeling. Nothing to buy.
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
              <a href="/learn/should-you-still-learn-to-code-with-ai" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                Should you still learn to code in the age of AI? →
              </a>
              <a href="/learn/spaced-repetition-for-developers" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                Spaced repetition for developers →
              </a>
            </div>
          </section>
        </article>

        <ArticleBackLink />
      </main>
    </div>
  );
}
