"use client";

import { useState } from "react";

// Public Web3Forms client key (same one the other landing pages use; submissions
// land in the shared team inbox). The subject tags this as the Covate waitlist.
const WEB3FORMS_KEY = "4d8bb500-1e3c-40b0-9626-c584cac84224";

export function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [email, setEmail] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "New Covate Learning Platform waitlist signup",
          from_name: "Covate Platform",
          email,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="rounded-lg border border-accent/40 bg-accent/10 px-5 py-4 text-sm text-accent-soft">
        You&rsquo;re on the list. We&rsquo;ll email your early-access invite when the Learning Platform opens.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@dev.com"
        aria-label="Email address"
        className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-primary placeholder:text-dim outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-deep transition hover:bg-accent-soft disabled:opacity-60"
      >
        {status === "sending" ? "Joining…" : "Join the waitlist"}
      </button>
      {status === "error" && (
        <span className="text-xs text-red-400 sm:hidden">Something went wrong — try again.</span>
      )}
    </form>
  );
}
