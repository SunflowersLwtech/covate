import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../lib/site";
import { HeaderMenu } from "./HeaderMenu";
import { LocaleSwitcher } from "./LocaleSwitcher";

// The one site header. Every page used to inline its own copy of this markup
// (22 copies, six slightly different nav lists); the presets below are the three
// lists that survived, so a page picks one instead of re-typing the header.
//
// From sm up the links sit in the header row. Below sm they move into a menu and
// only the language switch stays out: on a 393px phone the full row did not fit —
// "How it works" and the switch each broke onto two lines and the logo's dot ran
// into "Learn". The language switch stays visible because it is labelled in the
// other language, so a reader who needs it can find it without opening the menu.
export type NavKey = "learn" | "howItWorks" | "whatYouGet" | "github" | "home" | "signOut";
export type NavItem = {
  key: NavKey;
  href: string;
  /** The section the page belongs to: highlighted, no hover change. */
  current?: boolean;
  external?: boolean;
};

const GH: NavItem = { key: "github", href: GITHUB, external: true };

export const NAV = {
  home: [
    { key: "learn", href: "/learn" },
    { key: "howItWorks", href: "#how" },
    { key: "whatYouGet", href: "#whats-here" },
    GH,
  ],
  // The Learning Center hub and every article in it: "Learn" is the current section.
  learn: [{ key: "learn", href: "/learn", current: true }, { key: "howItWorks", href: SITE + "#how" }, GH],
  dashboard: [{ key: "home", href: SITE }, GH],
  // Privacy / Terms: no section of their own to highlight, so just the ways out.
  legal: [{ key: "learn", href: "/learn" }, { key: "home", href: SITE }, GH],
} satisfies Record<string, NavItem[]>;

export const SIGN_OUT: NavItem = { key: "signOut", href: "/api/auth/logout" };

const INLINE = "hidden sm:inline";
const MENU_ITEM = "block whitespace-nowrap px-4 py-2.5 transition-colors hover:bg-deep";

function NavLink({ item, className, label }: { item: NavItem; className: string; label: string }) {
  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
    </a>
  ) : (
    <a href={item.href} className={className}>
      {label}
    </a>
  );
}

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
        {items.map((it) => (
          <NavLink
            key={it.key}
            item={it}
            label={t(it.key)}
            className={`${INLINE} ${it.current ? "text-primary transition-colors" : "transition-colors hover:text-primary"}`}
          />
        ))}
        <LocaleSwitcher />
        <HeaderMenu label={t("menu")}>
          {items.map((it) => (
            <NavLink
              key={it.key}
              item={it}
              label={t(it.key)}
              className={`${MENU_ITEM} ${it.current ? "text-primary" : "hover:text-primary"}`}
            />
          ))}
        </HeaderMenu>
      </nav>
    </header>
  );
}
