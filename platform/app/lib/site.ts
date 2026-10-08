// Site-wide constants. Live custom domain (covate.org, on Cloudflare DNS → Vercel);
// the vercel.app URL still serves but 301s here (next.config.ts).
// COVATE_SITE_URL is set only by scripts/dev.sh. Local web sign-in then sends GitHub a
// localhost callback, which the production OAuth app rejects, instead of a callback that
// would complete on production and write a platform_user row there.
export const SITE = process.env.COVATE_SITE_URL ?? "https://covate.org";
export const GITHUB = "https://github.com/SunflowersLwtech/covate";
