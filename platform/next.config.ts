import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
