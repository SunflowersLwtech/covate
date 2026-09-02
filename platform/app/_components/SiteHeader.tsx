import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../lib/site";
import { LocaleSwitcher } from "./LocaleSwitcher";

// The one site header. Every page used to inline its own copy of this markup
// (22 copies, six slightly different nav lists); the presets below are the three
// lists that survived, so a page picks one instead of re-typing the header.
export type NavKey = "learn" | "howItWorks" | "whatYouGet" | "github" | "home" | "signOut";
export type NavItem = {
  key: NavKey;
  href: string;
  className: string;
  external?: boolean;
};

const LINK = "transition-colors hover:text-primary";
const LINK_SM = "hidden transition-colors hover:text-primary sm:inline";
const GH: NavItem = { key: "github", href: GITHUB, className: LINK, external: true };

export const NAV = {
  home: [
    { key: "learn", href: "/learn", className: LINK },
    { key: "howItWorks", href: "#how", className: LINK },
    { key: "whatYouGet", href: "#whats-here", className: LINK_SM },
    GH,
  ],
  // The Learning Center hub and every article in it: "Learn" is the current section.
  learn: [
    { key: "learn", href: "/learn", className: "text-primary transition-colors" },
    { key: "howItWorks", href: SITE + "#how", className: LINK_SM },
    GH,
  ],
  dashboard: [{ key: "home", href: SITE, className: LINK }, GH],
} satisfies Record<string, NavItem[]>;

export const SIGN_OUT: NavItem = { key: "signOut", href: "/api/auth/logout", className: LINK };

const LOGO_CLASS = "flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-primary";

function Logo() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Covate" width={26} height={26} className="rounded-md" />
      covate<span className="text-accent">.</span>
    </>
  );
}

export async function SiteHeader({
  items,
  width = "6xl",
  logoLink = true,
}: {
  items: readonly NavItem[];
  /** The dashboard is narrower than the marketing pages. */
  width?: "6xl" | "5xl";
  /** On the home page the logo is not a link to itself. */
  logoLink?: boolean;
}) {
  const t = await getTranslations("common.nav");
  const shell =
    width === "5xl"
      ? "mx-auto flex max-w-5xl items-center justify-between px-6 py-5"
      : "mx-auto flex max-w-6xl items-center justify-between px-6 py-5";
  return (
    <header className={shell}>
      {logoLink ? (
        <a href={SITE} className={LOGO_CLASS}>
          <Logo />
        </a>
      ) : (
        <span className={LOGO_CLASS}>
          <Logo />
        </span>
      )}
      <nav className="flex items-center gap-6 text-sm text-secondary">
        {items.map((it) =>
          it.external ? (
            <a key={it.key} href={it.href} target="_blank" rel="noopener noreferrer" className={it.className}>
              {t(it.key)}
            </a>
          ) : (
            <a key={it.key} href={it.href} className={it.className}>
              {t(it.key)}
            </a>
          ),
        )}
        <LocaleSwitcher />
      </nav>
    </header>
  );
}
