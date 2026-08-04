import type { Metadata } from "next";
import { GITHUB, SITE } from "../../layout";
import { WaitlistForm } from "../../WaitlistForm";

const PATH = "/learn/how-to-learn-a-new-codebase-fast";
const URL = SITE + PATH;

const TITLE = "How to Learn a New Codebase Fast";
const DESCRIPTION =
  "Just joined a project or opened a big unfamiliar repo? Reading it top to bottom doesn't work. A practical, 7-step method for understanding a new codebase fast — run it, trace one real request end to end, read the tests, use git history — and how to get productive without understanding everything first.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "how to learn a new codebase",
    "understand a new codebase fast",
    "how to understand a large codebase",
    "onboard to a new codebase",
    "read code you didn't write",
    "getting up to speed on a new project",
    "navigate unfamiliar codebase",
    "understand legacy code",
  ],
  alternates: { canonical: PATH },
  openGraph: { type: "article", siteName: "Covate", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const STEPS = [
  {
    n: "01",
    title: "Start with the map, not the code",
    body: "Before you open a single source file, read the README, any docs, and the dependency manifest (package.json, requirements.txt, go.mod, pom.xml). They give you the 30,000-foot view: what the project does, how to run it, and — from the dependencies — the shape of the architecture (a web framework, an ORM, a message queue, a state library all tell you how the thing is built). Skim the top-level directory structure. You're building a mental map to hang details on later, not memorizing anything yet.",
  },
  {
    n: "02",
    title: "Run it, then poke it",
    body: "Get the project running locally and actually use it — click through the app, hit the API, watch the logs scroll. Then change something small and obvious (a button label, a returned value) and see what happens. Connecting 'this file' to 'that behavior' with your own hands is the single fastest way to make a codebase real. If you can't get it running, that's your first task, and it teaches you the build and the setup along the way.",
  },
  {
    n: "03",
    title: "Follow one real request end to end",
    body: "Pick a single feature you already understand as a user — login, 'create order', one API endpoint — and trace it through every layer: route → handler/controller → service/business logic → database → response. This one vertical slice teaches you the project's real architecture, naming, and conventions faster than reading ten files horizontally. Once you've followed one request all the way through, the next one is mostly pattern-matching.",
  },
  {
    n: "04",
    title: "Read the tests",
    body: "Tests are executable documentation. They show how the code is meant to be called, what inputs matter, and which cases the authors thought were important enough to protect. Start with the tests for the area you're exploring — they're often the clearest statement of intent in the whole repo, and unlike comments they can't drift out of date without the suite going red.",
  },
  {
    n: "05",
    title: "Use git history for the 'why'",
    body: "The code tells you what; git tells you why. When a line looks strange or arbitrary, git blame it, then read the commit message and any linked PR or issue. History turns a confusing file into a story: this hack works around that bug, this abstraction was added when that feature landed. The 'why' is the context you literally cannot recover from the current code alone.",
  },
  {
    n: "06",
    title: "Navigate with tools — and let AI be a tour guide, not an oracle",
    body: "Use 'go to definition', 'find all references', and a call hierarchy to move through the code instead of grep-guessing. Ask your AI assistant to explain an unfamiliar file or function — it's a genuinely good tour guide for getting oriented fast. But verify what it tells you against the actual code and tests: it will confidently produce plausible-but-wrong explanations, because it's pattern-matching, not reading your specific project. Treat AI as a fast first draft of understanding, never the source of truth.",
  },
  {
    n: "07",
    title: "Make a small change and ship it",
    body: "The real test of understanding is doing. Fix a tiny bug or add a small feature and take it all the way through review and merge. It forces you to touch the build, the tests, the conventions, and the review process — the whole machine — and it converts passive reading into the durable knowledge you only get from making the codebase do something new. One shipped change teaches you more than a day of scrolling.",
  },
] as const;

const FAQ = [
  {
    q: "What's the fastest way to understand a new codebase?",
    a: "Not by reading it top to bottom — that's the slow way, and you'll forget most of it. The fast way is to explore deliberately around real behavior. First get the map: read the README, docs, and the dependency list, and skim the directory structure so you know roughly how the thing is organized. Then get it running and use it, and change something small to connect files to behavior. The highest-leverage single move is to pick one feature you understand as a user and trace that request end to end, through every layer — that one vertical slice teaches you the real architecture and conventions faster than reading ten files. Back it up by reading the tests (executable documentation of intent) and using git blame to recover the 'why' behind confusing code. The theme is depth-on-demand: build a broad map, then go deep exactly where a real task takes you.",
  },
  {
    q: "How long does it take to get productive in a new codebase?",
    a: "Less time than it takes to 'understand the whole thing' — because you never need to understand the whole thing at once. Aim to make a small, real change (a tiny bug fix or feature) within your first few days; that single shipped change forces you through the build, tests, conventions, and review, and it's worth a week of passive reading. Broad familiarity — knowing where things live and how a request flows — comes in days. Deep understanding accumulates over weeks, one task at a time, as each piece of work pulls you into a new area and you learn it just-in-time. Trying to fully understand a large codebase before doing anything is the classic trap that keeps new engineers stuck; productivity comes from a good map plus a reliable method for going deep on demand, not from reading everything first.",
  },
  {
    q: "Should I use AI to help me understand a new codebase?",
    a: "Yes — as a tour guide, not as the source of truth. Asking an AI assistant to explain an unfamiliar file, summarize a module, or sketch how a feature is wired up is a great way to get oriented quickly, and it can point you at the right places to look. But you have to verify what it says against the actual code and the tests, because it's pattern-matching against its training data with no real model of your specific project, and it will produce confident, plausible-sounding explanations that are subtly or completely wrong. The healthy pattern is to use AI to accelerate your own tracing — get a fast first draft of the mental model, then confirm it by following one real request through the code yourself. If you skip the verification, you're not learning the codebase, you're learning the AI's guess about it.",
  },
  {
    q: "How does Covate help me learn a new (or AI-generated) codebase?",
    a: "Learning an unfamiliar codebase and learning AI-generated code are the same muscle: in both cases you're working with code you didn't write and need to genuinely understand rather than just accept. Covate builds that understanding step into your workflow. It's a free, open-source MCP tool that plugs into your AI coding assistant (Claude, Cursor, Copilot and others), watches what actually changes in your codebase, and turns your real diffs into short, targeted quizzes about the concepts, APIs, edge cases, and trade-offs — blocking further generation until you can answer. So as you make your first changes in a new project, Covate checks that you actually understand what you're touching, at the moment the context is fresh. Every session is saved, and the optional Covate Learning Platform syncs them to the cloud for a review dashboard, progress tracking, weak-topic analysis, and a personalized study plan — turning 'getting up to speed' into compounding understanding instead of a one-off scramble.",
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
    datePublished: "2026-08-05",
    dateModified: "2026-08-05",
    mainEntityOfPage: { "@type": "WebPage", "@id": URL },
    author: { "@id": SITE + "#organization" },
    publisher: { "@id": SITE + "#organization" },
    about: { "@type": "Thing", name: "understanding an unfamiliar codebase" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learning Center", item: SITE + "/learn" },
      { "@type": "ListItem", position: 3, name: "Learn a new codebase fast", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function LearnNewCodebaseFast() {
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
          <a href="/learn" className="transition-colors hover:text-primary">Learn</a>
          <a href={SITE + "#how"} className="hidden transition-colors hover:text-primary sm:inline">How it works</a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">GitHub</a>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-20 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
          <a href={SITE} className="transition-colors hover:text-accent">Covate</a>
          <span aria-hidden> / </span>
          <a href="/learn" className="transition-colors hover:text-accent">Learning Center</a>
        </nav>

        <header className="border-b border-border pb-8 pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">Practical guide</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
            How to learn a new codebase fast
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            You&apos;ve just joined a project, inherited a service, or opened a big unfamiliar repo — maybe one an AI
            largely wrote for you. Reading it top to bottom doesn&apos;t work and never finishes. The fastest way to
            understand a codebase is to explore it deliberately, around real behavior, and go deep only where you need
            to. Here&apos;s a practical 7-step method.
          </p>
          <p className="mt-4 font-mono text-xs text-dim">By the Covate team · Updated August 5, 2026</p>
        </header>

        <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <p>
              The instinct on day one is to read everything — open file after file until it all makes sense. It
              never does, because a codebase isn&apos;t a book: it&apos;s a graph of behavior, and behavior is
              understood by following it, not by reading files in alphabetical order. You don&apos;t need to
              understand all of it. You need a good <em>map</em>, and a reliable method for going <em>deep on
              demand</em>. These seven steps get you there.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The 7-step method</h2>
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
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Don&apos;t try to understand everything first</h2>
            <p className="mt-4">
              The trap that keeps new engineers stuck is trying to fully understand a large codebase before touching
              anything. You don&apos;t need to, and you can&apos;t — even the people who wrote it don&apos;t hold it
              all in their heads. Learn the <strong>architecture broadly</strong> (what the pieces are and how a
              request flows), then learn the <strong>details just-in-time</strong> as each task pulls you into a new
              area. Depth follows need. A shipped change on day three beats a perfect mental model on day thirty —
              and the change is how you build the mental model anyway.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Understand code you didn&apos;t write — with Covate</h2>
            <p className="mt-4 text-secondary">
              A new codebase and AI-generated code are the same problem: code you didn&apos;t write and need to
              actually understand, not just accept. Covate builds that check into your workflow. It&apos;s a free,
              open-source MCP tool that plugs into your AI assistant (Claude, Cursor, Copilot and others), watches
              what actually changes as you work, and turns your real diffs into short, targeted quizzes about the
              concepts, edge cases, and trade-offs — so you understand each change while the context is fresh. Every
              session is saved; the optional{" "}
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
              <a href="/learn/how-to-review-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to review AI-generated code before you merge it →
              </a>
              <a href="/learn" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                Browse the Covate Learning Center →
              </a>
            </div>
          </section>
        </article>

        <div className="mt-12 border-t border-border pt-6 font-mono text-xs text-dim">
          <a href="/learn" className="hover:text-secondary">← Back to the Learning Center</a>
        </div>
      </main>
    </div>
  );
}
