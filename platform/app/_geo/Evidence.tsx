// Shared evidence layer for covate.org.
//
// WHY THIS FILE EXISTS: every page on this site made a claim about AI-assisted
// coding and cited nothing, and every page described the product without a
// single checkable figure. An answer engine quoting a page needs both — a short
// direct answer under a question, and a number or a source it can verify.
// Keeping all of it in one module means the numbers are stated once, sourced
// once, and cannot drift page to page.
//
// EVERY figure below is either (a) read out of this repository's own source, or
// (b) quoted from a primary source whose URL returned HTTP 200 on 2026-08-27.
// Nothing here is an estimate. If a figure cannot be pointed at, it does not
// go in.
//
// Repository facts (src/covate/…):
//   4 MCP tools                  README.md "Available Tools"
//   3 quiz questions per session src/covate/server.py _generate_default_quizzes
//   7 change-type templates      src/covate/server.py quiz_templates
//   5 focus areas                src/covate/server.py learning_session focus_areas
//   10 term domains              src/covate/storage/terms_index.py
//   timeout 600s (60–7200)       src/covate/server.py:281 Field(ge=60, le=7200)
//   100 sessions kept            src/covate/config.py max_session_history
//   3 UI languages               src/covate/web/static/learning/locales/
//   Python 3.11+, MIT            pyproject.toml

export const SOURCES = [
  {
    href: "https://modelcontextprotocol.io/specification/2025-06-18",
    label: "Model Context Protocol — specification (2025-06-18)",
    note: "The protocol Covate implements. Defines how a tool is exposed to an AI assistant and how a call returns.",
  },
  {
    href: "https://arxiv.org/abs/2507.09089",
    label: "METR — Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity",
    note: "Randomized controlled trial, 16 developers, 246 tasks. Source of the 19% slowdown and the 20% / 24% self-estimates.",
  },
  {
    href: "https://survey.stackoverflow.co/2025/ai",
    label: "Stack Overflow Developer Survey 2025 — AI section",
    note: "Source of the 84% adoption, 46% distrust, 66% “almost right” and 45% debugging figures.",
  },
  {
    href: "https://dora.dev/research/2025/dora-report/",
    label: "DORA — State of AI-assisted Software Development 2025",
    note: "Google Cloud’s annual study; finds AI amplifies an organisation’s existing strengths and weaknesses rather than replacing them.",
  },
  {
    href: "https://owasp.org/www-project-top-ten/",
    label: "OWASP Top 10",
    note: "The 10 web-application risk categories to read a generated diff against before merging it.",
  },
  {
    href: "https://cwe.mitre.org/top25/",
    label: "CWE Top 25 Most Dangerous Software Weaknesses",
    note: "MITRE’s ranked list of the 25 weakness classes that cause the most real damage.",
  },
  {
    href: "https://git-scm.com/docs/git-diff",
    label: "Git — git-diff documentation",
    note: "The diff Covate reads is an ordinary git diff; the official flags for narrowing it are here.",
  },
] as const;

const H2 = "text-2xl font-semibold tracking-tight text-primary";
const H3 = "mt-8 text-lg font-medium text-primary";
const P = "mt-3 text-sm leading-7 text-secondary";
const A = "text-accent underline underline-offset-4 hover:text-accent-soft";

/**
 * Published findings about AI-assisted coding, each stated as a question with a
 * short answer and a link to the paper or survey it came from.
 */
export function ResearchEvidence() {
  return (
    <section>
      <h2 className={H2}>What does the research say about AI-written code?</h2>
      <p className={P}>
        Four primary sources, each linked below, and every figure quoted from the source rather than
        summarised second-hand. They disagree with each other in useful ways.
      </p>

      <h3 className={H3}>Does AI actually make developers faster?</h3>
      <p className={P}>
        Not always. In a 2025 randomized controlled trial, 16 experienced open-source developers predicted
        AI would cut task time by 24% and afterwards believed it had saved 20%. Measured, the same 246 tasks
        took 19% longer with AI than without.{" "}
        <a className={A} href="https://arxiv.org/abs/2507.09089" target="_blank" rel="noopener noreferrer">
          METR, arXiv:2507.09089
        </a>
      </p>

      <h3 className={H3}>Why do other studies show a large speed-up?</h3>
      <p className={P}>
        Because they measure different work. A 2023 controlled experiment found developers with GitHub
        Copilot finished a self-contained HTTP-server task 55.8% faster. That is greenfield code; the 2025
        trial used mature repositories the developers already knew well.{" "}
        <a className={A} href="https://arxiv.org/abs/2302.06590" target="_blank" rel="noopener noreferrer">
          arXiv:2302.06590
        </a>
      </p>

      <h3 className={H3}>How much do developers trust what AI writes?</h3>
      <p className={P}>
        Less every year. In the 2025 Stack Overflow Developer Survey, 84% of respondents use or plan to use
        AI tools, up from 76% in 2024 — yet 46% distrust the accuracy of the output against 33% who trust
        it, and only 3% highly trust it. Favourable sentiment fell from over 70% in 2023 and 2024 to 60%.{" "}
        <a className={A} href="https://survey.stackoverflow.co/2025/ai" target="_blank" rel="noopener noreferrer">
          Stack Overflow, 2025
        </a>
      </p>

      <h3 className={H3}>Where does AI-generated code actually go wrong?</h3>
      <p className={P}>
        The same survey ranks the frustrations: 66% cite &ldquo;AI solutions that are almost right, but not
        quite&rdquo;, 45% say debugging AI-generated code takes longer, 20% report losing confidence in their
        own problem-solving, and 16.3% say it is hard to understand how or why the code works.
      </p>

      <h3 className={H3}>Is AI-assisted code less secure?</h3>
      <p className={P}>
        In a Stanford user study, participants with an AI assistant wrote significantly less secure code than
        those without — and were more likely to believe their code was secure. Read every generated diff that
        touches input, auth or secrets against the{" "}
        <a className={A} href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener noreferrer">
          OWASP Top 10
        </a>{" "}
        and the{" "}
        <a className={A} href="https://cwe.mitre.org/top25/" target="_blank" rel="noopener noreferrer">
          CWE Top 25
        </a>
        .{" "}
        <a className={A} href="https://arxiv.org/abs/2211.03622" target="_blank" rel="noopener noreferrer">
          arXiv:2211.03622
        </a>
      </p>
    </section>
  );
}

/**
 * The comparison the whole site is really about: five ways to check you
 * understood a change, and what each one does and does not prove.
 */
export function VerificationTable() {
  return (
    <section>
      <h2 className={H2}>How can you check that you actually understood the code?</h2>
      <p className={P}>
        Five things people do after an AI writes a change, compared on what each one actually proves rather
        than on how thorough it feels.
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-dim">
              <th scope="col" className="py-3 pr-4 font-medium">Way to check</th>
              <th scope="col" className="py-3 pr-4 font-medium">What it proves</th>
              <th scope="col" className="py-3 pr-4 font-medium">Stops the AI mid-flow?</th>
              <th scope="col" className="py-3 pr-4 font-medium">Needs another person?</th>
              <th scope="col" className="py-3 pr-4 font-medium">Leaves a record?</th>
              <th scope="col" className="py-3 font-medium">Cost</th>
            </tr>
          </thead>
          <tbody className="text-secondary">
            <tr className="border-b border-border/60">
              <td className="py-3 pr-4 text-primary">Read the diff yourself</td>
              <td className="py-3 pr-4">Nothing you can check later — recognising code reads as understanding it</td>
              <td className="py-3 pr-4">No</td>
              <td className="py-3 pr-4">No</td>
              <td className="py-3 pr-4">No</td>
              <td className="py-3">Free</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-3 pr-4 text-primary">Ask the AI to explain it</td>
              <td className="py-3 pr-4">That the AI can produce an explanation, not that you followed it</td>
              <td className="py-3 pr-4">No</td>
              <td className="py-3 pr-4">No</td>
              <td className="py-3 pr-4">In the chat log only</td>
              <td className="py-3">Free</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-3 pr-4 text-primary">Human code review on the pull request</td>
              <td className="py-3 pr-4">A second person&apos;s reading — 45% of developers say reviewing and debugging AI code takes longer</td>
              <td className="py-3 pr-4">No — it happens after the code exists</td>
              <td className="py-3 pr-4">Yes</td>
              <td className="py-3 pr-4">Yes, review comments</td>
              <td className="py-3">A reviewer&apos;s time</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-3 pr-4 text-primary">Write tests for the change</td>
              <td className="py-3 pr-4">The behaviour you thought of; AI-written tests can pass tautologically</td>
              <td className="py-3 pr-4">No</td>
              <td className="py-3 pr-4">No</td>
              <td className="py-3 pr-4">Yes, the test suite</td>
              <td className="py-3">Free</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-primary">Answer questions on your own diff (Covate)</td>
              <td className="py-3 pr-4">Whether you can answer 3 questions about the change you just accepted</td>
              <td className="py-3 pr-4">Yes — the tool returns HALT_GENERATION until you answer</td>
              <td className="py-3 pr-4">No</td>
              <td className="py-3 pr-4">Yes, the learning ledger</td>
              <td className="py-3">Free, MIT</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 font-mono text-[11px] text-dim">
        The 45% figure is from the 2025 Stack Overflow Developer Survey; the Covate row is read from this
        repository&apos;s source, not estimated.
      </p>
    </section>
  );
}

/** Checkable facts about the tool itself, in question form. */
export function CovateFacts() {
  return (
    <section>
      <h2 className={H2}>What exactly does Covate install and do?</h2>
      <p className={P}>
        Everything below is read from the open-source repository, so you can check each number against the
        code before you install anything.
      </p>

      <h3 className={H3}>What does the MCP server actually add?</h3>
      <p className={P}>
        4 tools: <code>learning_session</code> (quizzes you on recent changes),{" "}
        <code>debug_search</code> and <code>debug_record</code> (a per-project debugging memory), and{" "}
        <code>term_get</code> (concept lookups across 10 domains). It needs Python 3.11+, binds to
        127.0.0.1, and is MIT-licensed.
      </p>

      <h3 className={H3}>How long does one learning session take?</h3>
      <p className={P}>
        A session defaults to 3 questions with 4 options each, generated from 7 change-type templates and
        aimed at 5 focus areas — logic, security, performance, architecture and syntax. The default cap is
        10 minutes, configurable from 1 minute to 2 hours.
      </p>

      <h3 className={H3}>Where do the sessions end up?</h3>
      <p className={P}>
        On your machine first: the server keeps the 100 most recent sessions per project, and the quiz UI
        ships in 3 languages. Signing in with GitHub and running the sync client pushes them into the
        learning ledger, which is free — there is no paid tier anywhere on this site.
      </p>

      <h3 className={H3}>Does it work with my assistant?</h3>
      <p className={P}>
        If your assistant speaks the Model Context Protocol, yes — Claude, Cursor, Copilot and the rest all
        load MCP servers the same way, described in the{" "}
        <a className={A} href="https://modelcontextprotocol.io/specification/2025-06-18" target="_blank" rel="noopener noreferrer">
          2025-06-18 specification
        </a>
        .
      </p>
    </section>
  );
}

/** Primary sources, listed so a reader (or a retriever) can follow every claim. */
export function Sources({ extra = [] as readonly { href: string; label: string; note?: string }[] }) {
  const all = [...SOURCES, ...extra];
  return (
    <section className="border-t border-border pt-8">
      <h2 className={H2}>Sources</h2>
      <p className={P}>
        Every figure on this page comes from one of these, or from the Covate repository itself. Each link
        was checked on 27 August 2026.
      </p>
      <ul className="mt-5 space-y-4 text-sm leading-7 text-secondary">
        {all.map((s) => (
          <li key={s.href}>
            <a className={A} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
            {s.note ? <span className="block text-xs leading-6 text-dim">{s.note}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The whole evidence layer in the order it reads best. Pages drop this in once
 * rather than duplicating figures that would then drift apart.
 */
export function Evidence({ sources }: { sources?: readonly { href: string; label: string; note?: string }[] }) {
  return (
    <>
      <VerificationTable />
      <ResearchEvidence />
      <CovateFacts />
      <Sources extra={sources ?? []} />
    </>
  );
}
