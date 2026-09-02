import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { authConfigured, SESSION_COOKIE, verifySession, webAuthConfigured } from "../../lib/auth";
import DeviceSignIn from "./DeviceSignIn";
import SyncToken from "./SyncToken";
import { db } from "../../lib/db";
import { GITHUB } from "../../lib/site";
import { NAV, SIGN_OUT, SiteHeader } from "../../_components/SiteHeader";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.meta");
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/dashboard" },
    robots: { index: false, follow: false },
  };
}

type SessionRow = {
  project: string | null;
  change_summary: string | null;
  question_count: number;
  correct_count: number;
  completed_at: string | null;
};
type TopicRow = { topic: string; total: number; correct: number };
type UserRow = { name: string | null; github_login: string; avatar_url: string | null };

async function loadData(userId: string) {
  const sql = db();
  const [users, sessions, topics] = await Promise.all([
    sql`select name, github_login, avatar_url from platform_user where id = ${userId}`,
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

function Shell({ children, signedIn = false }: { children: React.ReactNode; signedIn?: boolean }) {
  return (
    <div className="min-h-screen bg-deep text-primary">
      <SiteHeader items={signedIn ? [...NAV.dashboard, SIGN_OUT] : NAV.dashboard} width="5xl" />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-6">{children}</main>
    </div>
  );
}

// The error codes the OAuth callback and the sign-in route actually redirect with.
const SIGN_IN_ERRORS = ["not_configured", "bad_state", "login_failed"] as const;

async function SignIn({ configured, error }: { configured: boolean; error?: string }) {
  const t = await getTranslations("dashboard");
  const webConfigured = webAuthConfigured();
  const known = SIGN_IN_ERRORS.find((code) => code === error);
  const message = error ? (known ? t(`errors.${known}`) : t("errors.generic")) : null;
  return (
    <Shell>
      <div className="mx-auto max-w-xl pt-16 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">{t("signIn.eyebrow")}</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight text-primary">
          {t.rich("signIn.title", { brand: (chunks) => <span className="text-brand">{chunks}</span> })}
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          {t("signIn.body")}
        </p>
        {message ? (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-border bg-surface/40 p-4 text-sm text-secondary"
          >
            {message}
          </p>
        ) : null}
        {configured ? (
          webConfigured ? (
            <a
              href="/api/auth/github"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-deep transition hover:bg-accent-soft"
            >
              {t("signIn.continue")}
            </a>
          ) : (
            <DeviceSignIn />
          )
        ) : (
          <div className="mt-8 rounded-xl border border-border bg-surface/40 p-5 text-sm text-secondary">
            {t.rich("signIn.unavailable", {
              link: (chunks) => (
                <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4 hover:text-accent-soft">
                  {chunks}
                </a>
              ),
            })}
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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const errorParam = (await searchParams).error;
  const error = Array.isArray(errorParam) ? errorParam[0] : errorParam;
  // Signed-out (or unconfigured) → sign-in view.
  if (!authConfigured() || !process.env.DATABASE_URL) {
    return <SignIn configured={authConfigured() && Boolean(process.env.DATABASE_URL)} error={error} />;
  }
  const jar = await cookies();
  const userId = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!userId) return <SignIn configured error={error} />;

  let data: Awaited<ReturnType<typeof loadData>> | null = null;
  try {
    data = await loadData(userId);
  } catch {
    return <SignIn configured error={error} />;
  }
  if (!data?.user) return <SignIn configured error={error} />;

  const t = await getTranslations("dashboard");
  const { user, sessions, topics } = data;
  const totalQ = sessions.reduce((n, s) => n + (s.question_count || 0), 0);
  const totalC = sessions.reduce((n, s) => n + (s.correct_count || 0), 0);
  const accuracy = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;

  return (
    <Shell signedIn>
      <div className="flex items-center gap-4">
        {user.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar_url} alt="" className="h-12 w-12 rounded-full border border-border" />
        ) : null}
        <div>
          <h1 className="text-2xl font-semibold text-primary">{user.name ?? user.github_login}</h1>
          <p className="font-mono text-xs text-dim">@{user.github_login}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label={t("stats.sessions")} value={String(sessions.length)} />
        <Stat label={t("stats.questions")} value={String(totalQ)} />
        <Stat label={t("stats.correct")} value={String(totalC)} />
        <Stat label={t("stats.accuracy")} value={`${accuracy}%`} />
      </div>

      {/* Weak topics */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-primary">{t("topics.title")}</h2>
        {topics.length ? (
          <ul className="mt-4 space-y-2">
            {topics.map((tp) => {
              const pct = tp.total > 0 ? Math.round((tp.correct / tp.total) * 100) : 0;
              return (
                <li key={tp.topic} className="flex items-center justify-between rounded-lg border border-border bg-surface/30 px-4 py-3">
                  <span className="text-sm text-secondary">{tp.topic}</span>
                  <span className="font-mono text-xs text-dim">{tp.correct}/{tp.total} · {pct}%</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-dim">{t("topics.empty")}</p>
        )}
      </section>

      {/* Recent sessions */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-primary">{t("sessions.title")}</h2>
        {sessions.length ? (
          <div className="mt-4 divide-y divide-border border-y border-border">
            {sessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-primary">{s.change_summary ?? s.project ?? t("sessions.fallbackName")}</p>
                  {s.project ? <p className="font-mono text-[11px] text-dim">{s.project}</p> : null}
                </div>
                <span className="ml-4 shrink-0 font-mono text-xs text-secondary">{s.correct_count}/{s.question_count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-border bg-surface/40 p-5 text-sm text-secondary">
            {t.rich("sessions.empty", {
              code: (chunks) => <code className="rounded bg-deep px-1.5 py-0.5 font-mono text-accent">{chunks}</code>,
              placeholder: "<token>",
            })}
          </div>
        )}
      </section>

      {/* Sync token — always reachable, not a one-time reveal */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-primary">{t("syncToken.title")}</h2>
        <SyncToken />
      </section>
    </Shell>
  );
}
