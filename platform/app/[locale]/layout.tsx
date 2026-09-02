import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import "../globals.css";
import { isLocale, LOCALES } from "../i18n/messages";
import { SITE } from "../lib/site";

// Shared cross-product GA4 (distinguished by hostname in reports), matching the
// other DUOCODE products so covate.org has usage/traffic monitoring too.
const GA_ID = "G-M3EQXS08MM";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

// This is the root layout, and [locale] above it is the site's only root param.
// proxy.ts rewrites every public URL onto one of these two trees from the
// covate_locale cookie, so both are prerendered and the URL never carries a locale.
export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home.meta");
  return {
    metadataBase: new URL(SITE),
    title: t("title"),
    description: t("description"),
    keywords: [
      "learn to code with AI",
      "AI coding learning tool",
      "understand AI-generated code",
      "learning ledger for developers",
      "MCP learning server",
      "quiz on code changes",
      "sync MCP learning sessions",
      "developer skill tracking",
      "learn while coding with AI assistant",
      "avoid vibe coding skill decay",
      "Covate learning ledger",
      "coding progress tracker",
    ],
    alternates: { canonical: SITE },
    openGraph: {
      type: "website",
      siteName: "Covate",
      url: SITE,
      title: t("title"),
      description: t("ogDescription"),
      // app/opengraph-image.tsx sits above this root layout, so the file convention no
      // longer attaches it by itself; point at the route explicitly.
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: t("title") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: ["/opengraph-image"],
    },
    robots: { index: true, follow: true },
  };
}

// Off-site profiles that resolve "Covate" to one entity for an answer engine.
// Every URL here returned HTTP 200 when checked on 2026-08-27, and that check is
// the entry condition: a sameAs pointing at a profile that does not exist tells
// a resolver the entity's own account of itself is wrong, which is worse than
// listing nothing. (A LinkedIn company page was rejected for exactly that — 404.)
export const SAME_AS = [
  "https://github.com/SunflowersLwtech/covate",
  "https://github.com/SunflowersLwtech",
  "https://github.com/DuoCode2",
  "https://duocodetech.com/",
];

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": SITE + "#organization",
  name: "Covate",
  url: SITE,
  description: "Covate is free developer-learning software: an open-source (MIT) MCP learning tool plus a free learning ledger you reach by signing in with GitHub.",
  parentOrganization: { "@type": "Organization", name: "DUOCODE TECHNOLOGY" },
  sameAs: SAME_AS,
};

// Only site-wide entities (Organization, WebSite, WebApplication) are injected globally.
// Page-specific structured data (Article / BreadcrumbList / FAQPage) is rendered by
// each page itself, so a sub-page like /learn/* carries its OWN correct graph instead
// of inheriting the home page's.
export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations("home.meta");
  const messages = await getMessages();

  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Covate learning ledger",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description: t("description"),
    // Free, and actually available today — not PreOrder, and not a priced tier.
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
    featureList: [
      "Open-source MCP that quizzes you on your own code changes",
      "Blocking learning sessions so you understand before you ship",
      "Sign in with GitHub (device flow) — free, no payment",
      "Sync your local learning sessions into a reviewable ledger",
      "Per-session results, running accuracy, and worst-scoring topics",
      "Reveal or rotate your sync token at any time",
    ],
  };
  const siteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Covate",
    url: SITE,
    inLanguage: locale,
    publisher: { "@type": "Organization", name: "DUOCODE TECHNOLOGY" },
    sameAs: SAME_AS,
  };

  return (
    <html lang={locale} className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#0a0e14" />
        {[orgLd, siteLd, appLd].map((ld, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        ))}
      </head>
      <body>
        {/* Only the client components on the dashboard read messages in the browser;
            the marketing copy stays server-only instead of shipping twice. */}
        <NextIntlClientProvider messages={{ common: messages.common, dashboard: messages.dashboard }}>
          {children}
        </NextIntlClientProvider>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
