"use client";

import Script from "next/script";
import { installUmamiFilter, UMAMI_BEFORE_SEND, UMAMI_NOT_FOUND_ATTR } from "../lib/umamiFilter";

/**
 * The Umami tag, with its address filter (app/lib/umamiFilter.ts) installed
 * when this module loads in the browser.
 *
 * Not an inline <script> in the layout: the not-found page that proxy.ts sends
 * unknown paths to ([...rest] → notFound()) arrives with an empty body and is
 * built in the browser from the RSC payload, and a <script> React creates on
 * the client never runs. The tracker would then find no hook and send the
 * pasted path as it is. This module is loaded before React hydrates, on that
 * page and every other, and next/script injects the tracker only after
 * hydration; if the module fails to load, the tag is not rendered at all.
 */
if (typeof window !== "undefined") {
  installUmamiFilter(window as unknown as Record<string, unknown>, UMAMI_BEFORE_SEND, UMAMI_NOT_FOUND_ATTR);
}

export function UmamiTag() {
  return (
    <Script
      defer
      src="https://fluentdojo.com/umami/script.js"
      data-website-id="18334797-f828-4567-9415-c3af0b5325c0"
      data-domains="covate.org,www.covate.org"
      data-before-send={UMAMI_BEFORE_SEND}
    />
  );
}
