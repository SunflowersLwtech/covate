import type { Metadata } from "next";
import { GITHUB, SITE } from "../../layout";
import { WaitlistForm } from "../../WaitlistForm";

const PATH = "/learn/should-you-still-learn-to-code-with-ai";
const URL = SITE + PATH;

const TITLE = "Should You Still Learn to Code in the Age of AI?";
const DESCRIPTION =
  "If AI can write the code, is it still worth learning to program? The honest answer is yes — but what you need to learn is shifting. Here's why understanding still matters more than ever, and what to focus on.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "should you still learn to code with AI",
    "is it worth learning to code in 2026",
    "learn programming in the age of AI",
    "will AI replace programmers",
    "do I need to learn to code if AI can do it",
    "learning to code with AI",
    "is coding still a good career",
    "how to learn programming with AI",
  ],
  alternates: { canonical: PATH },
  openGraph: { type: "article", siteName: "Covate", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const FAQ = [
  {
    q: "If AI can write code, is it still worth learning to program?",
    a: "Yes — but the reason is worth being precise about. AI can generate code, but it can't be accountable for it, reason about your specific system, decide what to build, or judge whether the output is actually correct and safe. Those jobs still belong to a human who understands programming. Think of AI as a very fast, very confident junior developer who has read everything and understood the specifics of nothing: incredibly useful if you can direct it and check its work, dangerous if you can't. The people who thrive alongside AI aren't the ones who've stopped learning to code — they're the ones who understand enough to steer it, catch its mistakes, and make the decisions it can't. So the answer to 'should I still learn to code?' is a clear yes; what changes is the emphasis — less rote syntax memorization, more understanding of systems, trade-offs, debugging, and judgment.",
  },
  {
    q: "Won't AI just replace programmers?",
    a: "It's replacing some of the work, not the programmers — at least not the ones who adapt. History rhymes here: compilers didn't eliminate programmers by automating machine code, high-level languages didn't eliminate them by hiding memory management, and Stack Overflow didn't eliminate them by making answers searchable. Each of those raised the level of abstraction and made individual developers far more productive, which increased the demand for software, not decreased it. AI is the next step up that ladder. What it changes is the mix of skills that matter: writing boilerplate by hand becomes less valuable, while understanding what to build, integrating pieces into a working system, reviewing and debugging, and making architectural and security judgments become more valuable. The developer who only ever typed out code the AI can now generate is exposed; the developer who understands systems and can direct and verify the AI is in a stronger position than ever.",
  },
  {
    q: "What should I focus on learning, if not memorizing syntax?",
    a: "Focus on the things that make you able to direct and check an AI, because that's the durable skill. In rough priority: (1) fundamentals — how programs actually work, data structures, control flow, how the pieces fit, so nothing the AI produces is a black box to you; (2) reading and reviewing code — you'll spend more time evaluating generated code than writing it, so the ability to read a diff, spot the bug, and judge whether it fits is central; (3) debugging and reasoning from first principles — when the AI is stuck or wrong (and it will be), this is what saves you; (4) systems thinking — how components connect, where the failure modes and security risks live, what to build and why; and (5) judgment and taste — knowing what 'good' looks like. Syntax you can look up (and the AI can supply); understanding you can't outsource. The goal isn't to compete with the AI at typing code — it's to be the person who understands the code well enough to be responsible for it.",
  },
  {
    q: "How do I actually learn to code well while using AI — without it doing the learning for me?",
    a: "This is the real risk: if you let the AI supply every answer, you get code without understanding, and your skills never develop. The fix is to stay an active participant. Use the AI as a tutor, not a vending machine — read what it writes, ask it why, predict what its code will do before you run it, and try to solve things yourself first. Above all, engage with each piece of generated code while the context is fresh: explain it back, quiz yourself on the concepts and edge cases, and revisit the ones you keep missing. That deliberate, active engagement is exactly what turns 'the AI wrote it' into 'I understand it.' It's also precisely what Covate is built to make automatic — it's a free, open-source MCP tool that watches your real code changes and quizzes you on them so you learn while you build, plus an optional learning platform that tracks your progress and re-teaches your weak spots. Learning to code in the age of AI isn't about avoiding AI; it's about using it in a way that makes you better, not just faster.",
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
    dateModified: "2026-08-04",
    mainEntityOfPage: { "@type": "WebPage", "@id": URL },
    author: { "@id": SITE + "#organization" },
    publisher: { "@id": SITE + "#organization" },
    about: { "@type": "Thing", name: "whether to learn programming in the age of AI" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn/should-you-still-learn-to-code-with-ai" },
      { "@type": "ListItem", position: 3, name: "Should you still learn to code?", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function ShouldYouLearnToCode() {
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
          <a href={SITE + "#how"} className="transition-colors hover:text-primary">How it works</a>
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
            Should you still learn to code in the age of AI?
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            If AI can write the code, is it still worth learning to program? Short answer: <strong className="text-primary">yes</strong> —
            but <em>what</em> you need to learn is shifting. AI raises the level of abstraction; it doesn&apos;t remove
            the need for someone who understands the system, catches the mistakes, and decides what to build. Here&apos;s
            why understanding matters more than ever, and what to focus on.
          </p>
          <p className="mt-4 font-mono text-xs text-dim">By the Covate team · Updated August 4, 2026</p>
        </header>

        <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">AI is a very fast, very confident junior</h2>
            <p className="mt-4">
              The most useful way to think about today&apos;s AI coding assistants is as a tireless junior developer
              who has read everything and understood the specifics of nothing. It can produce plausible code for
              almost anything, instantly — and it will do so with total confidence whether it&apos;s right or wrong. That
              makes it incredibly powerful <em>if</em> you can direct it and check its work, and genuinely dangerous if
              you can&apos;t. The bottleneck isn&apos;t generating code anymore; it&apos;s knowing what to ask for, whether the
              answer is correct, and how to fix it when it isn&apos;t. Those are exactly the things you need to
              understand programming to do.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">This has happened before</h2>
            <p className="mt-4">
              Every big jump in programming has raised the level of abstraction and made developers more productive —
              and each time, the doom prediction was wrong. Compilers automated machine code; high-level languages hid
              memory management; the web made every answer searchable. None of them replaced programmers; they raised
              the ceiling and increased the demand for software. AI is the next rung on that ladder. What it changes is
              the <strong>mix of skills</strong> that matters: typing out boilerplate becomes cheap, while deciding what
              to build, integrating it into a working system, reviewing and debugging, and making architectural and
              security calls become the valuable parts — the human parts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">What to focus on learning</h2>
            <p className="mt-4">
              The durable skill is being able to <em>direct and verify</em> an AI. In rough priority:
            </p>
            <ol className="mt-5 space-y-3">
              {[
                "Fundamentals — how programs actually work, so nothing the AI produces is a black box to you.",
                "Reading & reviewing code — you'll evaluate generated code more than you write it; spotting the bug and judging the fit is central.",
                "Debugging from first principles — when the AI is stuck or wrong (and it will be), this is what saves you.",
                "Systems thinking — how components connect, where the failure modes and security risks live, what to build and why.",
                "Judgment and taste — knowing what 'good' looks like. Syntax you can look up; understanding you can't outsource.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="text-sm leading-7 text-secondary">{t}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6">
              Notice the theme: none of these are about competing with the AI at typing code. They&apos;re about being
              the person who understands the code well enough to be <strong>responsible</strong> for it.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Learn with AI without letting it do the learning — with Covate</h2>
            <p className="mt-4 text-secondary">
              The real risk of learning to code with AI is letting it supply every answer, so you get code without
              understanding. Covate keeps you the active learner. It&apos;s a free, open-source MCP tool that plugs into
              your AI assistant (Claude, Cursor, Copilot and others), watches your real code changes, and quizzes you
              on them — so you understand each change while the context is fresh, instead of just accepting it. The
              optional{" "}
              <a href={SITE} className="text-accent underline underline-offset-4 hover:text-accent-soft">
                Covate Learning Platform
              </a>{" "}
              tracks your progress, analyzes your weak spots, and re-teaches them on a spaced schedule — turning
              &ldquo;the AI wrote it&rdquo; into &ldquo;I understand it.&rdquo;
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
              <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                Does using AI make you a worse programmer? →
              </a>
              <a href="/learn/spaced-repetition-for-developers" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                Spaced repetition for developers →
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
