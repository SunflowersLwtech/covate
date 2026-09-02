import type { Metadata } from "next";
import { GITHUB, SITE } from "../../lib/site";
import { Evidence } from "../../_geo/Evidence";
import { SignInCta } from "../../SignInCta";
import { NAV, SiteHeader } from "../../_components/SiteHeader";
import { Breadcrumb } from "../../_components/Breadcrumb";
import { ArticleBackLink } from "../../_components/ArticleBackLink";

const PATH = "/learn/code-reading-routine-for-ai-heavy-teams";
const URL = SITE + PATH;

const TITLE = "A Code Reading Routine for AI-Heavy Teams";
const DESCRIPTION =
  "When most merged code is AI-generated, reading has to become a scheduled routine instead of an occasional act: a weekly changed-surface review, diff-first standups, and a shared weak-spot list. A concrete routine any team can run in about an hour a week.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "code reading routine",
    "AI heavy team practices",
    "team code review AI",
    "understanding AI generated code as a team",
    "engineering team AI workflow",
    "shared code understanding",
  ],
  alternates: { canonical: PATH },
  openGraph: { type: "article", siteName: "Covate", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const ROUTINE = [
  {
    n: "01",
    title: "Weekly: read the changed surface, not everything",
    body: "Once a week, the team reads everything that landed — as diffs, not files. The unit of AI-assisted work is the change, and a week of diffs is readable in 30–45 minutes on a healthy team. Each person picks one change they can't explain and brings it to the review. That list is the team's real understanding debt, ranked by what actually confuses people.",
  },
  {
    n: "02",
    title: "Standup, diff-first",
    body: "Swap 'what are you working on' for 'what changed yesterday and why'. Thirty seconds per person, with the diff open. It's the cheapest possible synchronization: the team hears the reasoning behind generated code while it's fresh, and 'I merged something I can't explain' becomes visible immediately instead of six months later in an incident.",
  },
  {
    n: "03",
    title: "Rotate the explainer role",
    body: "For each significant change, one person — not the author — explains it to the team in two minutes: what it does, why this approach, what the edge cases are. Rotation matters: the person who most wants to skip it is the person who benefits most. If nobody can explain a change, that's a finding, and it goes on the weak-spot list.",
  },
  {
    n: "04",
    title: "Keep one shared weak-spot list",
    body: "A single document tracking the concepts, modules, and patterns the team keeps getting wrong — seeded from review comments, quiz results, and the questions nobody could answer in standup. It replaces the vague feeling that 'we should understand the payments module better' with a ranked queue the team can actually work through.",
  },
  {
    n: "05",
    title: "Quarterly: read one core module end to end",
    body: "Pick the module you'd least like to debug in production and schedule a session to read it together, top to bottom, no laptops open for writing. Old-fashioned, and it works. The goal isn't memorization — it's having walked the real paths once, so future diffs in that area have somewhere to attach to.",
  },
] as const;

const FAQ = [
  {
    q: "Why do AI-heavy teams need a code reading routine at all?",
    a: "Because the natural equilibrium without one is that nobody reads. When code arrives fast and mostly works, review pressure drops, each person understands only their own slices, and the shared mental model of the system quietly decays. The routine exists to keep the team's collective understanding growing at the same rate the codebase grows — reading is the only mechanism that does that, and scheduling it is what makes it survive deadline weeks.",
  },
  {
    q: "How much time does this routine actually cost?",
    a: "About an hour per person per week: 30–45 minutes of reading the week's diffs plus a standup addition of a few seconds per person, and a rotating two-minute explainer role. The quarterly module read is an hour for the whole team. Against that, teams routinely lose multiple hours to a single incident in code nobody understands — the routine is the cheaper side of that trade.",
  },
  {
    q: "What's the difference between this and normal code review?",
    a: "Review asks 'can this merge?' — a gate, focused on the change, usually under time pressure, and it stops the moment the answer is yes. A reading routine asks 'do we understand what we now own?' — a practice, focused on the team, with no gate to pass. AI-heavy teams need both, but the second is the one that atrophies silently, because nothing in the merge process forces it to happen.",
  },
  {
    q: "How do you get buy-in from engineers who see this as overhead?",
    a: "Start with the artifacts the routine produces, not the routine itself: the weak-spot list and the weekly 'change nobody could explain' findings make the cost of the status quo visible within a couple of weeks. Keep the timeboxes strict — the routine dies the first time a weekly read becomes a two-hour meeting — and let the team pick what to read first. Reading the module everyone already fears debugging needs no mandate.",
  },
  {
    q: "How does Covate support a team reading routine?",
    a: "Covate automates the part of the routine that depends on individual discipline. Its open-source MCP plugs into each developer's AI coding assistant (Claude, Cursor, Copilot and others), watches what actually changes, and turns real diffs into short, targeted quizzes — blocking further generation until answered — so every teammate engages with every change they ship. Sessions sync into the free learning ledger on covate.org (sign in with GitHub, nothing to buy), showing per-person accuracy and weakest topics: the team's weak-spot list, assembled automatically instead of by memory.",
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
    about: { "@type": "Thing", name: "code reading routines for teams using AI" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: "Learn", item: SITE + "/learn" },
      { "@type": "ListItem", position: 3, name: "Code reading routine", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": URL + "#faq",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function CodeReadingRoutine() {
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
            A code reading routine for AI-heavy teams
          </h1>
          <p className="mt-5 text-lg leading-8 text-secondary">
            When most merged code is AI-generated, reading has to become a scheduled routine instead of an occasional
            act: a weekly changed-surface review, diff-first standups, and one shared weak-spot list. Here&rsquo;s a
            concrete routine any team can run in about an hour a week.
          </p>
          <p className="mt-4 font-mono text-xs text-dim">By the Covate team · Updated August 16, 2026</p>
        </header>

        <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
          <section>
            <p>
              Something specific happens to a team when most of its merged code is generated: writing stops being the
              bottleneck, so the shared picture of the system — who understands what, and how fresh that understanding
              is — becomes the thing that actually limits the team. Code review keeps the quality gate, but review
              asks <em>can this merge?</em>, not <em>do we understand what we now own?</em> The second question only
              gets answered if someone schedules time for it. That&rsquo;s the entire argument for a reading routine:
              it&rsquo;s the standing answer to a question nothing else in the workflow will ask.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">The routine, in five parts</h2>
            <ol className="mt-6 space-y-5">
              {ROUTINE.map((c) => (
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
            <h2 className="text-2xl font-semibold tracking-tight text-primary">What the routine is not</h2>
            <p className="mt-4">
              It is not a blame mechanism. If the weekly read surfaces a change nobody can explain, the finding is
              about the workflow that merged it invisibly, not about the person who shipped it — in an AI-heavy team,
              the honest baseline is that everyone ships some things they don&rsquo;t fully understand yet, and the
              routine exists to shrink that set deliberately. It is also not a replacement for individual review
              discipline, which we cover in{" "}
              <a href="/learn/how-to-review-ai-generated-code" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                how to review AI-generated code before you merge it
              </a>{" "}
              — that&rsquo;s the per-change skill; this is the team-level habit that keeps it from eroding. And it is
              not a big meeting: every piece of it dies if it stops fitting its timebox.
            </p>
          </section>

          {/* Product CTA */}
          <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Automate the per-person part — with Covate</h2>
            <p className="mt-4 text-secondary">
              The routine&rsquo;s weak link is always individual discipline on busy weeks. Covate removes that
              dependency: it&rsquo;s a free, open-source MCP tool that plugs into each developer&rsquo;s AI coding
              assistant (Claude, Cursor, Copilot and others), watches what actually changes, and turns real diffs
              into short, targeted quizzes — blocking further generation until answered. Sessions sync into the free{" "}
              <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
                learning ledger
              </a>{" "}
              on covate.org — sign in with GitHub, nothing to buy — where per-person accuracy and weakest topics
              become the team&rsquo;s weak-spot list, assembled from evidence instead of memory.
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
              <a href="/learn/how-to-learn-a-new-codebase-fast" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
                How to learn a new codebase fast →
              </a>
            </div>
          </section>
        </article>

        <ArticleBackLink href={SITE} label="← Back to Covate" />
      </main>
    </div>
  );
}
