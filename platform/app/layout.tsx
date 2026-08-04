import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

// Live custom domain (covate.org, on Cloudflare DNS → Vercel). The vercel.app URL still serves.
export const SITE = "https://covate.org";
export const GITHUB = "https://github.com/SunflowersLwtech/covate";

const TITLE = "Covate — turn AI-assisted coding into real understanding";
const DESCRIPTION =
  "Covate quizzes you on your own code changes so you actually learn while you build with AI — then the Learning Platform remembers every session, tracks your progress, and builds a personalized study plan. The MCP tool is free and open-source; the cloud learning platform is the paid layer.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "learn to code with AI",
    "AI coding learning tool",
    "understand AI-generated code",
    "personalized programming learning platform",
    "MCP learning server",
    "quiz on code changes",
    "spaced repetition for programmers",
    "developer skill tracking",
    "learn while coding with AI assistant",
    "avoid vibe coding skill decay",
    "Covate learning platform",
    "coding progress tracker",
  ],
  alternates: { canonical: SITE },
  openGraph: {
    type: "website",
    siteName: "Covate",
    url: SITE,
    title: TITLE,
    description:
      "Learn from every change. Covate turns your AI-assisted coding into real, durable understanding — free open-source MCP quizzes plus a paid personalized learning platform.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Covate — learn from every code change",
    description:
      "Free open-source MCP that quizzes you on your own code changes, plus a personalized learning platform that tracks your growth.",
  },
  robots: { index: true, follow: true },
};

export const FAQ = [
  {
    q: "What is Covate?",
    a: "Covate is an open-source learning sidecar for AI coding assistants. Its MCP tool, learning_session, watches your recent code changes and turns them into short, interactive quizzes that pause the AI until you've understood what just got built — so you learn while you ship instead of blindly accepting generated code. The Covate Learning Platform is the paid cloud layer that saves those learning moments and turns them into a personalized programming-learning experience.",
  },
  {
    q: "How does it work?",
    a: "You code with your AI assistant as usual. When you ask Covate to quiz you (or on your own schedule), it reads the recent changes and generates a few targeted questions about the concepts, APIs, and trade-offs involved, blocking further generation until you answer. Each session — the questions, your answers, the topics — is saved. With a Learning Platform account, those records sync to the cloud, where you can review them, see your progress over time, and get a personalized study plan.",
  },
  {
    q: "Is the MCP tool really free?",
    a: "Yes. The Covate MCP server is open-source (MIT) and free forever. It runs fully locally, needs no account, and is never crippled or paywalled — quizzes, debug memory, and local session history all work standalone. The paid Learning Platform is a separate, opt-in cloud layer for people who want cross-machine sync, review dashboards, progress tracking, and personalized study.",
  },
  {
    q: "What does the paid Learning Platform add?",
    a: "It turns your local learning history into a personalized coding-learning platform: a review dashboard of every past quiz and answer, progress-over-time charts, weak-topic analysis, and a personalized study plan that re-quizzes the concepts you keep missing using spaced repetition. It syncs across all your machines and (later) supports teams. It's a subscription; a free tier keeps a limited history.",
  },
  {
    q: "Why do I need this if the AI writes the code for me?",
    a: "That's exactly the problem it solves. When an AI writes most of your code, it's easy to ship things you don't actually understand — and your own skills quietly erode. Covate keeps you in the loop: it makes sure you understand each change while you still remember the context, and the platform turns those checks into measurable, compounding learning. It's the difference between using AI to move faster and using AI to also get better.",
  },
  {
    q: "When can I use the platform, and what will it cost?",
    a: "The open-source MCP is available now (install from the repo). The Learning Platform is in early access — join the waitlist and we'll email your invite when it opens. Pricing will be a simple developer-friendly subscription with a free tier; no charge to register interest.",
  },
] as const;

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": SITE + "#organization",
  name: "Covate",
  url: SITE,
  description: "Covate is open-core developer-learning software: a free open-source MCP learning tool plus a paid personalized learning platform.",
  parentOrganization: { "@type": "Organization", name: "DUOCODE TECHNOLOGY" },
};

const appLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Covate Learning Platform",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description: DESCRIPTION,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/PreOrder" },
  featureList: [
    "Open-source MCP that quizzes you on your own code changes",
    "Blocking learning sessions so you understand before you ship",
    "Cloud sync of every learning session across machines",
    "Review dashboard of past quizzes and answers",
    "Progress tracking and weak-topic analysis",
    "Personalized study plan with spaced repetition",
  ],
};

// Only site-wide entities (Organization, WebApplication) are injected globally.
// Page-specific structured data (Article / BreadcrumbList / FAQPage) is rendered by
// each page itself, so a sub-page like /learn/* carries its OWN correct graph instead
// of inheriting the home page's.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#0a0e14" />
        {[orgLd, appLd].map((ld, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
