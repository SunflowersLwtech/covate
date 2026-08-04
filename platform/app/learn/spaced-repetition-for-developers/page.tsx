import type { Metadata } from "next";
import { GITHUB, SITE } from "../../layout";
import { WaitlistForm } from "../../WaitlistForm";

const PATH = "/learn/spaced-repetition-for-developers";
const URL = SITE + PATH;

const TITLE = "Spaced Repetition for Developers: How to Actually Remember What You Learn";
const DESCRIPTION =
  "You learn a concept, use it once, and forget it a month later. Spaced repetition is the fix — the science of reviewing things right before you'd forget them. Here's how it works and how to apply it to programming without building flashcards by hand.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "spaced repetition for developers",
    "spaced repetition programming",
    "how to remember what you learn coding",
    "spaced repetition for programmers",
    "retain programming knowledge",
    "active recall for developers",
    "learn and remember code",
    "stop forgetting what you learn",
  ],
  alternates: { canonical: PATH },
  openGraph: { type: "article", siteName: "Covate", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const FAQ = [
  {
    q: "What is spaced repetition, and why does it work?",
    a: "Spaced repetition is a study technique where you review something at increasing intervals — a day later, then a few days, then a week, then a month — timed to catch you right before you'd forget it. It works because of two well-established findings in the science of learning. The first is the forgetting curve: after you learn something, your memory of it decays over time unless it's reinforced. The second is the spacing effect: reviews spread out over time produce far stronger, longer-lasting memories than the same amount of review crammed together. Each time you successfully recall something just as it's starting to fade, the memory gets consolidated and the next safe interval gets longer. So instead of re-reading a concept ten times in one afternoon (which feels productive but fades fast), you recall it five times over a month — less total effort, dramatically better retention. It's the most efficient way known to move knowledge into long-term memory.",
  },
  {
    q: "Why do developers forget so much of what they learn?",
    a: "Because programming is a firehose and most of what you learn, you learn once and never deliberately revisit. You debug a gnarly async issue, understand it deeply in the moment, and move on — and because you don't hit that exact situation again for months, the forgetting curve quietly erases it. Multiply that across every library quirk, language feature, config option, and pattern you've ever figured out, and you get the familiar experience of solving a problem you're sure you've solved before but can't remember how. AI assistants make this worse, not better: when the AI supplies the answer instantly, you never have to retrieve it from memory, so it never consolidates. The knowledge passes through you without sticking. Spaced repetition is the antidote — it deliberately brings concepts back just as they're fading, so the things you figure out actually accumulate into expertise instead of evaporating.",
  },
  {
    q: "How do I apply spaced repetition to programming specifically?",
    a: "The classic tool is a flashcard app (like Anki) where you make cards for things you want to remember and the app schedules reviews for you. That works, but for developers it has a big practical problem: making good cards by hand is tedious, so most people don't keep it up, and generic cards ('what does map() do?') are less useful than cards tied to real situations you hit in your own code. The higher-leverage approach is to anchor the repetition to your actual work: capture the concept at the moment you learn it (the async bug you just fixed, the API you just figured out, the trade-off you just made), phrase it as a question you'd want to answer later, and then get re-quizzed on it on a spaced schedule — more often for the ones you keep missing, less often for the ones you've locked in. The content should come from your real coding, and the scheduling should be automatic; that's what turns 'I learned this once' into 'I actually know this.'",
  },
  {
    q: "How does Covate do spaced repetition for developers?",
    a: "Covate is built to make this automatic, from your real code. The free, open-source MCP tool plugs into your AI coding assistant (Claude, Cursor, Copilot and others), watches what actually changes in your codebase, and generates short quizzes from your real diffs — so the material is your own work, captured the moment you learn it, no manual flashcard-making. Those learning sessions are saved, and the optional paid Covate Learning Platform turns them into exactly the spaced-repetition loop this article describes: it tracks which concepts you know versus keep missing, analyzes your weak topics, and builds a personalized study plan that re-quizzes you on the right things at the right intervals — bringing a concept back just before you'd forget it, and spacing out the ones you've mastered. In other words, it closes the loop between learning something while coding and actually remembering it weeks later, without you having to build or schedule anything by hand.",
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
    about: { "@type": "Thing", name: "spaced repetition applied to learning programming" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn/spaced-repetition-for-developers" },
      { "@type": "ListItem", position: 3, name: "Spaced repetition for developers", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

const STEPS = [
  {
    n: "01",
    title: "Capture the concept when you learn it",
    body: "The moment you figure something out — the async bug, the API gotcha, the trade-off — write it as a question you'd want to answer later, while the context is fresh. Material from your own real work beats generic flashcards every time.",
  },
  {
    n: "02",
    title: "Recall it, don't re-read it",
    body: "Reviews only work if you actively retrieve the answer from memory before checking. Re-reading feels productive but barely helps; the effortful recall is what consolidates the memory. Cover the answer, try, then check.",
  },
  {
    n: "03",
    title: "Space it out — more for what you miss",
    body: "Review at increasing intervals (a day, a few days, a week, a month), and let the schedule adapt: bring back the concepts you keep missing more often, and stretch the intervals on the ones you've locked in. That's the whole engine.",
  },
];

export default function SpacedRepetition() {
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
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">The science of remembering</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
            Spaced repetition for developers
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            You learn a concept, use it once, and forget it a month later — then re-solve the same problem from
            scratch. Spaced repetition is the proven fix: review things right before you&apos;d forget them, and they
            stick for good. Here&apos;s how it works, and how to apply it to programming without hand-building
            flashcards.
          </p>
          <p className="mt-4 font-mono text-xs text-dim">By the Covate team · Updated August 4, 2026</p>
        </header>

        <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Why you forget — the forgetting curve</h2>
            <p className="mt-4">
              After you learn something, your memory of it decays over time unless it&apos;s reinforced — the classic
              <strong> forgetting curve</strong>. For developers this is brutal, because most of what you learn you
              learn <em>once</em>: you debug a tricky issue, understand it deeply in the moment, and never deliberately
              revisit it. Months later you hit a similar problem and think &ldquo;I&apos;m sure I&apos;ve solved this
              before&rdquo; — but the memory is gone. AI assistants make it worse: when the answer is handed to you
              instantly, you never retrieve it from memory, so it never sticks.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The fix — the spacing effect</h2>
            <p className="mt-4">
              The <strong>spacing effect</strong> is one of the most robust findings in the science of learning:
              reviews spread out over time build far stronger, longer-lasting memories than the same amount of review
              crammed together. Spaced repetition operationalizes it — you review a concept at increasing intervals (a
              day, a few days, a week, a month), each time recalling it just as it starts to fade. Every successful
              recall consolidates the memory and lengthens the next safe interval. The result: <em>less</em> total
              effort than cramming, <em>dramatically</em> better retention.
            </p>
            <ol className="mt-6 space-y-5">
              {STEPS.map((s) => (
                <li key={s.n} className="rounded-xl border border-border bg-surface/40 p-5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm text-accent">{s.n}</span>
                    <h3 className="text-lg font-medium text-primary">{s.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-secondary">{s.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6">
              The catch for developers: hand-building flashcards is tedious, so most people quit — and generic cards
              are less useful than ones tied to the real situations you hit in your own code. The trick is to anchor
              the repetition to your actual work, and to make the scheduling automatic.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Automatic spaced repetition, from your real code — with Covate</h2>
            <p className="mt-4 text-secondary">
              Covate makes this loop automatic. The free, open-source MCP tool plugs into your AI assistant (Claude,
              Cursor, Copilot and others), watches your real code changes, and turns them into short quizzes — so the
              material is your own work, captured the moment you learn it, with no manual flashcards. The optional{" "}
              <a href={SITE} className="text-accent underline underline-offset-4 hover:text-accent-soft">
                Covate Learning Platform
              </a>{" "}
              turns those sessions into exactly the spaced-repetition loop above: it tracks what you know vs. keep
              missing, analyzes weak topics, and builds a personalized study plan that re-quizzes you at the right
              intervals — bringing a concept back just before you&apos;d forget it.
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
