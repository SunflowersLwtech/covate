import type { Metadata } from "next";
import { cookies } from "next/headers";
import { authConfigured, SESSION_COOKIE, verifySession } from "../lib/auth";
import { db } from "../lib/db";
import { GITHUB, SITE } from "../layout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your learning ledger | Covate",
  description: "Review every quiz Covate gave you, track your progress, and see the concepts you keep missing.",
  alternates: { canonical: "/dashboard" },
  robots: { index: false, follow: false },
};

type SessionRow = {
  project: string | null;
  change_summary: string | null;
  question_count: number;
  correct_count: number;
  completed_at: string | null;
};
type TopicRow = { topic: string; total: number; correct: number };
type UserRow = { name: string | null; github_login: string; avatar_url: string | null; plan: string; sync_token: string };

async function loadData(userId: string) {
  const sql = db();
  const [users, sessions, topics] = await Promise.all([
    sql`select name, github_login, avatar_url, plan, sync_token from platform_user where id = ${userId}`,
    sql`select project, change_summary, question_count, correct_count, completed_at
        from learning_session where user_id = ${userId}
        order by synced_at desc limit 20`,
    sql`select topic, count(*)::int as total, sum(case when is_correct then 1 else 0 end)::int as correct
        from quiz_answer where user_id = ${userId} and topic is not null
        group by topic order by (sum(case when is_correct then 1 else 0 end)::float / count(*)) asc limit 8`,
  ]);
  return {
    user: (users as unknown as UserRow[])[0] ?? null,
    sessions: sessions as unknown as SessionRow[],
    topics: topics as unknown as TopicRow[],
  };
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-deep text-primary">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <a href={SITE} className="font-mono text-sm font-semibold tracking-tight text-primary">
          covate<span className="text-accent">.</span>
        </a>
        <nav className="flex items-center gap-6 text-sm text-secondary">
          <a href={SITE} className="transition-colors hover:text-primary">Home</a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">GitHub</a>
          <a href="/api/auth/logout" className="transition-colors hover:text-primary">Sign out</a>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-6">{children}</main>
    </div>
  );
}

function SignIn({ configured }: { configured: boolean }) {
  return (
    <Shell>
      <div className="mx-auto max-w-xl pt-16 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">Learning platform</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight text-primary">
          Your <span className="text-brand">learning ledger</span>
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          Sign in to review every quiz Covate gave you on your own code, track your progress over time, and see the
          concepts you keep missing — turned into a personalized study plan.
        </p>
        {configured ? (
          <a
            href="/api/auth/github"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-deep transition hover:bg-accent-soft"
          >
            Continue with GitHub
          </a>
        ) : (
          <div className="mt-8 rounded-xl border border-border bg-surface/40 p-5 text-sm text-secondary">
            The Learning Platform dashboard is in early access and not open for sign-in yet.{" "}
            <a href={`${SITE}/#join`} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              Join the waitlist
            </a>{" "}
            and we&apos;ll email your invite. The free open-source MCP is available now on{" "}
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              GitHub
            </a>.
          </div>
        )}
      </div>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface/40 p-5">
      <p className="text-3xl font-semibold text-primary">{value}</p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">{label}</p>
    </div>
  );
}

export default async function DashboardPage() {
  // Signed-out (or unconfigured) → sign-in view.
  if (!authConfigured() || !process.env.DATABASE_URL) {
    return <SignIn configured={authConfigured() && Boolean(process.env.DATABASE_URL)} />;
  }
  const jar = await cookies();
  const userId = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!userId) return <SignIn configured />;

  let data: Awaited<ReturnType<typeof loadData>> | null = null;
  try {
    data = await loadData(userId);
  } catch {
    return <SignIn configured />;
  }
  if (!data?.user) return <SignIn configured />;

  const { user, sessions, topics } = data;
  const totalQ = sessions.reduce((n, s) => n + (s.question_count || 0), 0);
  const totalC = sessions.reduce((n, s) => n + (s.correct_count || 0), 0);
  const accuracy = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;

  return (
    <Shell>
      <div className="flex items-center gap-4">
        {user.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar_url} alt="" className="h-12 w-12 rounded-full border border-border" />
        ) : null}
        <div>
          <h1 className="text-2xl font-semibold text-primary">{user.name ?? user.github_login}</h1>
          <p className="font-mono text-xs text-dim">{user.plan === "paid" ? "Covate Plus" : "Free tier"} · @{user.github_login}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Sessions" value={String(sessions.length)} />
        <Stat label="Questions" value={String(totalQ)} />
        <Stat label="Correct" value={String(totalC)} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
      </div>

      {/* Weak topics */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-primary">Concepts to revisit</h2>
        {topics.length ? (
          <ul className="mt-4 space-y-2">
            {topics.map((t) => {
              const pct = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0;
              return (
                <li key={t.topic} className="flex items-center justify-between rounded-lg border border-border bg-surface/30 px-4 py-3">
                  <span className="text-sm text-secondary">{t.topic}</span>
                  <span className="font-mono text-xs text-dim">{t.correct}/{t.total} · {pct}%</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-dim">No topic data yet — quiz yourself with the MCP and it&apos;ll show up here.</p>
        )}
      </section>

      {/* Recent sessions */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-primary">Recent learning sessions</h2>
        {sessions.length ? (
          <div className="mt-4 divide-y divide-border border-y border-border">
            {sessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-primary">{s.change_summary ?? s.project ?? "Session"}</p>
                  {s.project ? <p className="font-mono text-[11px] text-dim">{s.project}</p> : null}
                </div>
                <span className="ml-4 shrink-0 font-mono text-xs text-secondary">{s.correct_count}/{s.question_count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-border bg-surface/40 p-5 text-sm text-secondary">
            No sessions synced yet. Run <code className="rounded bg-deep px-1.5 py-0.5 font-mono text-accent">python -m covate.platform_sync</code> from a
            project (with <code className="rounded bg-deep px-1.5 py-0.5 font-mono text-accent">COVATE_SYNC_TOKEN={user.sync_token}</code>) to push your local learning history here.
          </div>
        )}
      </section>
    </Shell>
  );
}
