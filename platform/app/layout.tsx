import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Shared cross-product GA4 (distinguished by hostname in reports), matching the
// other DUOCODE products so covate.org has usage/traffic monitoring too.
const GA_ID = "G-M3EQXS08MM";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

// Live custom domain (covate.org, on Cloudflare DNS → Vercel). The vercel.app URL still serves.
export const SITE = "https://covate.org";
export const GITHUB = "https://github.com/SunflowersLwtech/covate";

const TITLE = "Covate — turn AI-assisted coding into real understanding";
const DESCRIPTION =
  "Covate quizzes you on your own code changes so you actually learn while you build with AI. The MCP tool is free and open-source (MIT); sign in with GitHub and your sessions sync into a learning ledger where you can review every quiz, your accuracy, and the topics you keep getting wrong. Free — there is nothing to buy.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
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
    title: TITLE,
    description:
      "Learn from every change. A free, open-source MCP quizzes you on your own diffs; sign in with GitHub and every session syncs into a free learning ledger you can review.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Covate — learn from every code change",
    description:
      "Free open-source MCP that quizzes you on your own code changes, plus a free learning ledger — sign in with GitHub and review every synced session.",
  },
  robots: { index: true, follow: true },
};

export const FAQ = [
  {
    q: "What is Covate?",
    a: "Covate is an open-source learning sidecar for AI coding assistants. Its MCP tool, learning_session, watches your recent code changes and turns them into short, interactive quizzes that pause the AI until you've understood what just got built — so you learn while you ship instead of blindly accepting generated code. Sign in at covate.org with GitHub and the sync client pushes those sessions into a learning ledger you can review in the browser.",
  },
  {
    q: "How does it work?",
    a: "You code with your AI assistant as usual. When you ask Covate to quiz you (or on your own schedule), it reads the recent changes and generates a few targeted questions about the concepts, APIs, and trade-offs involved, blocking further generation until you answer. Each session — the questions, your answers, the topics — is saved locally. If you sign in with GitHub and run the sync client with your sync token, those records land in your learning ledger on covate.org, where you can review every session, your running accuracy, and the topics you keep getting wrong.",
  },
  {
    q: "Is it really free?",
    a: "Yes, all of it. The Covate MCP server is open-source (MIT), runs fully locally and needs no account. The learning ledger on covate.org is free too: sign in with GitHub, sync, review. There is no paid tier, no subscription and no checkout — nothing on this site can be bought.",
  },
  {
    q: "What does signing in add?",
    a: "One thing, honestly described: your local learning sessions become reviewable in a browser. The ledger shows every synced session, how many questions you got right, your overall accuracy, and a ranked list of the topics you answer worst — plus your sync token, which you can reveal or rotate at any time. It is not a study planner: it does not schedule reviews or re-quiz you on a spaced-repetition timetable today.",
  },
  {
    q: "Why do I need this if the AI writes the code for me?",
    a: "That's exactly the problem it solves. When an AI writes most of your code, it's easy to ship things you don't actually understand — and your own skills quietly erode. Covate keeps you in the loop: it makes sure you understand each change while you still remember the context, and the ledger keeps a record so you can see which concepts you keep missing. It's the difference between using AI to move faster and using AI to also get better.",
  },
  {
    q: "What does it cost, and what's coming next?",
    a: "Nothing. The MCP is available now from the repo, and the learning ledger is live and free — sign in with GitHub at covate.org/dashboard. Progress-over-time charts, spaced-repetition study plans and team accounts are ideas, not shipped features; when they exist we'll say so here, and if any of them ever becomes paid you'll see a price before you're asked for anything.",
  },
] as const;

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

const appLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Covate learning ledger",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description: DESCRIPTION,
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
  inLanguage: "en",
  publisher: { "@type": "Organization", name: "DUOCODE TECHNOLOGY" },
  sameAs: SAME_AS,
};

// Only site-wide entities (Organization, WebSite, WebApplication) are injected globally.
// Page-specific structured data (Article / BreadcrumbList / FAQPage) is rendered by
// each page itself, so a sub-page like /learn/* carries its OWN correct graph instead
// of inheriting the home page's.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#0a0e14" />
        {[orgLd, siteLd, appLd].map((ld, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        ))}
      </head>
      <body>
        {children}
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
