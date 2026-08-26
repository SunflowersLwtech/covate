// Provision the two standing accounts in the learning-ledger DB, idempotently:
//
//   1. the owner  — github_id 190067321 (SunflowersLwtech), so the row and its
//      sync_token exist before first sign-in; the OAuth upsert (app/lib/users.ts)
//      keys on github_id and never overwrites sync_token, so signing in later
//      adopts this row rather than duplicating it.
//   2. agent-test — a test account for automated agents. Its github_id is a
//      NEGATIVE sentinel: real GitHub ids are always positive, so it can never
//      collide with a person and can never sign in via OAuth. Its only
//      credential is the sync_token this script prints, which authenticates
//      against POST /api/ingest (the whole account-gated surface).
//
// Auth: DATABASE_URL in the environment (the Neon connection string; it is a
// "sensitive" var on Vercel, so mint it from the Neon console or
// `neonctl connection-string`). Never passed on argv.
//
//   cd platform && DATABASE_URL=... node scripts/provision-accounts.mjs
//
// Re-running is safe: existing rows are left untouched and their tokens re-printed.

import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Mint one from the Neon console or `neonctl connection-string`.");
  process.exit(1);
}

const sql = neon(url);

const ACCOUNTS = [
  {
    github_id: 190067321,
    github_login: "SunflowersLwtech",
    email: "duocodetechu@gmail.com",
    name: "LiuWei (owner)",
  },
  {
    github_id: -424242,
    github_login: "agent-test",
    email: "agent-test@duocodetech.com",
    name: "Agent test account (no OAuth login by construction)",
  },
];

for (const a of ACCOUNTS) {
  await sql`
    insert into platform_user (github_id, github_login, email, name)
    values (${a.github_id}, ${a.github_login}, ${a.email}, ${a.name})
    on conflict (github_id) do nothing
  `;
  const rows = await sql`
    select id, github_login, email, plan, sync_token, created_at
      from platform_user where github_id = ${a.github_id}
  `;
  const u = rows[0];
  console.log(`\n${u.github_login} <${u.email}>  plan=${u.plan}  created=${u.created_at.toISOString?.() ?? u.created_at}`);
  console.log(`  platform_user id: ${u.id}`);
  console.log(`  sync_token:       ${u.sync_token}`);
}

console.log(
  "\nRecord the agent-test sync_token in the gitignored .claude/AGENT-NOTES.md, then verify it end to end:" +
    "\n  curl -s https://covate.org/api/ingest -H \"Authorization: Bearer $TOKEN\" \\" +
    "\n    -H 'Content-Type: application/json' -d '{\"client_id\":\"agent-smoke-1\",\"project\":\"smoke\",\"answers\":[]}'" +
    "\n  → {\"ok\":true,...} proves token auth + DB writes; re-posting the same client_id must not duplicate.",
);
