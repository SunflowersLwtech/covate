import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import "../globals.css";
import { isLocale, LOCALES } from "../i18n/messages";
import { SITE } from "../lib/site";

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
        {/* The only analytics on this site: Umami, self-hosted on our own server,
            replacing the shared GA4 tag that used to sit here. It sets no cookie
            and writes nothing to the visitor's browser, so covate.org needs no
            consent banner — which is what the privacy policy now says. The
            tracker derives its collector endpoint from its own src by swapping
            /script.js for /api/send, so no data-host-url is needed here.

            Two independent gates keep non-production traffic out of the
            production website-id, because the id itself carries no notion of
            where it is allowed to fire.

            VERCEL_ENV is the build-time gate: `next dev` and preview deploys
            never render the tag at all. This layout is prerendered
            (generateStaticParams above), so the decision is baked in at build
            time — and covate.org is built locally with `vercel build --prod`
            and shipped with `vercel deploy --prebuilt`, where the Vercel CLI
            sets VERCEL_ENV=production for that build.

            data-domains is the runtime gate, inside the tracker itself: even a
            production bundle stays silent unless location.hostname is listed,
            so a prod build opened from anywhere but the real host reports
            nothing. Neither gate replaces the other — a correctly guarded
            emitter pointed at the wrong collector is still wrong, and that is
            the shape of the problem this closes.

            www is listed because it is a production host today (it 308s to the
            apex). An out-of-date list fails by losing data silently, so change
            it together with the domain.

            Adding a subdomain means changing TWO places: this attribute and the
            server-side hostname allowlist (an Umami BEFORE INSERT trigger), and the two
            use different rules.

            data-domains is exact string equality: location.hostname must appear here
            verbatim. The tracker contains no wildcard, endsWith or RegExp matching, so
            "*.covate.org" would only ever match a literal host of that name. The
            server-side trigger lowercases, strips "www." and accepts subdomains. A
            subdomain added there but not here is accepted by the collector and never
            sent by the browser, so it goes silently uncollected.

            Prefer giving a new subdomain its own website-id over widening either list.
            A staging host reporting into the production id is the failure this gate
            exists to prevent. */}
        {process.env.VERCEL_ENV === "production" ? (
          <Script
            defer
            src="https://fluentdojo.com/umami/script.js"
            data-website-id="18334797-f828-4567-9415-c3af0b5325c0"
            data-domains="covate.org,www.covate.org"
          />
        ) : null}
      </body>
    </html>
  );
}
