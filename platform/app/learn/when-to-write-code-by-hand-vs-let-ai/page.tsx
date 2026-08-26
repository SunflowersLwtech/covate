import type { Metadata } from "next";
import { GITHUB, SITE } from "../../layout";
import { Evidence } from "../../_geo/Evidence";
import { SignInCta } from "../../SignInCta";

const PATH = "/learn/when-to-write-code-by-hand-vs-let-ai";
const URL = SITE + PATH;

const TITLE = "When to Write Code by Hand vs. Let AI Write It";
const DESCRIPTION =
  "Write it yourself when the goal is learning, the logic is tricky, or the code is central to your system; let AI write it when it's boilerplate, a well-understood pattern, or something you could trivially verify. A decision framework for the split that actually matters.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "when to write code by hand",
    "when to let AI write code",
    "hand write vs AI generated code",
    "should I write code myself or use AI",
    "AI coding decision framework",
    "what code to delegate to AI",
  ],
  alternates: { canonical: PATH },
  openGraph: { type: "article", siteName: "Covate", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const CASES = [
  {
    n: "01",
    title: "Let AI write it: boilerplate and glue",
    body: "Configuration files, CRUD endpoints, migrations, import statements, test scaffolding, that logging wrapper you've written forty times. The cost of not understanding this code is near zero because you've understood it in every previous job you've had — it transfers. Delegating it is exactly what a power tool is for.",
  },
  {
    n: "02",
    title: "Let AI write it: well-understood patterns you can verify at a glance",
    body: "Sorting with a custom comparator, a debounce function, a date formatter, a standard retry loop. You could write these, and you can review them in seconds because you know exactly what correct looks like. The verification cost is trivial — which is the entire justification for delegating.",
  },
  {
    n: "03",
    title: "Write it yourself: the core logic of what you're building",
    body: "The algorithm inside the feature, the state machine, the pricing calculation, the parser. This is the part where a subtle bug costs the most and where understanding is the product. If you can't re-derive this code on a whiteboard a week later, you don't own your feature — the AI does, and it has moved on.",
  },
  {
    n: "04",
    title: "Write it yourself: anything you'd debug at 2am",
    body: "Concurrency, caching invalidation, timezone handling, anything touching money or auth. When these break in production, you will be reading them without an assistant's full context and under pressure. Code you may have to fix live is code you should have written, or at least rewritten by hand once after understanding it.",
  },
  {
    n: "05",
    title: "Write it yourself: when learning is the point",
    body: "New language, new framework, new domain — if the goal is to internalize it, generating your way through defeats the purpose. The struggle of producing code by hand is not waste; it's the encoding process. Delegate after you've built the mental model, not before.",
  },
  {
    n: "06",
    title: "Hybrid: AI drafts, you rewrite the parts that matter",
    body: "The most underused pattern: let the assistant produce a first pass, then rewrite the core functions by hand before merging. You get the boilerplate for free, keep the load-bearing logic in your fingers, and the diff between draft and your version is a precise map of what you didn't know.",
  },
] as const;

const FAQ = [
  {
    q: "How do I decide whether to write code myself or use AI?",
    a: "Use two questions. First: what does it cost me if I don't understand this code later? High (core logic, money, auth, anything you'd debug under pressure) — write it yourself, or rewrite it by hand after the AI drafts it. Low (boilerplate, glue, patterns you've written many times) — delegate freely. Second: is understanding this the point of the exercise? If you're learning the language or domain, write it yourself regardless of convenience. Deciding by 'what's fastest today' instead of by these two questions is how developers end up shipping code they can't explain.",
  },
  {
    q: "Isn't it always faster to let AI write the code?",
    a: "It's faster to produce, which isn't the same as faster overall. For boilerplate, yes — the review cost is seconds and there's nothing to understand. For core logic, the time you 'save' writing is partly moved to later: debugging code you don't fully understand, reviewing changes you can only rubber-stamp, and re-learning your own system before every extension. Teams also discover that the second and third feature in the same area go faster when the first was written (or rewritten) by someone who now understands it deeply. Speed is the right metric; you just have to measure it over the whole lifecycle, not the authoring step.",
  },
  {
    q: "What kinds of code should I always write by hand?",
    a: "A practical always-hand list: anything you'd have to debug live during an incident; concurrency and anything with ordering or timing assumptions; auth, permissions, and anything touching money; the core algorithm or state machine of the feature you're building; and anything in a language, framework, or domain you're still learning. These share one property: the cost of not understanding them is paid later, at interest. Everything else is a candidate for delegation — with a real review.",
  },
  {
    q: "Does writing code by hand still matter in the age of AI?",
    a: "It matters in a changed way. Producing syntax quickly is worth much less than it was — the assistant does that adequately. What's worth more is everything around the typing: decomposing a fuzzy requirement into a design, judging whether a proposed solution is right for your system, debugging, and explaining code to teammates. Hand-writing selected code is the training method for those judgment skills, not an end in itself. We cover the shifted skill set in 'Should you still learn to code in the age of AI?'",
  },
  {
    q: "How does Covate fit into the hand-written vs. AI split?",
    a: "Covate doesn't decide for you — it makes the cost visible. It's a free, open-source MCP tool that plugs into your AI coding assistant (Claude, Cursor, Copilot and others), watches what actually changes in your codebase, and turns your real diffs into short, targeted quizzes, blocking further generation until you answer. When you delegate, the quiz verifies the understanding you'll need later; when you write by hand, the ledger on covate.org (sign in with GitHub — free, nothing to buy) tracks your accuracy and weakest topics, so you can see which hand-written practice is actually paying off.",
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
    about: { "@type": "Thing", name: "choosing between hand-written and AI-generated code" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn" },
      { "@type": "ListItem", position: 3, name: "Hand vs. AI", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function HandVsAi() {
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
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">Practical guide</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
            When to write code by hand vs. let AI write it
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            Write it yourself when the goal is learning, the logic is tricky, or the code is central to your system;
            let AI write it when it&rsquo;s boilerplate, a well-understood pattern, or something you could trivially
            verify. The mistake isn&rsquo;t choosing either — it&rsquo;s choosing by convenience instead of by what
            the code costs you to not understand.
          </p>
          <p className="mt-4 font-mono text-xs text-dim">By the Covate team · Updated August 16, 2026</p>
        </header>

        <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <p>
              The question sounds like it&rsquo;s about productivity. It&rsquo;s really about where understanding
              lives. Every line in your codebase is either something you understand well enough to debug, extend,
              and explain — or something you&rsquo;re renting. AI moves lines between those categories very
              quickly in one direction. A deliberate hand/AI split is how you keep the load-bearing lines in the
              first category while still taking the speedups.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The split, case by case</h2>
            <ol className="mt-6 space-y-5">
              {CASES.map((c) => (
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
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The rule underneath the cases</h2>
            <p className="mt-4">
              Every case above reduces to one question: <strong>what does it cost later if you don&rsquo;t
              understand this now?</strong> Boilerplate has almost no carrying cost — you&rsquo;ve understood it
              since your second job. Core logic, concurrency, auth, and money have enormous carrying cost, because
              the bill arrives during incidents, extensions, and interviews, with interest. Delegate where the
              carrying cost is low; write or rewrite where it&rsquo;s high. If you want a single heuristic to
              remember: <em>if you couldn&rsquo;t re-derive it on a whiteboard next week, either write it or
              rewrite it.</em>
            </p>
            <p className="mt-4">
              This is also the honest answer to &ldquo;will I lose my skills?&rdquo; — you lose the ones you stop
              practicing, and you choose which those are every time you delegate. The mechanics of skill decay and
              the evidence are covered in{" "}
              <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                does using AI make you a worse programmer?
              </a>, and the daily habits that keep the split healthy in{" "}
              <a href="/learn/how-to-avoid-over-relying-on-ai-when-coding" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                how to avoid over-relying on AI when coding
              </a>.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Keep the split honest — with Covate</h2>
            <p className="mt-4 text-secondary">
              Whatever you delegate, the review has to be real. Covate is a free, open-source MCP tool that plugs
              into your AI coding assistant (Claude, Cursor, Copilot and others), watches what actually changes,
              and turns your real diffs into short, targeted quizzes — blocking further generation until you
              answer — so every delegated change still passes through your understanding. Sessions sync into the
              free{" "}
              <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
                learning ledger
              </a>{" "}
              on covate.org: sign in with GitHub and see every synced session, your running accuracy, and the
              topics you keep getting wrong. Nothing to buy.
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
              <a href="/learn/how-to-review-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to review AI-generated code before you merge it →
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
