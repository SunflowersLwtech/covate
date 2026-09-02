import { getTranslations } from "next-intl/server";

// The line that closes every article: back to the Learning Center it belongs to.
export async function ArticleBackLink() {
  const t = await getTranslations("common.back");
  return (
    <div className="mt-12 border-t border-border pt-6 font-mono text-xs text-dim">
      <a href="/learn" className="hover:text-secondary">{t("learningCenter")}</a>
    </div>
  );
}
