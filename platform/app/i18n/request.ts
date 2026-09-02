import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { DEFAULT_LOCALE, isLocale, messagesFor } from "./messages";

// The locale is the [locale] root param that proxy.ts rewrote the request into
// (from the covate_locale cookie; en when there is none). Reading the root param —
// not headers() or cookies() — is what keeps every page statically prerenderable,
// once per locale.
export default getRequestConfig(async () => {
  const requested = await rootLocale();
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;
  return { locale, messages: messagesFor(locale), timeZone: "UTC" };
});
