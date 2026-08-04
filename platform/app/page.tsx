import { FAQ, GITHUB, SITE } from "./layout";
import { WaitlistForm } from "./WaitlistForm";

// Home-page-specific structured data (site-wide Organization/WebApplication live in layout).
const homeLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": SITE + "#article",
    headline: "Covate: turn AI-assisted coding into real understanding",
    description:
      "Covate quizzes you on your own code changes so you actually learn while you build with AI, then a paid Learning Platform tracks your progress.",
    inLanguage: "en",
    datePublished: "2026-08-04",
    dateModified: "2026-08-04",
    mainEntityOfPage: { "@type": "WebPage", "@id": SITE },
    author: { "@id": SITE + "#organization" },
    publisher: { "@id": SITE + "#organization" },
    about: { "@type": "Thing", name: "learning to program while coding with AI assistants" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": SITE + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learning Platform", item: SITE },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
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
    title: "Code with your AI assistant",
    body: "Keep using Claude, Cursor, Copilot — whatever you already use. Covate rides along as an MCP server, watching what actually changes in your codebase.",
  },
  {
    n: "02",
    title: "Get quizzed on what just changed",
    body: "Ask Covate to quiz you (or set a cadence) and it turns the recent diff into a few sharp questions about the concepts, APIs and trade-offs — blocking further generation until you answer. You learn while the context is fresh.",
  },
  {
    n: "03",
    title: "Watch your understanding compound",
    body: "Every session is saved. With a Learning Platform account it syncs to the cloud, where you review past quizzes, track progress, see your weak topics, and get a personalized study plan that re-quizzes what you keep missing.",
  },
];

const FREE = [
  "learning_session: quizzes from your real code changes",
  "debug_search: project-level debug memory (RAG)",
  "Local session history + local quiz WebUI",
  "Runs fully offline, no account, MIT-licensed",
];

const PAID = [
  "Cloud sync of every session across machines",
  "Review dashboard: every past quiz + answer",
  "Progress tracking + weak-topic analysis",
  "Personalized study plan (spaced repetition)",
  "Team/org learning (coming later)",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-deep text-primary">
      {homeLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-primary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Covate" width={26} height={26} className="rounded-md" />
          covate<span className="text-accent">.</span>
        </span>
        <nav className="flex items-center gap-6 text-sm text-secondary">
          <a href="#how" className="transition-colors hover:text-primary">How it works</a>
          <a href="#pricing" className="hidden transition-colors hover:text-primary sm:inline">Open-core</a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">GitHub</a>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="hero-aurora bg-grid border-b border-border">
          <div className="relative z-10 mx-auto max-w-3xl px-6 pb-20 pt-16 text-center sm:pt-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Open-source MCP · learning platform
            </p>
            <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-primary sm:text-6xl">
              Turn AI-assisted coding into <span className="text-brand">real understanding</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-secondary">
              When AI writes most of your code, it&rsquo;s easy to ship things you don&rsquo;t actually understand.
              Covate quizzes you on your own changes so you learn while you build — then remembers every session
              and turns it into a personalized learning plan.
            </p>
            <div className="mt-9 flex flex-col items-center gap-3">
              <WaitlistForm />
              <p className="font-mono text-xs text-dim">
                The MCP tool is free &amp; open-source · the Learning Platform is early access
              </p>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <h2 className="text-2xl font-semibold text-primary sm:text-3xl">
              &ldquo;It works&hellip; but could you explain it?&rdquo;
            </h2>
            <p className="mt-5 text-base leading-8 text-secondary">
              The faster AI writes your code, the quieter your own skills erode. You accept a diff, it passes the
              tests, you move on — and six months later you couldn&rsquo;t rebuild it from scratch. Covate is the
              antidote: a lightweight loop that checks your understanding at the exact moment you still have the
              context, so using AI makes you <span className="text-primary">faster and better</span>, not just faster.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-2xl font-semibold text-primary sm:text-3xl">How it works</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="rounded-xl border border-border bg-surface/50 p-6">
                  <span className="font-mono text-sm text-accent">{s.n}</span>
                  <h3 className="mt-3 text-lg font-semibold text-primary">{s.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-secondary">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open-core split */}
        <section id="pricing" className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-2xl font-semibold text-primary sm:text-3xl">Open-core, by design</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-secondary">
              The tool that helps you learn is free and open-source, forever. The cloud platform that turns those
              learning moments into lasting, measurable growth is the paid layer.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface/50 p-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-secondary">Free · open-source</p>
                <h3 className="mt-3 text-xl font-semibold text-primary">The Covate MCP</h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-secondary">
                  {FREE.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block font-mono text-xs text-secondary underline underline-offset-4 hover:text-primary">
                  Install from GitHub -&gt;
                </a>
              </div>
              <div className="rounded-xl border border-accent/40 bg-accent/[0.06] p-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">Paid · early access</p>
                <h3 className="mt-3 text-xl font-semibold text-primary">The Learning Platform</h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-secondary">
                  {PAID.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#join" className="mt-6 inline-block font-mono text-xs text-accent underline underline-offset-4 hover:text-accent-soft">
                  Join the waitlist -&gt;
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <h2 className="text-2xl font-semibold text-primary sm:text-3xl">Questions</h2>
            <div className="mt-8 divide-y divide-border border-y border-border">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="cursor-pointer list-none text-sm font-medium text-primary transition hover:text-accent">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-secondary">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="join">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <h2 className="text-3xl font-semibold text-primary sm:text-4xl">
              Learn from every change.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-8 text-secondary">
              Start with the free MCP today, and be first into the Learning Platform when it opens.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <WaitlistForm />
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary">
                or install the open-source MCP now
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-dim sm:flex-row">
          <span className="font-mono">covate<span className="text-accent">.</span> — a DUOCODE TECHNOLOGY product</span>
          <div className="flex gap-5">
            <a href="/learn/how-to-learn-from-ai-generated-code" className="hover:text-secondary">Learn</a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="hover:text-secondary">GitHub</a>
            <a href={SITE} className="hover:text-secondary">Home</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
