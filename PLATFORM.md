# Covate Learning Platform — Design (open-core)

> **Status, 2026-08: this is a design document, not a description of the product.**
> What actually ships today is free: GitHub sign-in, session sync, and a learning ledger
> (sessions, totals, accuracy, worst topics, sync-token reveal/rotate). There is no billing
> integration, no subscription, no paid tier, and nothing on covate.org can be purchased.
> Everything below marked paid/Stripe/study-plan is unbuilt intent.

> The paid, cloud side of Covate. The open-source MCP server (this repo, `src/covate/`)
> stays free forever as the acquisition layer; the **Covate Learning Platform** is a paid
> cloud web app that turns the learning records Covate already produces into a
> personalized programming-learning experience.

## Vision

Covate's `learning_session` MCP tool already generates blocking, interactive quizzes from
a developer's recent code changes and **persists each session and answer locally**
(`src/covate/storage/session_storage.py`, config `auto_save` / `save_answers`). Today that
knowledge is trapped on one machine, session by session.

The **Learning Platform** lifts those records into the cloud and closes the loop:
**review** past sessions, **track progress** over time, surface **weak topics**, and get a
**personalized study plan** — a personalized coding-learning platform built on real,
evidence-based learning moments rather than generic courseware.

## Open-core split

| Free — the Covate MCP (this repo, open-source, MIT) | Paid — the Learning Platform (cloud) |
| --- | --- |
| `learning_session` quizzes from code changes | Cloud sync of learning records (opt-in) |
| `debug_search` project debug-memory RAG | Review dashboard (past quizzes + answers) |
| Local session persistence + local quiz WebUI | Progress tracking + weak-topic analysis |
| Runs fully offline, no account required | Personalized study plan + spaced repetition |
| — | Subscription (Stripe); team/org later |

The MCP never regresses: it works standalone with zero account. Cloud sync is an **opt-in,
account-gated** feature — the code can stay open-source but is a no-op without a platform
account, so the free tool is never crippled.

## Architecture

- **Covate MCP** (existing, Python) + a new **opt-in cloud-sync client**: when the user has
  linked a platform account, completed `learning_session` records are POSTed to the platform
  ingestion API. No account → no sync (unchanged behaviour).
- **Platform web app** — Next.js App Router on Vercel, in `platform/` of this monorepo
  (NOT a new repo — per the one-repo-per-product-line rule):
  - **Auth**: GitHub OAuth (the audience is developers; mirrors the ecosystem).
  - **Ingestion API**: receives learning records (session, quizzes, answers, topics, repo,
    timestamps) keyed to the user.
  - **Dashboard**: review past sessions, progress-over-time charts, weak-topic clustering,
    a personalized study plan (spaced-repetition re-quizzing of missed concepts).
  - **Billing**: Stripe subscription (free tier = limited history/features; paid = full
    history + analytics + personalized study; team plans later).
  - **GEO landing**: server-rendered, JSON-LD + long-tail, same playbook as the other
    landing pages (my lane).
- **Storage**: Postgres + (optional) pgvector for topic similarity — Supabase
  (project `covate`, us-east-1, alongside the other DUOCODE products), one platform DB.

## Tech stack

Next.js (App Router) + Vercel · Postgres (Supabase) · Stripe · GitHub OAuth · Tailwind.
All commits under the A identity (LiuWei), three-end consistent (local = GitHub = prod),
rollback-able. Domain: covate.org (to be purchased).

## Roadmap (build order)

1. **GEO landing page** (`platform/`) — the public acquisition surface + waitlist. *(first)*
2. **Auth + ingestion API + MCP sync client** — link an account, POST learning records.
3. **Review dashboard + progress tracking** — the core paid value.
4. **Personalized study plan + Stripe subscription** — monetization.
5. **GEO/long-tail content** — ongoing organic acquisition.

## Non-goals / guardrails

- Don't cripple or paywall the open-source MCP; the free tool must stay fully functional.
- Don't spawn a new GitHub repo; the platform lives in `platform/` of this repo.
- Keep the Python MCP packaging (`pyproject.toml`, `src/covate/`) isolated from the Node
  app (`platform/` has its own `package.json`); the two don't cross-build.
