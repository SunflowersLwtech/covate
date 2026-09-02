import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../lib/site";
import { ARTICLES } from "../../lib/articles";
import { Evidence } from "../../_geo/Evidence";
import { SignInCta } from "../../_components/SignInCta";
import { NAV, SiteHeader } from "../../_components/SiteHeader";
import { SiteFooter } from "../../_components/SiteFooter";
import { Breadcrumb } from "../../_components/Breadcrumb";

const PATH = "/learn";
const URL = SITE + PATH;

const TITLE = "Learning Center — Learn to Code With AI, Not Instead of It";
const DESCRIPTION =
  "The Covate Learning Center: honest, practical guides on staying a strong developer while you build with AI — how to learn from AI-generated code, review it, retain what you learn, and whether to still learn to code at all. Free to read, like the Covate MCP that quizzes you on your own code and the learning ledger that keeps the results.";

export const metadata: Metadata = {
  title: TITLE + " | Covate",
  description: DESCRIPTION,
  keywords: [
    "learn to code with AI",
    "developer learning center",
    "learn from AI-generated code",
    "avoid skill decay AI coding",
    "how to review AI code",
    "spaced repetition for developers",
    "should you still learn to code",
    "Covate learning ledger",
  ],
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Covate",
    url: URL,
    title: TITLE + " | Covate",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE + " | Covate",
    description: DESCRIPTION,
  },
};


const collectionLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": URL + "#page",
  name: "Covate Learning Center",
  headline: TITLE,
  description: DESCRIPTION,
  url: URL,
  inLanguage: "en",
  datePublished: "2026-08-04",
  dateModified: "2026-08-27",
  isPartOf: { "@id": SITE + "#website" },
  publisher: { "@id": SITE + "#organization" },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: ARTICLES.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: SITE + "/learn/" + a.slug,
      name: a.title,
    })),
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": URL + "#breadcrumb",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
    { "@type": "ListItem", position: 2, name: "Learning Center", item: URL },
  ],
};

export default async function LearnHub() {
  const locale = await getLocale();
  const t = await getTranslations("learn.hub");
  return (
    <div className="min-h-screen bg-deep text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Nav */}
      <SiteHeader items={NAV.learn} />

      <main>
        {/* Hero */}
        <section className="hero-aurora bg-grid border-b border-border">
          <div className="relative z-10 mx-auto max-w-3xl px-6 pb-16 pt-16 text-center sm:pt-20">
            <Breadcrumb />
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              {t("eyebrow")}
            </p>
            <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-primary sm:text-5xl">
              {t.rich("title", { brand: (chunks) => <span className="text-brand">{chunks}</span> })}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-secondary">
              {t("body")}
            </p>
          </div>
        </section>

        {/* Articles */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-semibold text-primary sm:text-3xl">{t("guides")}</h2>
              <span className="font-mono text-xs text-dim">{t("count", { count: ARTICLES.length })}</span>
            </div>
            {/* The guides are English content; when the chrome is in another language, say so. */}
            {locale !== "en" ? <p className="mt-3 font-mono text-xs text-dim">{t("englishOnly")}</p> : null}
            <div lang="en" className="mt-10 grid gap-6 md:grid-cols-2">
              {ARTICLES.map((a) => (
                <a
                  key={a.slug}
                  href={"/learn/" + a.slug}
                  className="group flex flex-col rounded-xl border border-border bg-surface/50 p-6 transition-colors hover:border-accent/60"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    {a.category}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold leading-snug text-primary group-hover:text-accent">
                    {a.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-secondary">{a.description}</p>
                  <span lang={locale} className="mt-4 font-mono text-xs text-dim group-hover:text-secondary">
                    {t("read")}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Shared evidence layer (app/_geo/Evidence.tsx) — same sourced figures the
            guides quote, stated once. */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl space-y-14 px-6 py-16">
            <Evidence />
          </div>
        </section>

        {/* What Covate is */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              {t("habit.eyebrow")}
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-primary sm:text-3xl">
              {t("habit.title")}
            </h2>
            <p className="mt-5 text-base leading-8 text-secondary">
              {t("habit.body")}
            </p>
            <div className="mt-8 flex flex-col items-start gap-3">
              <SignInCta />
              <a
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary"
              >
                {t("habit.install")}
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
