"use client";

import { useEffect, useRef, useState } from "react";

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

// A pause is remembered, so someone who stopped the loop last visit does not
// have to stop it again on the next one.
const PAUSE_KEY = "covate-hero-paused";

function readPaused(): boolean {
  try {
    return window.localStorage.getItem(PAUSE_KEY) === "1";
  } catch {
    return false;
  }
}

function writePaused(value: boolean) {
  try {
    window.localStorage.setItem(PAUSE_KEY, value ? "1" : "0");
  } catch {
    // Storage blocked (private mode, quota): the pause still works this visit.
  }
}

/**
 * The hero's background: the brand's light lines drifting on the deep background,
 * or — when the visitor asked for less motion, turned on their browser's data
 * saver, or the video failed — the still the loop was cut from.
 *
 * The still is server-rendered and is the layer that always exists; the video is
 * created in the browser only, after `prefers-reduced-motion`, `saveData` and the
 * viewport have been read. So a reduced-motion or data-saver visitor gets no
 * <video> element at all and a phone never asks for the landscape file. A video
 * that fails to load (weak network, blocked autoplay) is dropped and the still stays.
 *
 * An auto-starting loop that runs for more than five seconds needs a way to stop
 * it (WCAG 2.2.2), so a pause control is rendered whenever the video is. The
 * control is outside the aria-hidden layer and is icon-only, with its label
 * coming from the page's own language. Pausing is remembered across visits.
 */
export function HeroMedia({ pauseLabel, playLabel }: { pauseLabel: string; playLabel: string }) {
  const [variant, setVariant] = useState<Variant | null>(null);
  const [failed, setFailed] = useState(false);
  // The loop only exists in the dark theme (see .hero-media in globals.css), so
  // the light theme must not pay for it either: no element, no request.
  const [theme, setTheme] = useState("dark");
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
      // Data saver: a ~1 MB loop is decoration, not content — the still stays
      // and nothing is fetched.
      const saveData =
        (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
      if (motion.matches || saveData) {
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

  // The loop starts here rather than via autoPlay, because whether it starts at
  // all depends on a stored preference that only exists in the browser. Reading
  // it in an effect (never in useState's initialiser) keeps the served markup
  // and the first client render identical.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (readPaused()) {
      video.pause();
      setPaused(true);
      return;
    }
    setPaused(false);
    void video.play().catch(() => {
      // Autoplay refused (some data savers, some in-app browsers): the poster
      // stays and the button reads "Play".
    });
  }, [sources]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => {});
      setPaused(false);
      writePaused(false);
    } else {
      video.pause();
      setPaused(true);
      writePaused(true);
    }
  };

  return (
    <>
      <div className="hero-media" aria-hidden="true">
        {sources ? (
          <video
            ref={videoRef}
            key={variant}
            poster={POSTER}
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
      {sources ? (
        <button
          type="button"
          className="hero-media-toggle"
          onClick={toggle}
          aria-label={paused ? playLabel : pauseLabel}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            {paused ? (
              <path d="M4.5 2.5 13 8l-8.5 5.5z" fill="currentColor" />
            ) : (
              <>
                <rect x="4" y="2.5" width="3" height="11" fill="currentColor" />
                <rect x="9" y="2.5" width="3" height="11" fill="currentColor" />
              </>
            )}
          </svg>
        </button>
      ) : null}
    </>
  );
}
