import { getLocale, getTranslations } from "next-intl/server";

// "By the Covate team · Updated <date>" in the visitor's language. It sits inside the
// English article's <header lang="en">, so it declares its own language.
export async function ArticleByline({ updated }: { updated: string }) {
  const locale = await getLocale();
  const t = await getTranslations("learn.article");
  return <p lang={locale} className="mt-4 font-mono text-xs text-dim">{t("byline", { date: new Date(updated) })}</p>;
}
