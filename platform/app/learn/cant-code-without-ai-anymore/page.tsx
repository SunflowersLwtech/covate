import type { Metadata } from "next";
import { GITHUB, SITE } from "../../lib/site";
import { Evidence } from "../../_geo/Evidence";
import { SignInCta } from "../../SignInCta";
import { NAV, SiteHeader } from "../../_components/SiteHeader";
import { Breadcrumb } from "../../_components/Breadcrumb";
import { ArticleBackLink } from "../../_components/ArticleBackLink";

const PATH = "/learn/cant-code-without-ai-anymore";
const URL = SITE + PATH;

const TITLE = "I Can't Code Without AI Anymore — What to Do";
const DESCRIPTION =
  "If writing code without an AI assistant now feels impossible, the fix is deliberate re-exposure, not quitting cold turkey: rebuild the skill of writing small pieces yourself, on a schedule, starting with code you already understand. How to diagnose what you actually lost and rebuild it in weeks.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "can't code without AI anymore",
    "dependent on AI coding",
    "AI coding dependency",
    "lost coding skills to AI",
    "skill decay from AI assistants",
    "rebuild coding skills after AI",
    "how to code without AI again",
  ],
  alternates: { canonical: PATH },
  openGraph: { type: "article", siteName: "Covate", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const DIAGNOSIS = [
  {
    n: "01",
    title: "Syntax recall: the words won't come",
    body: "You know what you want to express but can't produce the loop, the regex, the SQL join without prompting. This is the most common loss and the shallowest — it fades because typing syntax became optional. It comes back fastest with small, frequent reproduction exercises: write the same helper from scratch three days in a row.",
  },
  {
    n: "02",
    title: "Decomposition: you can't break the problem down",
    body: "Harder to notice, and more damaging: you've stopped practice of splitting a fuzzy requirement into steps, data structures, and interfaces — the AI does that invisibly. Test: take a small feature and write only the plan — no code — in 15 minutes. If the plan is hand-wavy, this is the muscle to rebuild first, because every senior-level skill sits on top of it.",
  },
  {
    n: "03",
    title: "Debugging: you can't find bugs without asking",
    body: "You paste stack traces into the AI instead of reading them. Debugging is learned by struggling productively — forming a hypothesis, isolating it, testing it. If that loop now always routes through the assistant, start with a rule: for any bug under an hour old, you read the trace and form one hypothesis yourself before asking.",
  },
  {
    n: "04",
    title: "Codebase knowledge: you don't know your own system",
    body: "The quiet one. AI writes code into files you rarely open, and six months later you can't explain how your own project works. This isn't a typing problem — it's a reading problem, and it's the one that hurts most in incidents and interviews. The rebuild is a reading routine, not a writing one.",
  },
] as const;

const FAQ = [
  {
    q: "Is dependence on AI coding assistants permanent?",
    a: "No — but it doesn't fade on its own either, because your daily workflow keeps reinforcing it. What decays without use is recall (producing syntax, decomposing problems, debugging solo), and recall comes back through practice, not through reading. Most developers who deliberately rebuild report noticeable change in a few weeks of short daily exercises, with the biggest gains from re-deriving solutions they already understand rather than tackling fresh problems cold. The dependency loop breaks the moment you can honestly say 'I could write this myself, and I'm choosing to delegate it' — that's tool use, not dependence.",
  },
  {
    q: "Should I stop using AI completely to fix this?",
    a: "That treats the wrong cause. The problem isn't AI writing your code — it's you never engaging with what it writes. Quitting cold turkey mostly makes you slower at boilerplate without rebuilding understanding, and almost nobody sustains it. The sustainable pattern is deliberate re-exposure: pick the categories where being helpless costs you most (core logic, debugging, your own architecture) and rebuild those by hand, while continuing to delegate boilerplate and well-understood patterns. The goal is being able to code without AI, then choosing to use it anyway.",
  },
  {
    q: "How long does it take to rebuild coding skills after relying on AI?",
    a: "It depends on how deep the atrophy is, but for most working developers the realistic timeline is two to six weeks of short daily practice — 15 to 30 minutes — before unassisted work stops feeling foreign. Syntax recall returns fastest (days). Problem decomposition takes a few weeks of planning exercises. Codebase knowledge accrues in parallel every time you read a diff instead of skimming it. The trap is trying to measure progress in a weekend marathon; the mechanism that restores recall is spaced, repeated retrieval, not one long cram session.",
  },
  {
    q: "How is this different from just being rusty?",
    a: "Ordinary rust happens when you stop using a skill — you take a break from SQL, you forget SQL. AI-dependence rust happens while you're shipping every day, which is why it's sneaky: your output looks fine, reviews pass, features land. The skill that atrophied is the invisible middle of the process (planning, recall, verification) while the visible parts (working software) kept improving. That's also why it often surfaces at the worst time — in an interview, during an incident when the assistant isn't available, or when the AI's suggestion is wrong and you can't tell.",
  },
  {
    q: "How does Covate help with AI dependence?",
    a: "Covate attacks the specific mechanism behind the decay: passive acceptance. It's a free, open-source MCP tool that plugs into your AI coding assistant (Claude, Cursor, Copilot and others), watches what actually changes in your codebase, and turns your real diffs into short, targeted quizzes — blocking further generation until you answer. That converts the moment of maximum dependence (the AI just wrote something) into the moment of retrieval practice. Sessions sync into a learning ledger on covate.org — sign in with GitHub, nothing to buy — showing your running accuracy and the topics you keep getting wrong, so the rebuild effort goes where the gaps actually are.",
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
    about: { "@type": "Thing", name: "recovering coding skills after AI dependence" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn" },
      { "@type": "ListItem", position: 3, name: "Can't code without AI anymore", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function CantCodeWithoutAi() {
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
            &ldquo;I can&rsquo;t code without AI anymore&rdquo; — what to actually do about it
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            The fix is deliberate re-exposure, not quitting cold turkey: rebuild the skill of writing small pieces of
            code yourself, on a schedule, starting with code you already understand — while keeping AI for what it&rsquo;s
            genuinely good at. Here&rsquo;s how to diagnose exactly what you lost and rebuild it in weeks.
          </p>
          <p className="mt-4 font-mono text-xs text-dim">By the Covate team · Updated August 16, 2026</p>
        </header>

        <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <p>
              It usually dawns on you at an inconvenient moment: the assistant is down, or you&rsquo;re in an interview,
              or you open a blank file and realize you don&rsquo;t know where to start without a prompt. Months of
              accepting generated code were frictionless — and somewhere in there, the ability to produce code
              unaided quietly left. If that&rsquo;s you: it&rsquo;s common, it&rsquo;s reversible, and the recovery
              plan is shorter than the decline was.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">First, diagnose what you actually lost</h2>
            <p className="mt-4">
              &ldquo;Can&rsquo;t code without AI&rdquo; is four different problems wearing one coat, and they have
              different fixes. Run yourself through these honestly:
            </p>
            <ol className="mt-6 space-y-5">
              {DIAGNOSIS.map((c) => (
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
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The rebuild: re-derivation, not new projects</h2>
            <p className="mt-4">
              The fastest known way to restore a decayed skill is retrieval practice on material you once knew —
              not heroically starting fresh projects. Concretely: take a function, module, or SQL query the AI wrote
              for you recently, close it, and rewrite it from memory of its purpose (not its text). Then diff your
              version against the AI&rsquo;s. The gaps you see <em>are</em> your curriculum. Fifteen to thirty
              minutes a day beats a weekend marathon, because spacing — not intensity — is what moves material into
              durable memory.
            </p>
            <p className="mt-4">
              Pair that with a decomposition warm-up: before delegating any task today, write the three-step plan
              yourself first. You can still hand the plan to the AI afterwards. The difference is that the
              architecture decision — the part that is actually you — happens in your head before it happens in
              the prompt.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Keep AI, change your role in the loop</h2>
            <p className="mt-4">
              The end state isn&rsquo;t avoiding AI — it&rsquo;s being the kind of developer who could do it
              unaided and delegates deliberately. Three role changes get you there: ask for explanations before
              code (&ldquo;walk me through how you&rsquo;d solve this&rdquo;) so the reasoning reaches you first;
              treat every generated diff as a comprehension test you must pass before merging; and keep a running
              note of what you keep getting wrong — that list is your practice queue, and seeing it honestly is
              half the battle. We wrote about the habit side of this in{" "}
              <a href="/learn/how-to-avoid-over-relying-on-ai-when-coding" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                how to avoid over-relying on AI when coding
              </a>{" "}
              and the evidence behind it in{" "}
              <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                does using AI make you a worse programmer?
              </a>.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Turn the recovery into a habit — with Covate</h2>
            <p className="mt-4 text-secondary">
              Rebuilding by willpower fails precisely when you&rsquo;re busiest. Covate automates the
              re-derivation step: it&rsquo;s a free, open-source MCP tool that plugs into your AI coding assistant
              (Claude, Cursor, Copilot and others), watches what actually changes, and turns your real diffs into
              short, targeted quizzes — blocking further generation until you answer. The free{" "}
              <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
                learning ledger
              </a>{" "}
              on covate.org then tracks each synced session, your running accuracy, and the topics you keep getting
              wrong, so your practice time goes to your actual gaps. Nothing to buy — the MCP is MIT-licensed and the
              ledger is free.
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
              <a href="/learn/how-to-avoid-over-relying-on-ai-when-coding" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to avoid over-relying on AI when coding →
              </a>
              <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                Does using AI make you a worse programmer? →
              </a>
            </div>
          </section>
        </article>

        <ArticleBackLink href={SITE} label="← Back to Covate" />
      </main>
    </div>
  );
}
