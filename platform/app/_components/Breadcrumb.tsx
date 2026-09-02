import { getTranslations } from "next-intl/server";
import { SITE } from "../lib/site";

// "Covate / Learning Center" — a link back to the hub from an article, plain text on the hub itself.
export async function Breadcrumb({ link = false }: { link?: boolean }) {
  const t = await getTranslations("common.breadcrumb");
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
      <a href={SITE} className="transition-colors hover:text-accent">{t("home")}</a>
      <span aria-hidden> / </span>
      {link ? (
        <a href="/learn" className="transition-colors hover:text-accent">{t("learningCenter")}</a>
      ) : (
        <span className="text-secondary">{t("learningCenter")}</span>
      )}
    </nav>
  );
}
