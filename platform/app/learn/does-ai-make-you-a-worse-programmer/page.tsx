import type { Metadata } from "next";
import { GITHUB, SITE } from "../../layout";
import { Evidence } from "../../_geo/Evidence";
import { SignInCta } from "../../SignInCta";

const PATH = "/learn/does-ai-make-you-a-worse-programmer";
const URL = SITE + PATH;

const TITLE = "Does Using AI Make You a Worse Programmer? An Honest Look";
const DESCRIPTION =
  "Does relying on AI coding assistants make you a worse programmer? The honest answer: it can — through skill decay — but it doesn't have to. A balanced look at the evidence on both sides, and the single factor (active vs passive use) that decides which way it goes for you.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "does AI make you a worse programmer",
    "is AI making developers worse",
    "AI coding skill decay",
    "over-reliance on AI coding assistants",
    "will AI make me a bad programmer",
    "copilot making me worse",
    "stay sharp using AI to code",
    "AI coding pros and cons for skills",
    "learn while using AI assistant",
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

const FAQ = [
  {
    q: "Does using AI actually make you a worse programmer?",
    a: "It can, but it isn't guaranteed — and that's the honest answer most hot takes skip. Using an AI assistant makes you a worse programmer when it lets you stop doing the mental work that built your skills in the first place: when you accept code without understanding it, stop practicing recall of APIs and syntax, and stop debugging from first principles because the AI usually fixes it for you. Those are real skills, and like any skill, they decay from disuse. But the same tool used differently can make you a better programmer — a faster feedback loop, an always-available tutor, exposure to patterns you'd never have found alone. The tool is neutral; what decides the outcome is whether you stay an active participant or become a passive one.",
  },
  {
    q: "Why does relying on AI cause skill decay?",
    a: "Because skill comes from effortful retrieval and problem-solving, and AI can quietly remove both. When you write code yourself, you're constantly retrieving knowledge from memory (which method, what argument order, how this API behaves) and solving small problems (why doesn't this compile, what's the edge case). Every one of those acts strengthens the underlying skill. When an AI supplies the answer before you've tried to retrieve or reason, you skip the effort — and it's the effort, not the answer, that does the learning. Do that for months and the skills you've stopped exercising get slower and less reliable, even though day-to-day everything feels fine because the AI is covering for you. That's why decay is easy to miss until you hit a problem the AI can't solve, or an interview, or a code review where you have to reason unaided.",
  },
  {
    q: "Can AI actually make you a better programmer?",
    a: "Absolutely — used actively, it may be the best learning tool programming has ever had. It can explain unfamiliar code line by line, show you three ways to solve a problem and the trade-offs, introduce you to idioms and libraries you didn't know existed, and answer 'why' the instant you're curious, while the context is fresh. It lets you attempt more ambitious projects than you could alone, and every ambitious project teaches you something. The developers who get better with AI are the ones who treat it as a pair-programming tutor — they read what it writes, ask why, predict what it'll do before running it, and use it to go deeper rather than to avoid thinking. The exact same tool, opposite outcome, based entirely on how it's used.",
  },
  {
    q: "How do I use AI without losing my skills?",
    a: "Stay active where it's cheap to stay active: at the moment code is generated. Concretely — read generated code to explain it, not just to approve it; before accepting a change, try to predict what it does and what would break if you altered it; when the AI uses an API or pattern you don't fully know, pause and learn it right then while the context is fresh; and every so often, solve something without the AI to keep the underlying muscles warm. None of this means coding slower across the board — it means spending a minute of active attention on the code that just entered your codebase, which is exactly when learning is cheapest and most durable. The goal is to use AI to move faster AND get better, instead of trading one for the other.",
  },
  {
    q: "How does Covate help me stay sharp while using AI?",
    a: "Covate is built for exactly this problem. It's a free, open-source MCP tool that plugs into your AI coding assistant (Claude, Cursor, Copilot and others), watches what actually changes in your codebase, and turns your real diffs into short, targeted quizzes — blocking further generation until you answer, so you're forced to understand each change while the context is fresh instead of passively accepting it. That single habit is the difference between AI making you worse and AI making you better. Every session is saved, and the sync client pushes them into your learning ledger on covate.org — free, no payment — where you can review every past session, your running accuracy, and the topics you keep getting wrong — so 'staying sharp' becomes measurable and automatic rather than a thing you have to remember to do.",
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
    datePublished: "2026-08-04",
    dateModified: "2026-08-27",
    mainEntityOfPage: { "@type": "WebPage", "@id": URL },
    author: { "@id": SITE + "#organization" },
    publisher: { "@id": SITE + "#organization" },
    about: { "@type": "Thing", name: "whether AI coding assistants harm or help programming skill" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn/does-ai-make-you-a-worse-programmer" },
      { "@type": "ListItem", position: 3, name: "Does AI make you a worse programmer?", item: URL },
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

export default function DoesAiMakeYouWorse() {
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
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">The honest answer</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
            Does using AI make you a <span className="text-brand">worse programmer</span>?
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            Short answer: it can — but it doesn&apos;t have to, and which way it goes is almost entirely up to
            you. Relying on AI coding assistants can quietly erode your skills through disuse; used differently,
            the same tool can make you sharper than ever. Here&apos;s the honest case on both sides, and the one
            factor that decides which one you get.
          </p>
          <p className="mt-4 font-mono text-xs text-dim">By the Covate team · Updated August 4, 2026</p>
        </header>

        <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The case that it does</h2>
            <p className="mt-4">
              There&apos;s a real mechanism behind the worry, and it&apos;s worth taking seriously. Programming
              skill is built and maintained by two kinds of effort: <strong>retrieval</strong> (pulling APIs,
              syntax and patterns out of your own memory) and <strong>problem-solving</strong> (working out why
              something breaks and how to fix it). An AI assistant can remove both. When it hands you a working
              solution before you&apos;ve tried to recall or reason your way to one, you skip the effort — and
              it&apos;s the effort, not the finished code, that does the learning.
            </p>
            <p className="mt-4">
              Do that consistently and the skills you&apos;ve stopped exercising get slower and less reliable,
              the same way any unused skill does. The insidious part is that nothing feels wrong while it&apos;s
              happening: the AI covers for you, the features ship, the tests pass. The gap only surfaces when you
              hit a problem the model can&apos;t solve, sit an interview, or have to reason through a code review
              unaided — and realize you&apos;ve been shipping code you couldn&apos;t have written or debugged
              yourself. That&apos;s not a myth; it&apos;s ordinary skill decay, and heavy passive AI use is a
              fast track to it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The case that it doesn&apos;t — and can even reverse it</h2>
            <p className="mt-4">
              And yet plenty of developers are getting <em>better</em> with AI, not worse — because the same tool,
              used actively, is arguably the best learning accelerator programming has ever had. It can explain
              unfamiliar code line by line, lay out three approaches to a problem with their trade-offs, introduce
              you to libraries and idioms you&apos;d never have stumbled on, and answer &ldquo;why&rdquo; the
              instant you&apos;re curious — while the context is still fresh in your head.
            </p>
            <p className="mt-4">
              It also lets you take on more ambitious projects than you could alone, and ambitious projects are
              where real learning happens. The developers who improve with AI treat it like a tireless
              pair-programming tutor: they read what it writes, ask it why, predict what it&apos;ll do before they
              run it, and use it to go deeper instead of to avoid thinking. Exact same tool, opposite result. The
              difference isn&apos;t the AI — it&apos;s the human&apos;s posture toward it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The deciding factor: active vs passive use</h2>
            <p className="mt-4">
              So the real question isn&apos;t &ldquo;is AI good or bad for my skills?&rdquo; It&apos;s
              &ldquo;am I using it actively or passively?&rdquo; Passive use — generate, glance, accept, repeat —
              is the road to decay. Active use — engaging with the code the AI produces while the context is
              fresh — is the road to getting better. And staying active is cheapest at one specific moment: right
              after a change is generated. A few concrete habits keep you on the right side:
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Read generated code to explain it, not just to approve it — if you can't say what it does and why, that's the gap to close.",
                "Before accepting a change, predict what it does and what would break if you altered a line.",
                "When the AI uses an API or pattern you don't fully know, learn it right then, while the context is fresh.",
                "Every so often, solve something without the AI, to keep the underlying muscles warm.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="text-sm leading-7 text-secondary">{t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              None of this means coding slower across the board. It means spending a minute of real attention on
              the code that just entered your codebase — exactly when learning is cheapest and sticks best. Do
              that, and AI makes you faster <em>and</em> better instead of trading one for the other.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Stay on the right side — automatically — with Covate</h2>
            <p className="mt-4 text-secondary">
              Staying active is simple in theory and easy to forget in practice. Covate makes it automatic. It&apos;s
              a free, open-source MCP tool that plugs into your AI assistant (Claude, Cursor, Copilot and others),
              watches what actually changes, and turns your real diffs into short, targeted quizzes — blocking
              further generation until you answer, so you understand each change while the context is fresh instead
              of passively accepting it. Every session is saved locally, and the free{" "}
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
              <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to actually learn from AI-generated code (without skill decay) →
              </a>
              <a href="/learn/how-to-review-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to review AI-generated code before you merge it →
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
