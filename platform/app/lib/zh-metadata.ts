import type { Metadata } from "next";

// A page's English metadata with the visible strings — <title>, description, and the
// share-card title and description — swapped for the Chinese ones. Keywords, canonical
// and robots stay as they are: both languages live at the same URL, and a crawler
// (no covate_locale cookie) is served English.
export function zhMetadata(en: Metadata, title: string, description: string): Metadata {
  // The share-card title keeps the " | Covate" suffix wherever the English one has it.
  const cardTitle = (t: unknown) => (typeof t === "string" && t.endsWith(" | Covate") ? title + " | Covate" : title);
  return {
    ...en,
    title: title + " | Covate",
    description,
    openGraph: en.openGraph ? { ...en.openGraph, title: cardTitle(en.openGraph.title), description } : en.openGraph,
    twitter: en.twitter ? { ...en.twitter, title: cardTitle(en.twitter.title), description } : en.twitter,
  };
}
