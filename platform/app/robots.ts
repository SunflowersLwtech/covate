import type { MetadataRoute } from "next";
import { SITE } from "./layout";

export default function robots(): MetadataRoute.Robots {
  return {
    // Allow all crawlers, including AI/search bots — the landing is public marketing.
    rules: { userAgent: "*", allow: "/" },
    sitemap: SITE + "/sitemap.xml",
    host: SITE,
  };
}
