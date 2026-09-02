import { SITE } from "../lib/site";

// "Covate / <current>" — the current crumb is a link when it has somewhere to go
// (an article pointing back at the Learning Center) and plain text on the hub itself.
export function Breadcrumb({ current, currentHref }: { current: string; currentHref?: string }) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
      <a href={SITE} className="transition-colors hover:text-accent">Covate</a>
      <span aria-hidden> / </span>
      {currentHref ? (
        <a href={currentHref} className="transition-colors hover:text-accent">{current}</a>
      ) : (
        <span className="text-secondary">{current}</span>
      )}
    </nav>
  );
}
