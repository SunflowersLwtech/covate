-- Covate Learning Platform — Postgres schema (paid cloud layer).
--
-- Stores the learning records that the open-source Covate MCP produces locally and
-- syncs up (opt-in, per user). Everything is keyed to a platform_user so review,
-- progress tracking and personalized study can be computed per developer.
--
-- Target: Postgres (Supabase, project `covate`). pgvector is optional and only needed for
-- topic-similarity ("study concepts like the ones you keep missing"); guarded so the
-- schema still applies without the extension.

create extension if not exists "pgcrypto";       -- gen_random_uuid()
-- create extension if not exists "vector";       -- enable when topic embeddings ship (step 4)

-- ── Users ─────────────────────────────────────────────────────────────────────
create table if not exists platform_user (
  id            uuid primary key default gen_random_uuid(),
  github_id     bigint unique not null,
  github_login  text not null,
  email         text,
  name          text,
  avatar_url    text,
  plan          text not null default 'free' check (plan in ('free', 'paid')),
  -- The MCP sync client authenticates with this opaque per-user token (generated on
  -- account creation, shown once in the dashboard, pasted into the MCP config). The
  -- ingestion API looks the user up by it. Web dashboard login uses GitHub OAuth instead.
  sync_token    text unique not null default encode(gen_random_bytes(24), 'hex'),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Learning sessions (one per completed learning_session quiz run) ─────────────
create table if not exists learning_session (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references platform_user(id) on delete cascade,
  -- Idempotency: the MCP client sends a stable local id so re-syncs don't duplicate.
  client_id     text not null,
  project       text,                    -- repo / workspace name
  change_summary text,                   -- what recent change the quiz was about
  question_count int not null default 0,
  correct_count  int not null default 0,
  started_at    timestamptz,
  completed_at  timestamptz,
  synced_at     timestamptz not null default now(),
  unique (user_id, client_id)
);

-- ── Individual quiz answers ────────────────────────────────────────────────────
create table if not exists quiz_answer (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references learning_session(id) on delete cascade,
  user_id       uuid not null references platform_user(id) on delete cascade,
  question      text not null,
  options       jsonb,
  correct_answer text,
  user_answer   text,
  is_correct    boolean,
  explanation   text,
  topic         text,                    -- coarse bucket, e.g. "async", "types", "sql"
  concept       text,                    -- finer, e.g. "Promise.all error handling"
  -- topic_embedding vector(384),        -- enable with pgvector for study recommendations
  created_at    timestamptz not null default now()
);

-- ── Per-topic rollup (drives progress charts + the personalized study plan) ─────
create table if not exists topic_progress (
  user_id       uuid not null references platform_user(id) on delete cascade,
  topic         text not null,
  total_answered int not null default 0,
  total_correct  int not null default 0,
  last_seen     timestamptz,
  -- next_review drives spaced repetition (step 4); null = not scheduled yet.
  next_review   timestamptz,
  primary key (user_id, topic)
);

-- ── Indexes for the review dashboard + progress queries ────────────────────────
create index if not exists idx_session_user_time   on learning_session (user_id, completed_at desc);
create index if not exists idx_answer_session       on quiz_answer (session_id);
create index if not exists idx_answer_user_topic    on quiz_answer (user_id, topic);
create index if not exists idx_answer_user_wrong    on quiz_answer (user_id) where is_correct = false;
create index if not exists idx_progress_review      on topic_progress (user_id, next_review);
