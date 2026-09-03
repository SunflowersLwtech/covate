import type { Metadata } from "next";
import { SITE } from "../../../lib/site";
import { LegalDoc, type LegalSection } from "../../../_components/LegalDoc";
import { MS } from "./content";

// The Bahasa Malaysia privacy notice — PDPA 2010 s.7(2) requires the notice in both
// the national language and English.
//
// It is a route of its own rather than a third site locale. The site's locale
// mechanism (proxy.ts + app/i18n/messages.ts) prerenders EVERY page once per locale
// and scripts/i18n-check.mjs enforces key-for-key parity across message catalogues,
// so adding "ms" would mean translating the home page, the dashboard and nineteen
// Learning Center articles before the build would pass — and would put a half-Malay
// marketing site in front of visitors. Only the notice is required in Malay, so only
// the notice exists in Malay. en / zh-CN routing is untouched: /privacy/ms is an
// ordinary unprefixed path, rewritten onto whichever [locale] tree the covate_locale
// cookie selects, and /en/privacy/ms or /zh-CN/privacy/ms still 307 back to it. The
// document is marked lang="ms" on <main>; the header and footer around it stay in the
// visitor's chosen site language.
//
// "ms" is the ISO 639-1 code for Malay. ("bm" is Bambara, not Bahasa Malaysia.)
const PATH = "/privacy/ms";
const URL = SITE + PATH;
const UPDATED = "2026-09-03";

export function generateMetadata(): Metadata {
  return {
    title: MS.meta.title,
    description: MS.meta.description,
    alternates: { canonical: PATH, languages: { en: "/privacy" } },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "Covate",
      url: URL,
      title: MS.meta.title,
      description: MS.meta.description,
      locale: "ms_MY",
    },
    twitter: {
      card: "summary_large_image",
      title: MS.meta.title,
      description: MS.meta.description,
    },
  };
}

export default function PrivacyMsPage() {
  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": URL + "#page",
    name: MS.title,
    headline: MS.title,
    description: MS.meta.description,
    url: URL,
    inLanguage: "ms",
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
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: SITE + "/privacy" },
      { "@type": "ListItem", position: 3, name: MS.title, item: URL },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LegalDoc
        lang="ms"
        eyebrow={MS.eyebrow}
        title={MS.title}
        updated={MS.updated}
        intro={MS.intro}
        breadcrumb={MS.breadcrumb}
        sections={MS.sections as LegalSection[]}
        seeAlso={MS.seeAlso}
        languageNote={MS.languageNote}
      />
    </>
  );
}
