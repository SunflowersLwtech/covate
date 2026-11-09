import { getTranslations } from "next-intl/server";
import { SITE } from "../lib/site";

// "Covate / Learning Center" — a link back to the hub from an article, plain text on the hub itself.
// `current` replaces the second crumb for a page that sits outside the Learning Center
// (the legal pages); such a page is its own destination, so that crumb is never a link.
//
// On an article below sm the crumb is a single "← Learning Center" link instead: the header's
// own "Learn" is folded into the menu there, and the two 14px crumbs were too small to hit.
// The link's box is 44px tall; the negative margin keeps the article where it was. Same
// look as the "← Back to the Learning Center" line that closes the article.
// `relative` because -my-3.5 also pulls the article's <header> up over the link's lower
// edge: without a stacking position the later-in-DOM header takes those taps.
export async function Breadcrumb({ link = false, current }: { link?: boolean; current?: string }) {
  const t = await getTranslations("common.breadcrumb");
  const back = link && !current;
  return (
    <>
      {back ? (
        <a
          href="/learn"
          className="relative -my-3.5 flex min-h-11 w-fit items-center font-mono text-xs text-dim transition-colors hover:text-secondary sm:hidden"
        >
          {t("back")}
        </a>
      ) : null}
      <nav
        aria-label="Breadcrumb"
        className={`font-mono text-[11px] uppercase tracking-[0.22em] text-dim${back ? " hidden sm:block" : ""}`}
      >
        <a href={SITE} className="transition-colors hover:text-accent">{t("home")}</a>
        <span aria-hidden> / </span>
        {current ? (
          <span className="text-secondary">{current}</span>
        ) : link ? (
          <a href="/learn" className="transition-colors hover:text-accent">{t("learningCenter")}</a>
        ) : (
          <span className="text-secondary">{t("learningCenter")}</span>
        )}
      </nav>
    </>
  );
}
