#!/usr/bin/env bash
# Local stack for the covate platform (platform/, Next.js).
#
#   scripts/dev.sh up       Postgres 17 in Docker; schema + synthetic seed on first run; next dev
#   scripts/dev.sh down     stop next dev and the Postgres container (data is kept)
#   scripts/dev.sh reset    drop the local database and rebuild it from schema + seed
#   scripts/dev.sh psql     psql on the local database
#   scripts/dev.sh status   what is running
#
# Nothing here reaches production. DATABASE_URL points at 127.0.0.1, and the values
# below are exported to `next dev` only, never written into platform/.env*: a .env.local
# is read by production builds too, so a localhost value there would ship in a release.
# The production Supabase project is INACTIVE and has no snapshot; the data is synthetic.
#
# Sign-in: the device flow (the "sign in with GitHub" code on /dashboard) needs only the
# public OAuth client id, and it works locally. The redirect flow needs a callback URL
# that GitHub has registered for this host, which it does not have for localhost yet.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLAT="$ROOT/platform"
PORT="${COVATE_DEV_PORT:-3000}"
PG_CONTAINER="covate-devenv-pg"
PG_VOLUME="covate-devenv-pgdata"
PG_PORT="${COVATE_DEV_PG_PORT:-55432}"
PG_USER="covate"
PG_DB="covate"
PG_PASSWORD="covate-local"
STATE="${COVATE_DEVENV_STATE:-$HOME/.local/state/covate-devenv}"
PIDFILE="$STATE/next-$PORT.pid"
LOGFILE="$STATE/next-$PORT.log"
LOCK_HASH="$STATE/npm-lock.sha256"
ENV_FILE="$HOME/.config/duocode/covate-devenv.env"

log() { printf '[dev] %s\n' "$*"; }
die() { printf '[dev] %s\n' "$*" >&2; exit 1; }

need() { command -v "$1" >/dev/null 2>&1 || die "missing command: $1"; }

# The OAuth client id is public (it is in every sign-in redirect URL), but it is kept
# out of the repo anyway. SESSION_SECRET is generated once and never leaves this machine.
load_env_file() {
  mkdir -p "$(dirname "$ENV_FILE")"
  if [ ! -f "$ENV_FILE" ]; then
    touch "$ENV_FILE"
    chmod 600 "$ENV_FILE"
    printf 'GITHUB_OAUTH_CLIENT_ID=%s\n' "${COVATE_GITHUB_CLIENT_ID:-}" >> "$ENV_FILE"
    printf 'SESSION_SECRET=%s\n' "$(openssl rand -hex 32)" >> "$ENV_FILE"
  fi
  # shellcheck disable=SC1090
  set -a; . "$ENV_FILE"; set +a
  if [ -z "${GITHUB_OAUTH_CLIENT_ID:-}" ]; then
    log "GITHUB_OAUTH_CLIENT_ID is empty in $ENV_FILE: device sign-in will report not_configured"
  fi
}

pg_running() {
  [ "$(docker inspect -f '{{.State.Running}}' "$PG_CONTAINER" 2>/dev/null || echo false)" = "true" ]
}

pg_exec() {
  docker exec -i "$PG_CONTAINER" psql -X -v ON_ERROR_STOP=1 -U "$PG_USER" -d "$PG_DB"
}

pg_query() {
  docker exec "$PG_CONTAINER" psql -X -v ON_ERROR_STOP=1 -U "$PG_USER" -d "$PG_DB" -tA -c "$1"
}

pg_up() {
  need docker
  docker info >/dev/null 2>&1 || die "Docker is not running"
  if ! pg_running; then
    docker rm -f "$PG_CONTAINER" >/dev/null 2>&1 || true
    log "starting Postgres 17 on 127.0.0.1:$PG_PORT"
    docker run -d --name "$PG_CONTAINER" \
      -e POSTGRES_USER="$PG_USER" -e POSTGRES_PASSWORD="$PG_PASSWORD" -e POSTGRES_DB="$PG_DB" \
      -p "127.0.0.1:$PG_PORT:5432" -v "$PG_VOLUME:/var/lib/postgresql/data" \
      postgres:17 >/dev/null
  fi
  local i=0
  until docker exec "$PG_CONTAINER" pg_isready -q -U "$PG_USER" -d "$PG_DB"; do
    i=$((i + 1)); [ "$i" -le 60 ] || die "Postgres did not become ready"; sleep 1
  done
  local has
  has="$(pg_query "select to_regclass('public.platform_user') is not null")"
  if [ "$has" != "t" ]; then
    log "applying db/schema.sql"
    pg_exec < "$PLAT/db/schema.sql" >/dev/null
    log "loading synthetic seed"
    pg_exec < "$ROOT/scripts/devenv/seed.sql" >/dev/null
  fi
}

deps_sync() {
  need node
  mkdir -p "$STATE"
  local now
  now="$(shasum -a 256 "$PLAT/package-lock.json" | awk '{print $1}')"
  if [ ! -d "$PLAT/node_modules" ] || [ "$now" != "$(cat "$LOCK_HASH" 2>/dev/null || true)" ]; then
    log "npm ci (package-lock.json changed or node_modules missing)"
    (cd "$PLAT" && npm ci --no-audit --no-fund)
    printf '%s\n' "$now" > "$LOCK_HASH"
  fi
}

next_running() {
  [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null
}

port_free_or_die() {
  if ! next_running && curl -s -o /dev/null "http://127.0.0.1:$PORT/" 2>/dev/null; then
    die "port $PORT is taken by something else; set COVATE_DEV_PORT"
  fi
}

next_up() {
  mkdir -p "$STATE"
  if next_running; then
    log "next dev already running (pid $(cat "$PIDFILE"))"
    return
  fi
  log "starting next dev on http://localhost:$PORT (log: $LOGFILE)"
  # Own process group, so `down` also stops the autoreloader's children.
  set -m
  (
    cd "$PLAT"
    exec env \
      DATABASE_URL="postgres://$PG_USER:$PG_PASSWORD@127.0.0.1:$PG_PORT/$PG_DB" \
      DATABASE_SSL=disable \
      COVATE_SITE_URL="http://localhost:$PORT" \
      GITHUB_OAUTH_CLIENT_ID="${GITHUB_OAUTH_CLIENT_ID:-}" \
      SESSION_SECRET="$SESSION_SECRET" \
      ./node_modules/.bin/next dev --port "$PORT"
  ) >"$LOGFILE" 2>&1 &
  echo $! > "$PIDFILE"
  set +m
  local i=0
  # "/" and not "/en": proxy.ts sends a /en prefix to a redirect, the canonical English URL is "/".
  until [ "$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/" 2>/dev/null)" = "200" ]; do
    i=$((i + 1))
    if ! next_running; then die "next dev exited; see $LOGFILE"; fi
    [ "$i" -le 120 ] || die "next dev not ready after 120s; see $LOGFILE"
    sleep 1
  done
  log "ready: http://localhost:$PORT/"
}

next_down() {
  # Every instance this script started, whatever port it was started on.
  local f pid i
  for f in "$STATE"/next-*.pid; do
    [ -f "$f" ] || continue
    pid="$(cat "$f")"
    if kill -0 "$pid" 2>/dev/null; then
      kill -TERM -- "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null || true
      i=0
      while kill -0 "$pid" 2>/dev/null && [ "$i" -lt 10 ]; do sleep 1; i=$((i + 1)); done
      kill -KILL -- "-$pid" 2>/dev/null || true
      log "stopped next dev ($(basename "$f" .pid), pid $pid)"
    fi
    rm -f "$f"
  done
}

pg_down() {
  if pg_running; then
    docker stop "$PG_CONTAINER" >/dev/null
    log "stopped $PG_CONTAINER (volume $PG_VOLUME kept)"
  fi
}

cmd_up() {
  load_env_file
  port_free_or_die
  pg_up
  deps_sync
  next_up
}

cmd_down() {
  load_env_file
  next_down
  pg_down
}

cmd_reset() {
  load_env_file
  next_down
  need docker
  docker rm -f "$PG_CONTAINER" >/dev/null 2>&1 || true
  docker volume rm "$PG_VOLUME" >/dev/null 2>&1 || true
  log "local database dropped; rebuilding"
  cmd_up
}

cmd_psql() {
  pg_running || die "Postgres is not running; run scripts/dev.sh up"
  docker exec -it "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB"
}

cmd_status() {
  local f
  for f in "$STATE"/next-*.pid; do
    [ -f "$f" ] || continue
    if kill -0 "$(cat "$f")" 2>/dev/null; then
      log "next dev: running ($(basename "$f" .pid), pid $(cat "$f"))"
    else
      log "next dev: stale pidfile $(basename "$f" .pid)"
    fi
  done
  ls "$STATE"/next-*.pid >/dev/null 2>&1 || log "next dev: stopped"
  if pg_running; then log "postgres: running ($PG_CONTAINER, 127.0.0.1:$PG_PORT)"; else log "postgres: stopped"; fi
}

case "${1:-}" in
  up) cmd_up ;;
  down) cmd_down ;;
  reset) cmd_reset ;;
  psql) cmd_psql ;;
  status) cmd_status ;;
  *) sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'; exit 2 ;;
esac
