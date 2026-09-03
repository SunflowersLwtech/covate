import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { SITE } from "../../lib/site";
import { LegalDoc, type LegalSection } from "../../_components/LegalDoc";

// Canonical URL is unprefixed, like every other page: proxy.ts rewrites /privacy onto
// this tree from the covate_locale cookie, and 307s /en/privacy or /zh-CN/privacy back
// to /privacy with the cookie set.
const PATH = "/privacy";
const URL = SITE + PATH;
const UPDATED = "2026-09-03";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.privacy");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    // The Bahasa Malaysia notice PDPA s.7(2) requires is a route of its own, because
    // "ms" is not one of the site's two UI locales; declare it as this page's other
    // language version rather than leaving it as an orphan.
    alternates: { canonical: PATH, languages: { "ms-MY": "/privacy/ms" } },
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

export default async function PrivacyPage() {
  const locale = await getLocale();
  const t = await getTranslations("legal.privacy");

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
        seeAlso={{ href: "/terms", label: t("seeAlso") }}
        languageNote={{ text: t("languages.note"), href: "/privacy/ms", linkLabel: t("languages.linkLabel") }}
      />
    </>
  );
}
