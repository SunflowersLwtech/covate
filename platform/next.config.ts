import { execFileSync } from "node:child_process";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// The commit this build came from, served at /version.json so a deploy can be
// told apart from the one before it. Falls back to "unknown" outside a checkout.
function gitSha(): string {
  try {
    return execFileSync("git", ["rev-parse", "--short=12", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "unknown";
  }
}

const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts");

const nextConfig: NextConfig = {
  // Nothing renders next/image and logo.png is served from public/, yet the default
  // /_next/image endpoint still answers — three of the critical/high advisories the
  // 16.4.3 upgrade closed live behind it. Turn the optimizer off so the next one can't.
  images: { unoptimized: true },
  // Hand proxy.ts the request URL as the server saw it. By default Next renames loopback
  // hosts to localhost in it (and again in the rewrite it returns), while its router
  // compares rewrites with the raw bound host: under `next start -H 127.0.0.1` every
  // locale rewrite counted as external and looped through proxy.ts as 307s.
  skipProxyUrlNormalize: true,
  env: {
    COVATE_BUILD_SHA: gitSha(),
    COVATE_BUILT_AT: new Date().toISOString(),
  },
  // Retire the temporary Vercel domain: 301 everything on covate-platform.vercel.app
  // to the real domain covate.org (canonical), per the "use real domains" directive.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "covate-platform.vercel.app" }],
        destination: "https://covate.org/:path*",
        permanent: true,
      },
      // www answered 200 alongside the apex while every canonical points at the
      // apex. A canonical is a hint; two hosts serving the same pages is a
      // duplicate. Converge them where it is an instruction instead.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.covate.org" }],
        destination: "https://covate.org/:path*",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
