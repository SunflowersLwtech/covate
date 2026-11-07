import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../lib/site";

export async function SiteFooter() {
  const t = await getTranslations("common.footer");
  return (
    <footer className="border-t border-border bg-deep">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 font-mono text-xs text-dim sm:flex-row">
        <span>covate<span className="text-accent">.</span>{t("tagline")}</span>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href="/learn" className="transition-colors hover:text-primary">{t("learn")}</a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">{t("github")}</a>
          <a href={SITE} className="transition-colors hover:text-primary">{t("home")}</a>
          <a href="/privacy" className="transition-colors hover:text-primary">{t("privacy")}</a>
          <a href="/terms" className="transition-colors hover:text-primary">{t("terms")}</a>
        </div>
      </div>
    </footer>
  );
}
