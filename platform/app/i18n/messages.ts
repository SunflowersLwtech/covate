// Locale registry. Message files live in <platform>/messages/<locale>/<domain>.json and
// are merged here so the server request config and the client provider serve one shape.
import enCommon from "../../messages/en/common.json";
import enHome from "../../messages/en/home.json";
import enDashboard from "../../messages/en/dashboard.json";
import enLearn from "../../messages/en/learn.json";
import enEvidence from "../../messages/en/evidence.json";
import zhCommon from "../../messages/zh-CN/common.json";
import zhHome from "../../messages/zh-CN/home.json";
import zhDashboard from "../../messages/zh-CN/dashboard.json";
import zhLearn from "../../messages/zh-CN/learn.json";
import zhEvidence from "../../messages/zh-CN/evidence.json";

export const LOCALES = ["en", "zh-CN"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
/** The visitor's choice. proxy.ts reads it to pick the [locale] tree; LocaleSwitcher writes it. */
export const LOCALE_COOKIE = "covate_locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

const en = { common: enCommon, home: enHome, dashboard: enDashboard, learn: enLearn, evidence: enEvidence };
const zhCN = { common: zhCommon, home: zhHome, dashboard: zhDashboard, learn: zhLearn, evidence: zhEvidence };

export type Messages = typeof en;
export const MESSAGES: Record<Locale, Messages> = { en, "zh-CN": zhCN };

export function messagesFor(locale: Locale): Messages {
  return MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
}
