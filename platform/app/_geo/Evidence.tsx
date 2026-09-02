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

import { getTranslations } from "next-intl/server";

export const SOURCES = [
  {
    href: "https://modelcontextprotocol.io/specification/2025-06-18",
    label: "Model Context Protocol — specification (2025-06-18)",
  },
  {
    href: "https://arxiv.org/abs/2507.09089",
    label: "METR — Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity",
  },
  {
    href: "https://survey.stackoverflow.co/2025/ai",
    label: "Stack Overflow Developer Survey 2025 — AI section",
  },
  {
    href: "https://dora.dev/research/2025/dora-report/",
    label: "DORA — State of AI-assisted Software Development 2025",
  },
  {
    href: "https://owasp.org/www-project-top-ten/",
    label: "OWASP Top 10",
  },
  {
    href: "https://cwe.mitre.org/top25/",
    label: "CWE Top 25 Most Dangerous Software Weaknesses",
  },
  {
    href: "https://git-scm.com/docs/git-diff",
    label: "Git — git-diff documentation",
  },
] as const;

const H2 = "text-2xl font-semibold tracking-tight text-primary";
const H3 = "mt-8 text-lg font-medium text-primary";
const P = "mt-3 text-sm leading-7 text-secondary";
const A = "text-accent underline underline-offset-4 hover:text-accent-soft";

const link = (href: string) =>
  function Link(chunks: React.ReactNode) {
    return (
      <a className={A} href={href} target="_blank" rel="noopener noreferrer">
        {chunks}
      </a>
    );
  };

/**
 * Published findings about AI-assisted coding, each stated as a question with a
 * short answer and a link to the paper or survey it came from.
 */
export async function ResearchEvidence() {
  const t = await getTranslations("evidence.research");
  return (
    <section>
      <h2 className={H2}>{t("title")}</h2>
      <p className={P}>{t("intro")}</p>

      <h3 className={H3}>{t("faster.q")}</h3>
      <p className={P}>{t.rich("faster.a", { link: link("https://arxiv.org/abs/2507.09089") })}</p>

      <h3 className={H3}>{t("speedup.q")}</h3>
      <p className={P}>{t.rich("speedup.a", { link: link("https://arxiv.org/abs/2302.06590") })}</p>

      <h3 className={H3}>{t("trust.q")}</h3>
      <p className={P}>{t.rich("trust.a", { link: link("https://survey.stackoverflow.co/2025/ai") })}</p>

      <h3 className={H3}>{t("wrong.q")}</h3>
      <p className={P}>{t("wrong.a")}</p>

      <h3 className={H3}>{t("secure.q")}</h3>
      <p className={P}>
        {t.rich("secure.a", {
          owasp: link("https://owasp.org/www-project-top-ten/"),
          cwe: link("https://cwe.mitre.org/top25/"),
          paper: link("https://arxiv.org/abs/2211.03622"),
        })}
      </p>
    </section>
  );
}

type Row = { way: string; proves: string; stops: string; person: string; record: string; cost: string };

/**
 * The comparison the whole site is really about: five ways to check you
 * understood a change, and what each one does and does not prove.
 */
export async function VerificationTable() {
  const t = await getTranslations("evidence.table");
  const rows = t.raw("rows") as Row[];
  return (
    <section>
      <h2 className={H2}>{t("title")}</h2>
      <p className={P}>{t("intro")}</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[45rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-dim">
              <th scope="col" className="py-3 pr-3 font-medium">{t("headers.way")}</th>
              <th scope="col" className="py-3 pr-3 font-medium">{t("headers.proves")}</th>
              <th scope="col" className="py-3 pr-3 font-medium">{t("headers.stops")}</th>
              <th scope="col" className="py-3 pr-3 font-medium">{t("headers.person")}</th>
              <th scope="col" className="py-3 pr-3 font-medium">{t("headers.record")}</th>
              <th scope="col" className="py-3 font-medium">{t("headers.cost")}</th>
            </tr>
          </thead>
          <tbody className="text-secondary">
            {rows.map((r, i) => (
              <tr key={r.way} className={i < rows.length - 1 ? "border-b border-border/60" : undefined}>
                <td className="py-3 pr-3 text-primary">{r.way}</td>
                <td className="py-3 pr-3">{r.proves}</td>
                <td className="py-3 pr-3">{r.stops}</td>
                <td className="py-3 pr-3">{r.person}</td>
                <td className="py-3 pr-3">{r.record}</td>
                <td className="py-3">{r.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 font-mono text-[11px] text-dim">{t("note")}</p>
    </section>
  );
}

/** Checkable facts about the tool itself, in question form. */
export async function CovateFacts() {
  const t = await getTranslations("evidence.facts");
  const code = (chunks: React.ReactNode) => <code>{chunks}</code>;
  return (
    <section>
      <h2 className={H2}>{t("title")}</h2>
      <p className={P}>{t("intro")}</p>

      <h3 className={H3}>{t("tools.q")}</h3>
      <p className={P}>{t.rich("tools.a", { code })}</p>

      <h3 className={H3}>{t("session.q")}</h3>
      <p className={P}>{t("session.a")}</p>

      <h3 className={H3}>{t("where.q")}</h3>
      <p className={P}>{t("where.a")}</p>

      <h3 className={H3}>{t("assistant.q")}</h3>
      <p className={P}>
        {t.rich("assistant.a", { link: link("https://modelcontextprotocol.io/specification/2025-06-18") })}
      </p>
    </section>
  );
}

/** Primary sources, listed so a reader (or a retriever) can follow every claim. */
export async function Sources({ extra = [] as readonly { href: string; label: string; note?: string }[] }) {
  const t = await getTranslations("evidence.sources");
  const notes = t.raw("notes") as string[];
  const all = [...SOURCES.map((s, i) => ({ ...s, note: notes[i] })), ...extra];
  return (
    <section className="border-t border-border pt-8">
      <h2 className={H2}>{t("title")}</h2>
      <p className={P}>{t("intro")}</p>
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
