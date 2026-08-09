"use client";

import { useState } from "react";

/**
 * Reveal / copy / rotate the sync token.
 *
 * The token is deliberately NOT rendered into the dashboard HTML: it is fetched from
 * /api/account/sync-token only when the signed-in user asks for it. Rotating replaces
 * it server-side, which instantly stops any MCP client still using the old one — which
 * is the point, if you think it leaked.
 */
export default function SyncToken() {
  const [token, setToken] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | "reveal" | "rotate">(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function call(method: "GET" | "POST") {
    setBusy(method === "GET" ? "reveal" : "rotate");
    setError(null);
    setCopied(false);
    try {
      const res = await fetch("/api/account/sync-token", { method });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !data.token) throw new Error(data.error ?? `HTTP ${res.status}`);
      setToken(data.token);
      setConfirming(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  async function copy() {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
    } catch {
      setError("Could not copy — select the token and copy it manually.");
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-border bg-surface/40 p-5">
      <p className="text-sm text-secondary">
        The MCP sync client authenticates with this token. From a project you have used Covate in, run{" "}
        <code className="block overflow-x-auto rounded bg-deep px-3 py-2 font-mono text-[11px] text-accent">
          COVATE_SYNC_URL=https://covate.org COVATE_SYNC_TOKEN=&lt;token&gt; python -m covate.platform_sync
        </code>{" "}
        It is a password: anything holding it can write sessions to your ledger.
      </p>

      {token ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <code className="min-w-0 flex-1 break-all rounded-lg bg-deep px-3 py-2 font-mono text-xs text-accent">
            {token}
          </code>
          <button
            type="button"
            onClick={copy}
            className="rounded-lg border border-border px-3 py-2 font-mono text-xs text-secondary transition hover:text-primary"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => call("GET")}
          disabled={busy !== null}
          className="rounded-lg border border-border px-4 py-2 font-mono text-xs text-secondary transition hover:text-primary disabled:opacity-60"
        >
          {busy === "reveal" ? "Fetching…" : token ? "Refresh" : "Show my sync token"}
        </button>

        {confirming ? (
          <>
            <span className="font-mono text-xs text-dim">
              Rotating breaks any client still using the old token. Sure?
            </span>
            <button
              type="button"
              onClick={() => call("POST")}
              disabled={busy !== null}
              className="rounded-lg bg-accent px-4 py-2 font-mono text-xs font-semibold text-deep transition hover:bg-accent-soft disabled:opacity-60"
            >
              {busy === "rotate" ? "Rotating…" : "Yes, rotate it"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={busy !== null}
            className="rounded-lg border border-border px-4 py-2 font-mono text-xs text-secondary transition hover:text-primary disabled:opacity-60"
          >
            Rotate token
          </button>
        )}
      </div>

      {error ? (
        <p role="alert" className="mt-3 font-mono text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
