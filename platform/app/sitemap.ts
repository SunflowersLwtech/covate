import type { MetadataRoute } from "next";
import { SITE } from "./layout";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, lastModified: "2026-08-04", changeFrequency: "weekly", priority: 1 },
    { url: SITE + "/learn/how-to-learn-from-ai-generated-code", lastModified: "2026-08-04", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/does-ai-make-you-a-worse-programmer", lastModified: "2026-08-04", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/how-to-review-ai-generated-code", lastModified: "2026-08-04", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/spaced-repetition-for-developers", lastModified: "2026-08-04", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE + "/learn/should-you-still-learn-to-code-with-ai", lastModified: "2026-08-04", changeFrequency: "monthly", priority: 0.8 },
  ];
}
