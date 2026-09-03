import { Breadcrumb } from "./Breadcrumb";
import { NAV, SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

// The shared shell for /privacy and /terms. The two pages differ only in which
// message namespace they read, so the markup lives here once; every string is
// passed in already translated, which keeps the CJK red line satisfied and lets
// the i18n key check see literal `t("…")` calls in the page files.
export type LegalSection = {
  heading: string;
  paragraphs: string[];
  bullets: string[];
  /** Optional aside under the section — an empty string renders nothing. */
  footnote: string;
};

export function LegalDoc({
  eyebrow,
  title,
  updated,
  intro,
  breadcrumb,
  sections,
  seeAlso,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  breadcrumb: string;
  sections: LegalSection[];
  seeAlso: { href: string; label: string };
}) {
  return (
    <div className="min-h-screen bg-deep text-primary">
      <SiteHeader items={NAV.legal} />

      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 pb-12 pt-8">
            <Breadcrumb current={breadcrumb} />
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">{eyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight text-primary sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 font-mono text-xs text-dim">{updated}</p>
            <p className="mt-6 text-lg leading-8 text-secondary">{intro}</p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-6 py-14">
          <ol className="space-y-12">
            {sections.map((s, i) => (
              <li key={i}>
                <h2 className="flex gap-3 text-xl font-semibold leading-snug text-primary sm:text-2xl">
                  <span aria-hidden className="pt-1 font-mono text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{s.heading}</span>
                </h2>
                {s.paragraphs.map((p, j) => (
                  <p key={j} className="mt-4 text-base leading-8 text-secondary">
                    {p}
                  </p>
                ))}
                {s.bullets.length ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-accent/60">
                    {s.bullets.map((b, j) => (
                      <li key={j} className="text-base leading-8 text-secondary">
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {s.footnote ? (
                  <p className="mt-5 rounded-xl border border-border bg-surface/40 p-4 text-sm leading-7 text-secondary">
                    {s.footnote}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>

          <a
            href={seeAlso.href}
            className="mt-14 inline-block font-mono text-xs text-accent underline underline-offset-4 hover:text-accent-soft"
          >
            {seeAlso.label}
          </a>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
