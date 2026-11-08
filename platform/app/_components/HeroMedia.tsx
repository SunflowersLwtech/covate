"use client";

import { useEffect, useState } from "react";

type Variant = "desktop" | "mobile";

// Two cuts of the same loop: 1920x1080 for a wide screen, 1080x1920 for a phone.
// The phone must never download the landscape one, so the browser picks the cut
// only after it knows which it is.
const SOURCES: Record<Variant, { webm: string; mp4: string }> = {
  desktop: { webm: "/media/hero-desktop.webm", mp4: "/media/hero-desktop.mp4" },
  mobile: { webm: "/media/hero-mobile.webm", mp4: "/media/hero-mobile.mp4" },
};

// The still is painted by .hero-media as a CSS background rather than an <img>:
// a hidden background is not fetched, so the light theme (where this layer is
// display:none) pays nothing for it.
const POSTER = "/media/poster.webp";

/**
 * The hero's background: the brand's light lines drifting on the deep background,
 * or — when the visitor asked for less motion — the still the loop was cut from.
 *
 * The still is server-rendered and is the layer that always exists; the video is
 * created in the browser only, after `prefers-reduced-motion` and the viewport
 * have been read. So a reduced-motion visitor gets no <video> element at all and
 * a phone never asks for the landscape file. A video that fails to load (weak
 * network, blocked autoplay) is dropped and the still stays.
 */
export function HeroMedia() {
  const [variant, setVariant] = useState<Variant | null>(null);
  const [failed, setFailed] = useState(false);
  // The loop only exists in the dark theme (see .hero-media in globals.css), so
  // the light theme must not pay for it either: no element, no request.
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const read = () => setTheme(document.documentElement.getAttribute("data-theme") ?? "dark");
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Two cuts, split at 768px: the landscape one is for 768 and up, the
    // portrait one for phones. A phone therefore never asks for the wide file.
    const wide = window.matchMedia("(min-width: 768px)");
    const decide = () => {
      if (motion.matches) {
        setVariant(null);
        return;
      }
      setVariant(wide.matches ? "desktop" : "mobile");
    };
    decide();
    motion.addEventListener("change", decide);
    wide.addEventListener("change", decide);
    return () => {
      motion.removeEventListener("change", decide);
      wide.removeEventListener("change", decide);
    };
  }, []);

  const sources = theme === "light" ? null : variant && !failed ? SOURCES[variant] : null;

  return (
    <div className="hero-media" aria-hidden="true">
      {sources ? (
        <video
          key={variant}
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
        >
          <source src={sources.webm} type="video/webm" />
          <source src={sources.mp4} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}