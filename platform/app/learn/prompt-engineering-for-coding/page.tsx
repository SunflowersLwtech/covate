import type { Metadata } from "next";
import { GITHUB, SITE } from "../../layout";
import { SignInCta } from "../../SignInCta";

const PATH = "/learn/prompt-engineering-for-coding";
const URL = SITE + PATH;

const TITLE = "Prompt Engineering for Coding: How to Get Better Code from AI";
const DESCRIPTION =
  "AI coding assistants are only as good as what you ask them. A practical guide to prompt engineering for coding — how to give context, be specific, set constraints, ask for a plan, and iterate — to get usable code from Claude, Cursor, Copilot and ChatGPT, and why you still have to understand and verify what comes back.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "prompt engineering for coding",
    "how to prompt AI to write code",
    "better prompts for Copilot Cursor Claude",
    "AI coding prompts",
    "prompt engineering developers",
    "get better code from ChatGPT",
    "coding with AI assistants tips",
    "how to write code with AI",
  ],
  alternates: { canonical: PATH },
  openGraph: { type: "article", siteName: "Covate", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const STEPS = [
  {
    n: "01",
    title: "Give it context, not just a task",
    body: "The single biggest lever. An AI assistant can't read your codebase's mind — so tell it the language, framework and versions, the file or function it's editing, the conventions you follow, and the constraints it's working under. Best of all, paste the actual code it's modifying (and the relevant surrounding code) rather than describing it. Vague context in, plausible-but-wrong code out; rich, specific context in, usable code out.",
  },
  {
    n: "02",
    title: "Be specific about the what — and the how much",
    body: "\"Make this better\" gets you a vague, sprawling answer. Say exactly what to change, what to leave alone, and how big the change should be (one function, not a whole refactor). Spell out the inputs and expected outputs, the edge cases to handle, and the behaviour you want. Precision in the request is what turns a generic Stack-Overflow-style answer into code that fits your actual problem.",
  },
  {
    n: "03",
    title: "State the constraints and the non-goals",
    body: "AI over-helps by default — it'll add dependencies, rename things, reformat files and 'improve' code you didn't ask it to touch. Head that off with explicit constraints: \"don't add new dependencies,\" \"keep the existing style,\" \"don't change the public API,\" \"only touch this function.\" Telling it what not to do is as important as telling it what to do, and keeps the diff small and reviewable.",
  },
  {
    n: "04",
    title: "Ask for a plan before the code",
    body: "For anything non-trivial, add: \"Before writing code, outline your approach in a few bullets.\" It lets you catch a wrong direction before the model generates 200 lines built on it. Redirecting a three-line plan costs seconds; redirecting a finished implementation costs a frustrating back-and-forth. Approve the plan, then ask it to implement.",
  },
  {
    n: "05",
    title: "Show an example (few-shot)",
    body: "Examples convey your intent better than description ever can. Point the model at an existing function in your codebase that has the pattern and style you want, paste a sample of the desired output format, or show it one passing test. \"Write the others like this one\" is a remarkably effective prompt — it anchors the model to your conventions instead of its generic defaults.",
  },
  {
    n: "06",
    title: "Iterate in small steps, not one mega-prompt",
    body: "Resist the urge to ask for everything at once. A prompt that tries to build a whole feature produces a large diff that's hard to review and more likely to be wrong somewhere. Ask for one focused change, review and accept it, then ask for the next. Small, sequential prompts keep each diff correct and understandable — and they're easier to steer when the model drifts.",
  },
  {
    n: "07",
    title: "Verify — the prompt never guarantees correctness",
    body: "This is the one that matters most. Even a perfectly engineered prompt produces plausible code that can be subtly, confidently wrong. Read it, run it, test it, check the edge cases. Good prompting makes the AI faster and more on-target; it does not make it right. The prompt gets you a strong first draft — you're still the one responsible for what ships.",
  },
] as const;

const FAQ = [
  {
    q: "What is prompt engineering for coding?",
    a: "Prompt engineering for coding is the skill of writing clear, context-rich requests that get usable code out of an AI assistant like Claude, Cursor, Copilot or ChatGPT. In practice it comes down to a handful of habits: give the model real context (the language, framework, the actual code it's editing, your conventions); be specific about what to change and how much; state constraints and non-goals so it doesn't over-help; ask for a plan before the code on anything non-trivial; show an example of the pattern you want; iterate in small steps rather than one giant prompt; and always verify the result. It's a genuinely useful skill — but it's a way to get a better first draft faster, not a way to skip understanding the code.",
  },
  {
    q: "How do I get better code from ChatGPT, Copilot, Cursor or Claude?",
    a: "Start with context: paste the actual code being changed and tell the model the framework, versions and conventions, rather than describing the problem abstractly. Then be specific — say exactly what to change, what to leave untouched, and the scope (one function, not a refactor), including the edge cases you care about. Add explicit constraints ('no new dependencies,' 'keep this style,' 'don't change the API') because AI assistants add and rename things by default. For bigger tasks, ask for a short plan first so you can catch a wrong approach early, and give an example of the pattern or output format you want. Work in small, reviewable steps instead of one mega-prompt. And read, run and test whatever it produces — better prompting improves the odds, but it never guarantees the code is correct.",
  },
  {
    q: "Does prompt engineering replace knowing how to code?",
    a: "No — it multiplies coding skill rather than replacing it. Better prompts get you better output, but to write a good prompt you often need to understand the domain well enough to specify the what, the constraints and the edge cases; and to use the output safely you have to be able to read it, judge whether it's right, and catch the subtle bugs and insecure patterns that plausible-looking AI code can contain. Someone who understands the code writes sharper prompts and reviews the results faster and more reliably than someone who doesn't. So prompt engineering is a real and worthwhile skill, but it sits on top of programming understanding — it doesn't remove the need for it.",
  },
  {
    q: "How does Covate help me code with AI?",
    a: "Prompt engineering gets you good code faster; Covate makes sure you actually understand the code you're shipping. It's a free, open-source MCP tool that plugs into your AI coding assistant (Claude, Cursor, Copilot and others), watches what actually changes in your codebase, and turns your real diffs into short, targeted quizzes about the concepts, APIs, edge cases and trade-offs — blocking further generation until you can answer. In other words, no matter how good your prompt was, Covate checks that you can explain what you just generated, at the moment the context is fresh. The sync client then pushes them into your learning ledger on covate.org — free, no payment — where you can review every past session, your running accuracy, and the topics you keep getting wrong — so better prompting turns into compounding understanding, not just faster shipping of code you don't follow.",
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
    about: { "@type": "Thing", name: "prompt engineering for AI-assisted coding" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learning Center", item: SITE + "/learn" },
      { "@type": "ListItem", position: 3, name: "Prompt engineering for coding", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function PromptEngineeringForCoding() {
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
            Prompt engineering for coding
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            AI coding assistants are only as good as what you ask them. The gap between a vague prompt
            (plausible-but-wrong code) and a precise one (code you can actually use) is a learnable
            skill. Here&apos;s a practical guide to prompting AI coding tools well — give context, be
            specific, set constraints, plan first, iterate — and why you still have to understand and
            verify whatever comes back.
          </p>
          <p className="mt-4 font-mono text-xs text-dim">By the Covate team · Updated August 5, 2026</p>
        </header>

        <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <p>
              &ldquo;Prompt engineering&rdquo; sounds fancier than it is. For coding, it&apos;s really
              just the difference between asking a talented but literal-minded pair-programmer to
              &ldquo;make this better&rdquo; and giving them enough context and direction to actually
              help. Get it right and an AI assistant produces a strong first draft fast; get it wrong
              and you get confident, generic code that doesn&apos;t fit your system. These seven habits
              cover most of the gap.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Seven habits of good coding prompts</h2>
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
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Good prompting isn&apos;t the same as understanding</h2>
            <p className="mt-4">
              Here&apos;s the trap. Prompt engineering is a <strong>productivity</strong> skill — it
              helps you get more, better code, faster. But shipping code faster makes it easier to ship
              code you don&apos;t actually understand, which is where AI-assisted development quietly
              erodes your skills. Understanding is a separate, <strong>competence</strong> skill, and the
              best developers have both: they prompt precisely <em>and</em> they can explain what comes
              back. A great prompt gets you a great draft — it doesn&apos;t excuse you from reading it.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Prompt well — then make sure you understand it, with Covate</h2>
            <p className="mt-4 text-secondary">
              However good your prompt, you still have to understand what the AI generated. Covate builds
              that check into your workflow. It&apos;s a free, open-source MCP tool that plugs into your
              AI assistant (Claude, Cursor, Copilot and others), watches what actually changes, and turns
              your real diffs into short, targeted quizzes about the concepts, edge cases and trade-offs —
              blocking further generation until you can answer. Every session is saved; the free{" "}
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
              <a href="/learn/how-to-review-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to review AI-generated code before you merge it →
              </a>
              <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to actually learn from AI-generated code (without skill decay) →
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
