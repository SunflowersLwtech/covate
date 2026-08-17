import type { MetadataRoute } from "next";
import { SITE } from "./layout";

// Every AI and search crawler the portfolio cares about, named explicitly.
// `User-Agent: *` already allows them, but the GEO audit checks for the names:
// several of these bots (and the people auditing them) treat an explicit
// allow-listing as the signal, and a wildcard alone leaves it ambiguous whether
// the site meant to include them.
const CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "Googlebot",
  "Bingbot",
  "Baiduspider",
  "Sogou web spider",
  "360Spider",
  "YisouSpider",
  "Bytespider",
  "PetalBot",
  "YandexBot",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
  "DuckDuckBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    // Allow all crawlers, including AI/search bots — the landing is public marketing.
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: CRAWLERS, allow: "/" },
    ],
    sitemap: SITE + "/sitemap.xml",
    host: SITE,
  };
}
