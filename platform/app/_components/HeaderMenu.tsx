"use client";

import { useEffect, useRef, type ReactNode } from "react";

// The site header's nav on phone widths. A plain <details>, so the links are there
// and the button opens them before (or without) any JavaScript; once hydrated it also
// closes the way a menu is expected to: on Escape, on a tap outside, and after a link
// is followed — "How it works" is an in-page anchor, and without this the panel would
// stay open over the page it just scrolled to.
export function HeaderMenu({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const details = ref.current;
    if (!details) return;
    const close = () => {
      details.open = false;
    };
    const onPointerDown = (e: PointerEvent) => {
      if (details.open && !details.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !details.open) return;
      const hadFocus = details.contains(document.activeElement);
      close();
      if (hadFocus) details.querySelector("summary")?.focus();
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest("a")) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    details.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      details.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <details ref={ref} className="group relative sm:hidden">
      <summary
        aria-label={label}
        className="-m-2 flex cursor-pointer list-none items-center justify-center rounded-md p-2 transition-colors hover:text-primary [&::-webkit-details-marker]:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <path d="M3 5.5h14M3 10h14M3 14.5h14" className="group-open:hidden" />
          <path d="M5 5l10 10M15 5L5 15" className="hidden group-open:block" />
        </svg>
      </summary>
      <div className="absolute right-0 top-full z-50 mt-3 flex min-w-44 flex-col rounded-lg border border-border bg-surface py-1.5 shadow-xl shadow-black/40">
        {children}
      </div>
    </details>
  );
}
