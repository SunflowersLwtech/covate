import { getLocale, getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../lib/site";
import { Evidence } from "../_geo/Evidence";
import { SignInCta } from "../_components/SignInCta";
import { NAV, SiteHeader } from "../_components/SiteHeader";
import { SiteFooter } from "../_components/SiteFooter";

type Step = { n: string; title: string; body: string };
type Faq = { q: string; a: string };

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const steps = t.raw("how.steps") as Step[];
  const faq = t.raw("faq.items") as Faq[];
  const mcpItems = t.raw("whatsHere.mcp.items") as string[];
  const ledgerItems = t.raw("whatsHere.ledger.items") as string[];

  // Home-page-specific structured data (site-wide Organization/WebApplication live in layout).
  const homeLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": SITE + "#article",
      headline: t("ld.headline"),
      description: t("ld.description"),
      inLanguage: locale,
      datePublished: "2026-08-04",
      dateModified: "2026-08-27",
      mainEntityOfPage: { "@type": "WebPage", "@id": SITE },
      author: { "@id": SITE + "#organization" },
      publisher: { "@id": SITE + "#organization" },
      about: { "@type": "Thing", name: t("ld.about") },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": SITE + "#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
        { "@type": "ListItem", position: 2, name: t("ld.breadcrumbLedger"), item: SITE + "/dashboard" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-deep text-primary">
      {homeLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      {/* Nav */}
      <SiteHeader items={NAV.home} logoLink={false} />

      <main>
        {/* Hero */}
        <section className="hero-aurora bg-grid border-b border-border">
          <div className="relative z-10 mx-auto max-w-3xl px-6 pb-20 pt-16 text-center sm:pt-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              {t("hero.eyebrow")}
            </p>
            <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-primary sm:text-6xl">
              {t.rich("hero.title", { brand: (chunks) => <span className="text-brand">{chunks}</span> })}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-secondary">
              {t("hero.body")}
            </p>
            <div className="mt-9 flex flex-col items-center gap-3">
              <SignInCta align="center" />
              <p className="font-mono text-xs text-dim">
                {t("hero.fineprint")}
              </p>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <h2 className="text-2xl font-semibold text-primary sm:text-3xl">
              {t("problem.title")}
            </h2>
            <p className="mt-5 text-base leading-8 text-secondary">
              {t.rich("problem.body", { em: (chunks) => <span className="text-primary">{chunks}</span> })}
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-2xl font-semibold text-primary sm:text-3xl">{t("how.title")}</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.n} className="rounded-xl border border-border bg-surface/50 p-6">
                  <span className="font-mono text-sm text-accent">{s.n}</span>
                  <h3 className="mt-3 text-lg font-semibold text-primary">{s.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-secondary">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What actually exists today */}
        <section id="whats-here" className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-2xl font-semibold text-primary sm:text-3xl">{t("whatsHere.title")}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-secondary">
              {t("whatsHere.body")}
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface/50 p-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-secondary">{t("whatsHere.mcp.eyebrow")}</p>
                <h3 className="mt-3 text-xl font-semibold text-primary">{t("whatsHere.mcp.title")}</h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-secondary">
                  {mcpItems.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block font-mono text-xs text-secondary underline underline-offset-4 hover:text-primary">
                  {t("whatsHere.mcp.install")}
                </a>
              </div>
              <div className="rounded-xl border border-accent/40 bg-accent/[0.06] p-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">{t("whatsHere.ledger.eyebrow")}</p>
                <h3 className="mt-3 text-xl font-semibold text-primary">{t("whatsHere.ledger.title")}</h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-secondary">
                  {ledgerItems.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {/* Deliberately not listed: progress-over-time charts, spaced-repetition study
                    plans, team accounts. They are not built, so they are not sold or promised here. */}
                <p className="mt-5 text-xs leading-6 text-dim">{t("whatsHere.ledger.notYet")}</p>
                <a href="/dashboard" className="mt-4 inline-block font-mono text-xs text-accent underline underline-offset-4 hover:text-accent-soft">
                  {t("whatsHere.ledger.signIn")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Evidence: the verification comparison, the published research behind the
            claims on this page, and the tool's own checkable numbers. Shared with
            every /learn page from app/_geo/Evidence.tsx so a figure is stated once. */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl space-y-14 px-6 py-16">
            <Evidence />
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <h2 className="text-2xl font-semibold text-primary sm:text-3xl">{t("faq.title")}</h2>
            <div className="mt-8 divide-y divide-border border-y border-border">
              {faq.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="cursor-pointer list-none">
                    <h3 className="text-sm font-medium text-primary transition group-open:text-accent hover:text-accent">{f.q}</h3>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-secondary">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="join">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <h2 className="text-3xl font-semibold text-primary sm:text-4xl">
              {t("final.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-8 text-secondary">
              {t("final.body")}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <SignInCta align="center" />
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary">
                {t("final.install")}
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
