import type { MetadataRoute } from "next";
import { SITE } from "./layout";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, lastModified: "2026-08-04", changeFrequency: "weekly", priority: 1 },
    { url: SITE + "/learn/how-to-learn-from-ai-generated-code", lastModified: "2026-08-04", changeFrequency: "monthly", priority: 0.8 },
  ];
}
