/**
 * What Umami may record of an address on covate.org.
 *
 * Umami records each page view's address and title, and sends the previous
 * page's address again as the next view's referrer (Umami 3.2.0
 * src/tracker/index.js). Anything typed or pasted into the address bar becomes
 * a path, and proxy.ts sends every unknown path to the localized not-found page
 * ([...rest] → notFound()). On another of our sites Umami held a not-found path
 * that was an account's email address and password (cleaned 2026-11-23).
 *
 * So while the not-found page's marker (UMAMI_NOT_FOUND_ATTR, rendered by
 * app/[locale]/not-found.tsx) is on the page, a view is recorded as "/404" with
 * the title "404" and nothing after the path. As a second line, every page
 * path here is lowercase a-z, 0-9, "-" and "/" (the routes under app/[locale]
 * are all static, and so are the 25 sitemap URLs, 2026-11-28), so a path with
 * anything else is recorded the same way even without the marker. Every
 * address recorded as "/404" is remembered, so when the tracker sends it again
 * as the next view's referrer it is "/404" there too; an address of ours that
 * fails the path rule is replaced in the referrer as well.
 *
 * Everything else, query and fragment included, is sent as it is, which is
 * what /privacy says. An address that cannot be read is not sent, and a filter
 * that fails sends nothing. Installed by app/_components/UmamiTag.tsx, which
 * renders the tag.
 */

/** The global the tracker calls before it sends; the tag names it in `data-before-send`. */
export const UMAMI_BEFORE_SEND = "covateUmamiBeforeSend";

/** The attribute app/[locale]/not-found.tsx renders, and the filter looks for. */
export const UMAMI_NOT_FOUND_ATTR = "data-umami-not-found";

export function installUmamiFilter(win: Record<string, unknown>, name: string, notFoundAttr: string): void {
  try {
    const doc = win.document as { querySelector?: (selector: string) => unknown } | undefined;
    const recordedAs404: string[] = [];
    const onNotFoundPage = (): boolean => {
      try {
        return !!(doc && typeof doc.querySelector === "function" && doc.querySelector("[" + notFoundAttr + "]"));
      } catch {
        return false;
      }
    };
    const pathIsOurs = (address: URL): boolean => {
      let path: string;
      try {
        path = decodeURIComponent(address.pathname);
      } catch {
        return false;
      }
      return /^[a-z0-9/_-]*$/.test(path);
    };
    const pageOf = (address: URL): string => address.origin + address.pathname;
    const as404 = (address: URL): string => {
      address.pathname = "/404";
      address.search = "";
      address.hash = "";
      return address.toString();
    };
    win[name] = (_type: string, payload: Record<string, unknown> | null) => {
      try {
        if (!payload || typeof payload !== "object") return payload;
        let ours: string | null = null;
        if (typeof payload.url === "string" && payload.url !== "") {
          let address: URL;
          try {
            address = new URL(payload.url);
          } catch {
            return null;
          }
          ours = address.origin;
          if (onNotFoundPage() || !pathIsOurs(address)) {
            if (recordedAs404.indexOf(pageOf(address)) < 0) recordedAs404.push(pageOf(address));
            payload.url = as404(address);
            payload.title = "404";
          }
        }
        if (typeof payload.referrer === "string" && payload.referrer !== "") {
          let from: URL | null = null;
          try {
            from = new URL(payload.referrer);
          } catch {
            from = null;
          }
          if (from === null) {
            payload.referrer = "";
          } else if ((ours === null || from.origin === ours) && (recordedAs404.indexOf(pageOf(from)) >= 0 || !pathIsOurs(from))) {
            payload.referrer = as404(from);
          }
        }
        return payload;
      } catch {
        return null;
      }
    };
  } catch {
    // Without a hook Umami would send unfiltered addresses: send nothing instead.
    try {
      win[name] = () => null;
    } catch {
      // Nothing left to do.
    }
  }
}
