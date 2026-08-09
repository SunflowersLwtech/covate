"use client";

import { useEffect, useRef, useState } from "react";

type Started = { user_code: string; verification_uri: string; interval: number; expires_in: number };

/**
 * Sign in without the app ever holding a client secret: GitHub shows the user a code,
 * the user types it on github.com, and we poll until GitHub says they are who they say.
 */
export default function DeviceSignIn() {
  const [started, setStarted] = useState<Started | null>(null);
  const [status, setStatus] = useState<"idle" | "starting" | "waiting" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function begin() {
    setStatus("starting");
    setMessage(null);
    try {
      const res = await fetch("/api/auth/device/start", { method: "POST" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as Started;
      setStarted(data);
      setStatus("waiting");
      window.open(data.verification_uri, "_blank", "noopener,noreferrer");
      poll(data.interval);
    } catch {
      setStatus("error");
      setMessage("Could not reach GitHub. Please try again.");
    }
  }

  function poll(intervalSeconds: number) {
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/auth/device/poll", { method: "POST" });
        const data = (await res.json()) as { status: string; interval?: number };
        if (data.status === "authorized") {
          window.location.href = "/dashboard";
          return;
        }
        if (data.status === "expired" || data.status === "denied") {
          setStatus("error");
          setStarted(null);
          setMessage(
            data.status === "denied"
              ? "Sign-in was declined on GitHub."
              : "That code expired. Start again and it will only take a moment.",
          );
          return;
        }
        poll(data.status === "slow_down" ? data.interval ?? intervalSeconds + 5 : intervalSeconds);
      } catch {
        poll(intervalSeconds);
      }
    }, Math.max(intervalSeconds, 5) * 1000);
  }

  if (started) {
    return (
      <div className="mt-8 rounded-xl border border-border bg-surface/40 p-6 text-left">
        <p className="text-sm text-secondary">
          Enter this code on{" "}
          <a
            href={started.verification_uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4 hover:text-accent-soft"
          >
            github.com/login/device
          </a>
          , then come back here — this page signs you in on its own.
        </p>
        <p className="mt-4 select-all text-center font-mono text-3xl font-semibold tracking-[0.3em] text-primary">
          {started.user_code}
        </p>
        <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
          Waiting for GitHub…
        </p>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={begin}
        disabled={status === "starting"}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-deep transition hover:bg-accent-soft disabled:opacity-60"
      >
        {status === "starting" ? "Contacting GitHub…" : "Continue with GitHub"}
      </button>
      {message ? (
        <p role="alert" className="mt-4 text-sm text-secondary">
          {message}
        </p>
      ) : null}
    </>
  );
}
