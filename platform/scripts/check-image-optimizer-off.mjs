// Post-build check: the image optimizer must stay off.
//
// Nothing renders next/image and public/ holds the only bitmap (logo.png), yet a
// default build still serves /_next/image — the endpoint behind three of the
// critical/high advisories the 16.4.3 upgrade closed. next.config.ts sets
// images.unoptimized; this check fails if a later edit turns it back on, so the
// route cannot silently come back.
import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync(".next/images-manifest.json", "utf8"));

if (manifest.images?.unoptimized !== true) {
  console.error(
    "check-image-optimizer-off: .next/images-manifest.json has" +
      ` images.unoptimized=${JSON.stringify(manifest.images?.unoptimized)}, expected true.` +
      " Restore `images: { unoptimized: true }` in next.config.ts" +
      " — /_next/image is served again without it.",
  );
  process.exit(1);
}

console.log("check-image-optimizer-off: image optimizer is disabled");
