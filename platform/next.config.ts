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
    ];
  },
};

export default nextConfig;
