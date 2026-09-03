import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../lib/site";

export async function SiteFooter() {
  const t = await getTranslations("common.footer");
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-dim sm:flex-row">
        <span className="font-mono">covate<span className="text-accent">.</span>{t("tagline")}</span>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <a href="/learn" className="hover:text-secondary">{t("learn")}</a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="hover:text-secondary">{t("github")}</a>
          <a href={SITE} className="hover:text-secondary">{t("home")}</a>
          <a href="/privacy" className="hover:text-secondary">{t("privacy")}</a>
          <a href="/terms" className="hover:text-secondary">{t("terms")}</a>
        </div>
      </div>
    </footer>
  );
}
