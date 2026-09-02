import { getTranslations } from "next-intl/server";

// The one call to action the product can actually honour today: the learning ledger
// is live, free, and opens with a GitHub sign-in. (This replaces the old waitlist
// form, which promised an invite to a paid early-access tier that never existed.)
export async function SignInCta({ align = "start" }: { align?: "start" | "center" }) {
  const t = await getTranslations("common.signInCta");
  return (
    <div className={`flex w-full flex-col gap-2 ${align === "center" ? "items-center" : "items-start"}`}>
      <a
        href="/dashboard"
        className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-deep transition hover:bg-accent-soft"
      >
        {t("button")}
      </a>
      <p className="font-mono text-[11px] text-dim">{t("note")}</p>
    </div>
  );
}
