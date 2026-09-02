import { GITHUB, SITE } from "../lib/site";

// The one site header. Every page used to inline its own copy of this markup
// (22 copies, six slightly different nav lists); the presets below are those
// lists, so a page picks one instead of re-typing the header.
export type NavItem = {
  label: string;
  href: string;
  className: string;
  external?: boolean;
};

const LINK = "transition-colors hover:text-primary";
const LINK_SM = "hidden transition-colors hover:text-primary sm:inline";
const GH: NavItem = { label: "GitHub", href: GITHUB, className: LINK, external: true };

export const NAV = {
  home: [
    { label: "Learn", href: "/learn", className: LINK },
    { label: "How it works", href: "#how", className: LINK },
    { label: "What you get", href: "#whats-here", className: LINK_SM },
    GH,
  ],
  hub: [
    { label: "Learn", href: "/learn", className: "text-primary transition-colors" },
    { label: "How it works", href: SITE + "#how", className: LINK_SM },
    GH,
  ],
  articleA: [{ label: "How it works", href: SITE + "#how", className: LINK }, GH],
  articleB: [
    { label: "How it works", href: SITE + "#how", className: LINK },
    { label: "What you get", href: SITE + "#whats-here", className: LINK_SM },
    GH,
  ],
  articleC: [
    { label: "Learn", href: "/learn", className: LINK },
    { label: "How it works", href: SITE + "#how", className: LINK_SM },
    GH,
  ],
  dashboard: [{ label: "Home", href: SITE, className: LINK }, GH],
} satisfies Record<string, NavItem[]>;

export const SIGN_OUT: NavItem = { label: "Sign out", href: "/api/auth/logout", className: LINK };

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

export function SiteHeader({
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
            <a key={it.label} href={it.href} target="_blank" rel="noopener noreferrer" className={it.className}>
              {it.label}
            </a>
          ) : (
            <a key={it.label} href={it.href} className={it.className}>
              {it.label}
            </a>
          ),
        )}
      </nav>
    </header>
  );
}
