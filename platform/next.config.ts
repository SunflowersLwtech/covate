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
