import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { SITE } from "../../lib/site";
import { LegalDoc, type LegalSection } from "../../_components/LegalDoc";

// Canonical URL is unprefixed, like every other page: proxy.ts rewrites /terms onto
// this tree from the covate_locale cookie, and 307s /en/terms or /zh-CN/terms back
// to /terms with the cookie set.
const PATH = "/terms";
const URL = SITE + PATH;
const UPDATED = "2026-09-03";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.terms");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: { canonical: PATH },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "Covate",
      url: URL,
      title: t("meta.title"),
      description: t("meta.description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.title"),
      description: t("meta.description"),
    },
  };
}

export default async function TermsPage() {
  const locale = await getLocale();
  const t = await getTranslations("legal.terms");

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": URL + "#page",
    name: t("title"),
    headline: t("title"),
    description: t("meta.description"),
    url: URL,
    inLanguage: locale,
    datePublished: UPDATED,
    dateModified: UPDATED,
    isPartOf: { "@id": SITE + "#website" },
    publisher: { "@id": SITE + "#organization" },
    about: { "@id": SITE + "#organization" },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": URL + "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Covate", item: SITE },
      { "@type": "ListItem", position: 2, name: t("title"), item: URL },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LegalDoc
        eyebrow={t("eyebrow")}
        title={t("title")}
        updated={t("updated")}
        intro={t("intro")}
        breadcrumb={t("breadcrumb")}
        sections={t.raw("sections") as LegalSection[]}
        seeAlso={{ href: "/privacy", label: t("seeAlso") }}
      />
    </>
  );
}
