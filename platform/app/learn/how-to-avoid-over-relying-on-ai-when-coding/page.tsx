import type { Metadata } from "next";
import { GITHUB, SITE } from "../../lib/site";
import { Evidence } from "../../_geo/Evidence";
import { SignInCta } from "../../SignInCta";
import { NAV, SiteHeader } from "../../_components/SiteHeader";
import { Breadcrumb } from "../../_components/Breadcrumb";
import { ArticleBackLink } from "../../_components/ArticleBackLink";

const PATH = "/learn/how-to-avoid-over-relying-on-ai-when-coding";
const URL = SITE + PATH;

const TITLE = "How to Avoid Over-Relying on AI When Coding";
const DESCRIPTION =
  "You use AI coding assistants and you like them — this isn't about quitting. The real risk isn't using AI, it's using it passively: accepting output you don't understand. Here are the signs you're over-relying, why it matters, and a concrete habit list to keep your edge while you keep shipping with AI.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "how to avoid relying on AI for coding",
    "am I too dependent on AI coding",
    "over-relying on AI coding assistants",
    "how to use AI without losing coding skills",
    "stop over-relying on Copilot",
    "AI coding dependency signs",
    "stay sharp while using AI to code",
    "using AI without skill atrophy",
  ],
  alternates: { canonical: PATH },
  openGraph: { type: "article", siteName: "Covate", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const HABITS = [
  {
    n: "01",
    title: "Read before you accept — including the actual diff",
    body: "The single habit that separates active from passive use. Before you hit 'Accept All', read what the model actually wrote, not just its summary of what it wrote. Skim the real diff for the change you asked for and the changes you didn't — the renamed variable, the swapped library, the quiet refactor. It takes seconds on a small change, and it's the moment you stay in the loop instead of becoming a rubber stamp.",
  },
  {
    n: "02",
    title: "Explain each change back in your own words",
    body: "The 'can I teach it?' test. After a change lands, say — out loud or to yourself — what it does and why this approach over the obvious alternative. If you can't, you don't understand it yet; you've just watched it happen. This is cheap, fast, and the most reliable signal that a change actually entered your head and not just your codebase.",
  },
  {
    n: "03",
    title: "Ask 'why,' not just 'what' — use AI as a tutor",
    body: "The same tool that can hand you an answer can teach you the reasoning behind it, if you let it. When the AI produces something you don't fully get, don't move on — ask it why it chose this, what the trade-offs are, what would break, what the alternatives were. That turns a passive answer into an active lesson and keeps you building understanding instead of just accumulating code.",
  },
  {
    n: "04",
    title: "Do the occasional piece by hand",
    body: "Pick something small and write it yourself, unaided — no autocomplete, no prompt. And when you're stuck on a bug, give yourself ten or fifteen minutes to reason it out before you paste it into the AI. This isn't nostalgia; it's the equivalent of a musician still practising scales. The muscle you don't use is the muscle that quietly weakens.",
  },
  {
    n: "05",
    title: "Keep the fundamentals warm",
    body: "Judgment is built on knowing what good looks like — architecture, data flow, complexity, security, what tends to break. Those don't stay sharp on their own once AI handles the day-to-day. Read code you didn't generate, debug from first principles now and then, and keep learning the layers underneath the abstraction. Fundamentals are exactly what let you catch the AI when it's confidently wrong.",
  },
  {
    n: "06",
    title: "Close the loop with active recall",
    body: "Understanding something in the moment isn't the same as retaining it. Come back to what you shipped and quiz yourself: what did that change do, why, what would I do differently? Active recall — retrieving it rather than re-reading it — is what turns a one-time 'I get it' into knowledge you actually keep. Without it, even code you understood at the time fades from disuse.",
  },
] as const;

const FAQ = [
  {
    q: "Am I too dependent on AI for coding? What are the signs?",
    a: "A few honest signals, and you don't need all of them to take the hint. You can't explain code you 'wrote' with AI last week — you'd have to re-read it to know what it does. You feel a spike of panic when the assistant is down, rate-limited, or you're offline, as if you can't work without it. You reach for the AI to debug reflexively, pasting the whole thing in rather than forming a hypothesis first. You haven't written anything non-trivial unaided in a long time. And your fundamentals feel rusty — recalling an API, reasoning about complexity, or tracing a bug takes noticeably more effort than it used to. None of these mean you should stop using AI; they mean you've drifted toward using it passively, and it's worth deliberately rebuilding the active habits. The reassuring part is that this is reversible: skills come back with use, and the fix is a handful of small habits, not abstinence.",
  },
  {
    q: "Is it bad to rely on AI for coding?",
    a: "Relying on AI isn't bad — passive reliance is. There's nothing wrong with leaning on a tool that makes you faster; that's what good tools are for, and AI assistants are genuinely great and clearly here to stay. The problem isn't the reliance itself, it's the mode: accepting output you don't understand, over and over, until the understanding stops happening at all. That's where two real costs show up. In the short term, you own and ship code you can't reason about, which makes it hard to debug and easy to break. In the long term there's skill atrophy — the 'use it or lose it' effect where the muscles that make you a developer weaken from disuse, silently, because nothing feels wrong until you hit a problem the AI can't solve. So the honest framing isn't 'AI good' or 'AI bad'; it's that using AI actively (reading, questioning, understanding) keeps you sharp, while using it passively (accepting without understanding) is what erodes you. Same tool, opposite outcomes, and the difference is entirely in how you use it.",
  },
  {
    q: "How do I use AI without losing my coding skills?",
    a: "Keep the loop closed instead of skipping it — you can move fast and stay sharp at the same time, they aren't in tension. The core habit is to never accept code you don't understand: read the actual diff before you accept it, and be able to explain each change back in your own words (if you can't teach it, you don't own it yet). Use the AI as a tutor, not just an answer machine — ask why it chose this, what the trade-offs are, what would break — which turns a passive answer into an active lesson. Do the occasional piece by hand to keep the muscle, and give yourself a few minutes to reason through a bug before pasting it in. Keep your fundamentals warm, because they're what let you catch the AI when it's confidently wrong. And close the loop with active recall — revisit what you shipped and quiz yourself, so understanding in the moment becomes knowledge you keep. None of this means using AI less; it means staying mentally switched on while you do. That's the whole difference between AI amplifying your abilities and AI quietly replacing them.",
  },
  {
    q: "How does Covate help me stay sharp while using AI?",
    a: "Covate automates the single most important habit on this list — understanding each change before you move on — so it happens by default instead of only when you remember to. It's a free, open-source MCP tool that plugs into your AI coding assistant (Claude, Cursor, Copilot and others), watches what actually changes in your codebase, and turns your real diffs into short, targeted quizzes about the concepts, APIs, edge cases, and trade-offs in the change — blocking further generation until you answer. In other words, it forces the active mode this article is about, at the exact moment it matters: right after the code is generated, while the context is fresh, so you can't quietly slip into accepting things you don't understand. Every session is saved, and the sync client pushes them into your learning ledger on covate.org — free, no payment — where you can review every past session, your running accuracy, and the topics you keep getting wrong — which is the active-recall habit, handled for you. The result is that using AI turns into a way to stay sharp and get better, instead of a slow drift toward dependence.",
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
    dateModified: "2026-08-27",
    mainEntityOfPage: { "@type": "WebPage", "@id": URL },
    author: { "@id": SITE + "#organization" },
    publisher: { "@id": SITE + "#organization" },
    about: { "@type": "Thing", name: "avoiding over-reliance on AI when coding" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn/how-to-avoid-over-relying-on-ai-when-coding" },
      { "@type": "ListItem", position: 3, name: "Avoid over-relying on AI when coding", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function AvoidOverRelyingOnAi() {
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
            How to avoid over-relying on AI when coding
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            You use AI coding assistants, you like them, and you&apos;re not giving them up — good, and this isn&apos;t an
            argument that you should. The worry underneath &ldquo;am I too dependent on this?&rdquo; is real, but the
            problem was never <em>using</em> AI. It&apos;s using it <em>passively</em> — accepting output you don&apos;t
            understand until the understanding stops happening at all. Here&apos;s how to spot that drift, why it matters,
            and a concrete set of habits to keep your edge while you keep shipping with AI.
          </p>
          <p className="mt-4 font-mono text-xs text-dim">By the Covate team · Updated August 5, 2026</p>
        </header>

        <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <p>
              Let&apos;s start where most takes on this don&apos;t: AI coding assistants are genuinely great, and they
              aren&apos;t going anywhere. They make you faster, they remove a lot of drudgery, and being fluent with them
              is now part of the job. So this isn&apos;t a &ldquo;put down the tools&rdquo; piece. The goal is the
              opposite — to help you keep using them heavily <em>and</em> keep your edge, which turns out to be entirely
              possible once you see what actually causes the erosion people are afraid of.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The real problem isn&apos;t using AI — it&apos;s using it passively</h2>
            <p className="mt-4">
              There are two ways to use an AI assistant, and they lead to opposite places. <strong>Active use</strong> is
              reading what it produced, questioning it, and understanding each change before you move on — the tool
              amplifies you. <strong>Passive use</strong> is accepting output you don&apos;t understand, over and over,
              until the understanding stops happening at all — the tool slowly replaces you. It&apos;s the same assistant
              and the same speed; the only difference is whether your brain is switched on while you drive.
            </p>
            <p className="mt-4">
              Passive use is dangerous precisely because it&apos;s comfortable. Two well-understood effects are at work.
              One is <strong>automation complacency</strong>: when a tool is usually right, trust quietly substitutes for
              vigilance, and you stop checking. The other is <strong>skill atrophy</strong> — the plain &ldquo;use it or
              lose it&rdquo; effect, where abilities decline from disuse. Neither feels like anything while it&apos;s
              happening. That&apos;s the trap: over-reliance doesn&apos;t announce itself. You just notice one day that a
              problem the AI can&apos;t solve now feels a lot harder than it should.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Signs you might be over-relying on AI</h2>
            <p className="mt-4">
              None of these are verdicts, and you don&apos;t need all of them to take the hint. Read them as a check
              engine light, not a diagnosis:
            </p>
            <ul className="mt-5 space-y-3">
              <li className="rounded-xl border border-border bg-surface/40 p-4 text-sm leading-7 text-secondary">
                <strong className="text-primary">You can&apos;t explain your own recent code.</strong> Something you
                &ldquo;wrote&rdquo; with AI last week would take a re-read to understand — you supervised it, you
                didn&apos;t absorb it.
              </li>
              <li className="rounded-xl border border-border bg-surface/40 p-4 text-sm leading-7 text-secondary">
                <strong className="text-primary">You panic when the AI is unavailable.</strong> A rate limit, an outage,
                or working offline feels less like an inconvenience and more like you can&apos;t work at all.
              </li>
              <li className="rounded-xl border border-border bg-surface/40 p-4 text-sm leading-7 text-secondary">
                <strong className="text-primary">You can&apos;t debug without pasting it in.</strong> Your first move on
                any error is to hand the whole thing to the AI, rather than forming a hypothesis about what&apos;s wrong.
              </li>
              <li className="rounded-xl border border-border bg-surface/40 p-4 text-sm leading-7 text-secondary">
                <strong className="text-primary">You haven&apos;t written anything non-trivial unaided in a while.</strong>{" "}
                It&apos;s been a long time since you built something of substance without autocomplete or a prompt in the
                loop.
              </li>
              <li className="rounded-xl border border-border bg-surface/40 p-4 text-sm leading-7 text-secondary">
                <strong className="text-primary">Your fundamentals feel rusty.</strong> Recalling an API from memory,
                reasoning about complexity, or tracing a bug takes noticeably more effort than it used to.
              </li>
            </ul>
            <p className="mt-5">
              If a few of these landed, don&apos;t spiral — this is reversible. Skills come back with use, and the fix is
              a handful of small habits, not abstinence. (For the &ldquo;does AI actually make you worse?&rdquo; question
              underneath all this, we made the full case both ways in{" "}
              <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                does using AI make you a worse programmer?
              </a>{" "}
              — this piece is the practical answer to the follow-up: okay, how do I avoid it?)
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Why staying sharp still matters</h2>
            <p className="mt-4">
              It&apos;s worth being clear-eyed about the stakes, because &ldquo;keep learning&rdquo; can sound like a
              moral lecture when it&apos;s really just self-interest. First, <strong>you own the code.</strong> The moment
              it merges, it&apos;s yours to maintain, and you&apos;re the one debugging it at 2am when it breaks in
              production — and you can&apos;t debug what you never understood. Second, <strong>skill decay is
              silent.</strong> Nothing warns you it&apos;s happening; the gap only surfaces when you hit the problem the
              AI can&apos;t solve, which is exactly the moment you most need to be sharp. And third — the one that
              actually decides your career — <strong>judgment is what makes you valuable when everyone has the same
              AI.</strong> If the model writes the code, your worth is in knowing whether the code is any good: catching
              the confident mistake, choosing the right approach, seeing the edge case nobody prompted for. That judgment
              is built on understanding, and understanding is exactly what passive use erodes. Staying sharp isn&apos;t
              nostalgia; it&apos;s protecting the part of you the tool can&apos;t replace.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">How to stay sharp while still using AI</h2>
            <p className="mt-4">
              The good news: you don&apos;t have to use AI less to stay sharp — you have to stay <em>engaged</em> while
              you use it. Speed and skill aren&apos;t in tension; passivity is the enemy, not the tool. These six habits
              keep you in active mode without slowing you down much at all.
            </p>
            <ol className="mt-6 space-y-5">
              {HABITS.map((h) => (
                <li key={h.n} className="rounded-xl border border-border bg-surface/40 p-5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm text-accent">{h.n}</span>
                    <h3 className="text-lg font-medium text-primary">{h.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-secondary">{h.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6">
              Notice the common thread: every habit is a way of keeping your brain switched on at the moment code enters
              your codebase, instead of switching it off. You can adopt them all or start with the first one — reading
              before you accept — and still change the trajectory. The point isn&apos;t discipline for its own sake;
              it&apos;s that a minute of real attention now is what keeps you the person driving, not the person being
              driven.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Stay sharp on autopilot — with Covate</h2>
            <p className="mt-4 text-secondary">
              The hardest part of these habits is remembering to do them when you&apos;re moving fast. Covate automates
              the most important one — understanding each change before you move on — so it happens by default. It&apos;s
              a free, open-source MCP tool that plugs into your AI assistant (Claude, Cursor, Copilot and others),
              watches what actually changes, and turns your real diffs into short, targeted quizzes about the concepts,
              edge cases, and trade-offs — blocking further generation until you answer, so you can&apos;t quietly slip
              into accepting things you don&apos;t understand. Every session is saved; the free{" "}
              <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
                Covate learning ledger
              </a>{" "}
              takes them from there: sign in with GitHub and every synced session, your running accuracy, and the
              topics you keep getting wrong are there to review. Nothing to buy.
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
              <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                Does using AI make you a worse programmer? An honest look →
              </a>
              <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to actually learn from AI-generated code (without skill decay) →
              </a>
              <a href="/learn/what-is-vibe-coding" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                What is vibe coding? Meaning, origin, and when to use it →
              </a>
            </div>
          </section>
        </article>

        <ArticleBackLink href={SITE} label="← Back to Covate" />
      </main>
    </div>
  );
}
