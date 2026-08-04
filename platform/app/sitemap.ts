import type { MetadataRoute } from "next";
import { SITE } from "./layout";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, lastModified: "2026-08-04", changeFrequency: "weekly", priority: 1 },
  ];
}
