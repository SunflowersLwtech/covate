import { getTranslations } from "next-intl/server";
import { NAV, SiteHeader } from "../_components/SiteHeader";
import { SiteFooter } from "../_components/SiteFooter";

export default async function NotFound() {
  const t = await getTranslations("common.notFound");
  return (
    <div className="min-h-screen bg-deep text-primary">
      <SiteHeader items={NAV.learn} />
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">{t("eyebrow")}</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-primary sm:text-4xl">{t("title")}</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-secondary">{t("body")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-6 font-mono text-xs">
          <a href="/" className="text-accent underline underline-offset-4 hover:text-accent-soft">{t("home")}</a>
          <a href="/learn" className="text-secondary underline underline-offset-4 hover:text-primary">{t("learn")}</a>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
