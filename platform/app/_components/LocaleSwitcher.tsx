"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { LOCALE_COOKIE, type Locale } from "../i18n/messages";

// One control, two languages: the label is the name of the language you would get.
// The choice lives in a cookie that proxy.ts reads on every request, so a full reload
// re-renders the whole page — <html lang> included — from the other prerendered tree.
export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations("common.locale");
  const [pending, setPending] = useState(false);
  const next: Locale = locale === "en" ? "zh-CN" : "en";

  function switchLocale() {
    setPending(true);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      disabled={pending}
      lang={next}
      aria-label={t("switchLabel")}
      className="font-mono text-xs transition-colors hover:text-primary disabled:opacity-60"
    >
      {t("other")}
    </button>
  );
}
