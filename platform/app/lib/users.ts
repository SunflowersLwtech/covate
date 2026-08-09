// Turning a GitHub identity into a platform_user, shared by both sign-in flows.
// Keyed on github_id rather than login so a user who renames their GitHub account
// keeps their learning history, and sync_token is never overwritten — the MCP client
// already has it in a config file somewhere.

import type { GithubUser } from "./auth";
import { db } from "./db";

export async function upsertPlatformUser(gh: GithubUser): Promise<string> {
  const sql = db();
  const rows = (await sql`
    insert into platform_user (github_id, github_login, email, name, avatar_url)
    values (${gh.id}, ${gh.login}, ${gh.email}, ${gh.name}, ${gh.avatar_url})
    on conflict (github_id) do update
      set github_login = excluded.github_login,
          email = excluded.email,
          name = excluded.name,
          avatar_url = excluded.avatar_url,
          updated_at = now()
    returning id
  `) as unknown as Array<{ id: string }>;

  const userId = rows[0]?.id;
  if (!userId) throw new Error("platform_user upsert returned no id");
  return userId;
}
