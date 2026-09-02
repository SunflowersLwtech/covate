// Which commit is this? Deploys are prebuilt on a laptop and pushed with `vercel deploy
// --prebuilt`, so nothing on the wire otherwise distinguishes a fresh deploy from one
// that silently never happened. next.config.ts bakes the sha in at build time.
export const dynamic = "force-static";

export function GET() {
  return Response.json(
    { commit: process.env.COVATE_BUILD_SHA ?? "unknown", builtAt: process.env.COVATE_BUILT_AT ?? null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
