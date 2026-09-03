import type { MetadataRoute } from "next";
import { SITE } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, lastModified: "2026-08-27", changeFrequency: "weekly", priority: 1 },
    { url: SITE + "/learn", lastModified: "2026-08-27", changeFrequency: "weekly", priority: 0.9 },
    { url: SITE + "/learn/what-is-vibe-coding", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/how-to-learn-from-ai-generated-code", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/how-to-learn-a-new-codebase-fast", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/does-ai-make-you-a-worse-programmer", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/how-to-avoid-over-relying-on-ai-when-coding", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/how-to-review-ai-generated-code", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/prompt-engineering-for-coding", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/spaced-repetition-for-developers", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/should-you-still-learn-to-code-with-ai", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/cant-code-without-ai-anymore", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/when-to-write-code-by-hand-vs-let-ai", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/how-juniors-should-use-ai", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/keep-a-learning-ledger-from-your-commits", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/code-reading-routine-for-ai-heavy-teams", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/how-to-explain-ai-generated-code-in-a-code-review", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/onboard-to-a-repo-with-an-mcp-learning-tool", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/how-to-learn-a-new-programming-language-with-ai", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/how-to-debug-with-ai-without-losing-the-skill", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/coding-interviews-in-the-age-of-ai", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/privacy", lastModified: "2026-09-03", changeFrequency: "yearly", priority: 0.3 },
    { url: SITE + "/terms", lastModified: "2026-09-03", changeFrequency: "yearly", priority: 0.3 },
  ];
}
