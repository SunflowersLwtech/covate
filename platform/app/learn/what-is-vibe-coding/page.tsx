import type { Metadata } from "next";
import { GITHUB, SITE } from "../../layout";
import { SignInCta } from "../../SignInCta";

const PATH = "/learn/what-is-vibe-coding";
const URL = SITE + PATH;

const TITLE = "What Is Vibe Coding? Meaning, Origin, and When to Use It";
const DESCRIPTION =
  "Vibe coding means describing what you want to an AI in plain English and largely accepting what it produces without reading the code closely. Here's a clear definition, where the term came from (Andrej Karpathy, 2025), where it genuinely works, where it bites you, and how to vibe code without quietly losing your skills.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "what is vibe coding",
    "vibe coding meaning",
    "what does vibe coding mean",
    "vibe coding definition",
    "is vibe coding bad",
    "who coined vibe coding",
    "when to use vibe coding",
    "Andrej Karpathy vibe coding",
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

const USES = [
  {
    kind: "good",
    title: "Throwaway prototypes and demos",
    body: "When the whole point is to see an idea running as fast as possible and you'll discard it afterward, vibe coding is close to ideal. Nobody depends on the code, so its quality barely matters — speed to a working demo does. This is exactly the use Karpathy described: 'not too bad for throwaway weekend projects.'",
  },
  {
    kind: "good",
    title: "Weekend projects and personal tools",
    body: "A small script, a personal dashboard, a one-off automation you and maybe a friend will use — the cost of a bug is low and you can rewrite it if it goes sideways. Vibing your way there lets you build things you'd never have bothered to write by hand.",
  },
  {
    kind: "good",
    title: "Exploration and learning spikes",
    body: "Vibe coding is a fast way to poke at an unfamiliar library, framework, or idea. As long as you treat the output as a sketch to learn from rather than a foundation to build on, letting the AI run ahead is a genuinely useful way to explore the space.",
  },
  {
    kind: "risk",
    title: "Production code with real users",
    body: "The moment other people depend on the software — real users, real data, real money — the calculus flips. Casual prompts alone can't reliably carry scope, edge cases, and error handling, and 'it mostly works' isn't a standard you can ship to customers.",
  },
  {
    kind: "risk",
    title: "Security- and data-sensitive work",
    body: "Auth, payments, secrets, personal data, anything that talks to a database — here the failure modes are silent and expensive. AI reproduces the patterns in its training data, including insecure ones, and code nobody read is code whose vulnerabilities nobody caught.",
  },
  {
    kind: "risk",
    title: "Code you'll have to maintain",
    body: "Most real engineering is evolving an existing system, and that depends on someone understanding it. Vibe-coded code you never read is hard to debug, risky to change, and easy for the model itself to break on the next edit. If it has to live longer than the session that made it, don't forget it exists.",
  },
] as const;

const FAQ = [
  {
    q: "What is vibe coding?",
    a: "Vibe coding is a way of building software where you describe what you want to an AI in plain natural language, let it generate the code, and largely accept and run what it produces without reading it line by line — steering by what you see on screen rather than by the code itself. The term was coined by Andrej Karpathy in early 2025, who described it as coding where you 'fully give in to the vibes... and forget that the code even exists.' In practice that looks like: say what you want, click 'Accept All', run it, paste any error back to the AI, and repeat until it works. It's a real shift from traditional coding, where the whole point is precise control over exactly what the machine does. Vibe coding trades that control for speed and accessibility — you can build something functional in minutes, even with little or no programming knowledge — which is both its superpower and the root of its risks.",
  },
  {
    q: "Is vibe coding bad — does it make you a worse programmer?",
    a: "Vibe coding isn't 'bad'; it's a tool that's excellent for some jobs and a liability for others, and the honest answer to the skills question is: it depends on how you use it. Vibe coding is genuinely great for prototypes, weekend projects, and exploration — situations where the cost of being wrong is low. The risk is real too, though, and it's twofold. First, code you didn't read is code you can't easily debug, maintain, or secure, which is why vibing production systems is widely considered reckless. Second, if accepting-without-understanding becomes your only mode, your own ability to reason about code, recall APIs, and debug from first principles quietly erodes from disuse — ordinary skill decay. But none of that is inevitable. The developers who stay sharp use AI actively: they read what it generates, ask why, and make sure they understand each change before moving on. You can vibe code and keep learning — you just have to close the understanding loop instead of skipping it.",
  },
  {
    q: "When should you vibe code — and when shouldn't you?",
    a: "Vibe code when the cost of being wrong is low and speed matters most: throwaway prototypes, demos, weekend projects, personal tools, internal scripts, and exploratory 'can this even work?' spikes. In those cases iteration speed beats code quality and you can throw the result away, so giving in to the vibes is the rational choice, not a guilty shortcut. Be much more careful — or don't vibe code at all — when the software will outlive the session that produced it or when other people depend on it: production code with real users, anything touching security, auth, payments, or sensitive data, and any code you'll have to maintain and evolve later. A useful rule of thumb from practitioners is that vibe coding gets you roughly the first 60% (a working prototype) fast, but the last 40% — reliability, security, scale, edge cases, maintainability — is where understanding becomes non-negotiable. Vibe the prototype; engineer the product.",
  },
  {
    q: "How does Covate help you vibe code without losing your skills?",
    a: "Covate lets you keep the speed of vibe coding while closing the one gap that makes it risky: shipping code you don't understand. It's a free, open-source MCP tool that plugs into your AI coding assistant (Claude, Cursor, Copilot and others), watches what actually changes in your codebase, and turns your real diffs into short, targeted quizzes — asking you about the concepts, APIs, edge cases, and trade-offs in the change, and blocking further generation until you answer. So you still 'see stuff, say stuff, run stuff' — but at the moments that matter, you're forced to actually understand what just entered your codebase, while the context is fresh, instead of passively accepting it. Every session is saved, and the sync client pushes them into your learning ledger on covate.org — free, no payment — where you can review every past session, your running accuracy, and the topics you keep getting wrong. In other words, it turns vibe coding from a skill-decay trap into a way to move fast and get better at the same time.",
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
    about: { "@type": "Thing", name: "vibe coding" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn/what-is-vibe-coding" },
      { "@type": "ListItem", position: 3, name: "What is vibe coding?", item: URL },
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

export default function WhatIsVibeCoding() {
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
          <a href={SITE + "#whats-here"} className="hidden transition-colors hover:text-primary sm:inline">What you get</a>
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
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">Plain-English definition</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
            What is <span className="text-brand">vibe coding</span>?
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            Vibe coding means describing what you want to an AI in plain English and largely accepting what it
            produces — running it, reacting to what you see, pasting errors back — without reading the code closely.
            It&apos;s fast, it&apos;s genuinely useful for the right things, and it comes with one real catch. Here&apos;s
            what the term actually means, where it came from, where it works, where it bites you, and how to do it
            without quietly losing your skills.
          </p>
          <p className="mt-4 font-mono text-xs text-dim">By the Covate team · Updated August 5, 2026</p>
        </header>

        <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">What vibe coding actually means</h2>
            <p className="mt-4">
              Traditional coding is about precision: you tell the computer exactly what to do, in a language it
              understands, and you own every line. <strong>Vibe coding is the opposite posture.</strong> You describe
              what you want in ordinary language — &ldquo;make me a page that lists my meetings and lets me add one&rdquo; —
              the AI generates the code, and you steer by what you see on screen rather than by the code itself. You
              accept the changes, run the app, and if something breaks you paste the error back to the AI and let it try
              again.
            </p>
            <p className="mt-4">
              The defining move is that you <em>don&apos;t read the code</em>. As one common description puts it, you
              build the software by prompting, trying it out, and prompting for changes — without looking at what the
              model actually wrote. That&apos;s what makes it accessible to people with no programming background at all,
              and what makes it so fast for people who do. It&apos;s also, as we&apos;ll see, exactly where the risk
              lives.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Where the term came from</h2>
            <p className="mt-4">
              &ldquo;Vibe coding&rdquo; was coined by <strong>Andrej Karpathy</strong> — a co-founder of OpenAI and
              former director of AI at Tesla — in a post on X on <strong>February 2, 2025</strong>. His words:
            </p>
            <blockquote className="mt-5 border-l-2 border-accent/50 pl-5 text-secondary">
              &ldquo;There&apos;s a new kind of coding I call &lsquo;vibe coding&rsquo;, where you fully give in to the
              vibes, embrace exponentials, and forget that the code even exists. [&hellip;] I &lsquo;Accept All&rsquo;
              always, I don&apos;t read the diffs anymore. [&hellip;] It&apos;s not too bad for throwaway weekend
              projects.&rdquo;
            </blockquote>
            <p className="mt-5">
              The line built on an idea Karpathy had floated in 2023 — that &ldquo;the hottest new programming language
              is English&rdquo; — the point being that models had gotten good enough that you could increasingly command
              a computer in natural language instead of code. The name caught on fast. Merriam-Webster flagged it as a
              &ldquo;slang &amp; trending&rdquo; term in March 2025, and by November 2025 <strong>Collins Dictionary had
              named &ldquo;vibe coding&rdquo; its Word of the Year</strong> — a decent sign of how far the idea travelled
              beyond engineering circles in a single year.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Where vibe coding works — and where it bites you</h2>
            <p className="mt-4">
              Vibe coding isn&apos;t good or bad in the abstract; it&apos;s a great fit for some jobs and a genuine
              liability for others. The deciding question is simple: <strong>how much does it cost if the code is
              wrong?</strong> When the answer is &ldquo;almost nothing,&rdquo; vibe away. When it&apos;s &ldquo;a lot,&rdquo;
              slow down.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {USES.map((u) => (
                <div key={u.title} className="rounded-xl border border-border bg-surface/40 p-5">
                  <span
                    className={
                      "font-mono text-[11px] uppercase tracking-[0.18em] " +
                      (u.kind === "good" ? "text-accent" : "text-brand")
                    }
                  >
                    {u.kind === "good" ? "Good fit" : "Risky"}
                  </span>
                  <h3 className="mt-2 text-base font-medium text-primary">{u.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-secondary">{u.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-6">
              A useful rule of thumb from people who&apos;ve pushed vibe coding hard: it gets you the first ~60% — a
              working prototype — remarkably fast, but the last 40% (reliability, security, scale, edge cases,
              maintainability) is real engineering that depends on someone actually understanding the system. Vibe the
              prototype; engineer the product.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The catch: shipping code you don&apos;t understand</h2>
            <p className="mt-4">
              Here&apos;s the honest part, and it&apos;s the whole reason Covate exists. The defining feature of vibe
              coding — not reading the code — is also its one real hazard, and it shows up in two ways. In the short
              term, code nobody read is code whose bugs, security holes, and awkward design nobody caught; it&apos;s hard
              to debug, risky to change, and easy for the model itself to break on the next edit. In the long term,
              there&apos;s <strong>skill decay</strong>: if accepting-without-understanding becomes your <em>only</em>
              mode, the muscles that make you a developer — reasoning about code, recalling APIs, debugging from first
              principles — quietly weaken from disuse. The scary part is that nothing feels wrong while it&apos;s
              happening; the gap only surfaces when you hit a problem the AI can&apos;t solve, or have to reason
              unaided.
            </p>
            <p className="mt-4">
              None of this is an argument against vibe coding — it&apos;s an argument for closing the loop. You can vibe
              code <em>and</em> keep learning, and the two aren&apos;t in tension if you spend a minute of real attention
              on the code that just entered your codebase, while the context is still fresh. That&apos;s the difference
              between using AI to move faster and using AI to ship things you don&apos;t understand — and it&apos;s a
              habit, not a personality trait, which means it can be built into your workflow.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Vibe code without losing your skills — with Covate</h2>
            <p className="mt-4 text-secondary">
              Covate lets you keep the speed of vibe coding while closing the gap that makes it risky. It&apos;s a free,
              open-source MCP tool that plugs into your AI assistant (Claude, Cursor, Copilot and others), watches what
              actually changes, and turns your real diffs into short, targeted quizzes about the concepts, edge cases,
              and trade-offs — blocking further generation until you answer, so you understand each change while the
              context is fresh instead of passively accepting it. You still see stuff, say stuff, and run stuff — you
              just don&apos;t forget the code exists. Every session is saved; the free{" "}
              <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
                Covate learning ledger
              </a>{" "}
              takes them from there: sign in with GitHub and every synced session, your running accuracy, and the
              topics you keep getting wrong are there to review. Nothing to buy.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <SignInCta />
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
              The MCP is free and open-source (MIT). So is the learning ledger on covate.org — sign in with GitHub, nothing to buy.
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
              <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to actually learn from AI-generated code (without skill decay) →
              </a>
              <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                Does using AI make you a worse programmer? An honest look →
              </a>
              <a href="/learn/should-you-still-learn-to-code-with-ai" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                Should you still learn to code in the age of AI? →
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
