#!/usr/bin/env bash
# The gates CI runs (.github/workflows/ci.yml, platform.yml), for the paths that changed,
# one at a time and in CI's order. Stops at the first failure.
#
#   scripts/check.sh          gates for the changed paths
#   scripts/check.sh --full   also the Python test suite, and every platform gate
#
# Changed paths = committed since the base branch + staged/unstaged + untracked.
# Env: COVATE_CHECK_BASE (default origin/main), COVATE_PYTHON (default python3).
# Not run here: CI's `pip install -e .` packaging job, which needs a clean install.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BASE="${COVATE_CHECK_BASE:-origin/main}"
PY="${COVATE_PYTHON:-python3}"
FULL=0
[ "${1:-}" = "--full" ] && FULL=1

cd "$ROOT"

changed="$({
  git diff --name-only "$BASE"...HEAD
  git diff --name-only HEAD
  git ls-files --others --exclude-standard
} | sort -u)"

touches() { printf '%s\n' "$changed" | grep -q -E "$1"; }

PLATFORM=0
PYTHON=0
if touches '^platform/' || [ "$FULL" = 1 ]; then PLATFORM=1; fi
if touches '^(src/|tests/|pyproject\.toml)' || [ "$FULL" = 1 ]; then PYTHON=1; fi

step() { printf '\n[check] %s\n' "$1"; }

if [ "$PLATFORM" = 0 ] && [ "$PYTHON" = 0 ]; then
  printf '[check] no gated paths changed against %s\n' "$BASE"
  exit 0
fi

if [ "$PLATFORM" = 1 ]; then
  command -v npm >/dev/null 2>&1 || { echo "[check] npm is missing" >&2; exit 1; }
  step "platform: npm ci (lockfile as CI installs it)"
  (cd platform && npm ci --no-audit --no-fund)
  step "platform: i18n red lines (locale parity, CJK hardcode, key resolution)"
  (cd platform && npm run i18n:check)
  step "platform: next build (prerenders every page in every locale)"
  (cd platform && npx next build)
  step "platform: typecheck"
  (cd platform && npx tsc --noEmit)
fi

if [ "$PYTHON" = 1 ]; then
  command -v ruff >/dev/null 2>&1 || { echo "[check] ruff is missing" >&2; exit 1; }
  step "python: ruff, as ci.yml lint job runs it"
  ruff check src/ --ignore E501
  if [ "$FULL" = 1 ]; then
    step "python: test suite (not a CI gate; --full only)"
    PYTHONPATH=src "$PY" -m pytest -q tests
  fi
fi

printf '\n[check] passed\n'
