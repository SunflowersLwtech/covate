import { getLocale, getTranslations } from "next-intl/server";

// "By the Covate team · Updated <date>" in the visitor's language, plus — when that
// language is not the one the article is written in — a note saying so. The guides
// themselves are English content; translating them is an editorial decision, not a
// string migration, so the chrome switches and the text declares its language.
export async function ArticleByline({ updated }: { updated: string }) {
  const locale = await getLocale();
  const t = await getTranslations("learn.article");
  return (
    <>
      <p lang={locale} className="mt-4 font-mono text-xs text-dim">{t("byline", { date: new Date(updated) })}</p>
      {locale !== "en" ? (
        <p lang={locale} className="mt-2 font-mono text-xs text-dim">{t("englishOnly")}</p>
      ) : null}
    </>
  );
}
