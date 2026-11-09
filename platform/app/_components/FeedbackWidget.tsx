/**
 * The Agentic CS feedback widget — the small "Feedback" button fixed to the
 * corner of the page, opening a form for reporting problems and ideas. Both
 * the script and the submissions live on our own feedback service, Agentic CS
 * (agenticcs.net); it is not analytics and sets no cookie.
 *
 * The widget key is public by design: it grants nothing but the right to
 * submit feedback for this product, and the submit route accepts it only from
 * a covate.org page.
 *
 * Anonymous on purpose: this layout is prerendered (generateStaticParams in
 * the root layout; proxy.ts rewrites every public URL onto these trees), so
 * nothing here can know who is signed in. The widget generates its own
 * per-browser id (localStorage) instead — the privacy policy's feedback-form
 * section says exactly that.
 *
 * A build without NEXT_PUBLIC_ACS_FEEDBACK_WIDGET_KEY renders nothing at all.
 */
// Agentic CS's Cloudflare mirror of the file: Vercel's DDoS challenge on agenticcs.net cannot hide it.
export const ACS_FEEDBACK_WIDGET_SRC = "https://widget.agenticcs.net/feedback/widget.js";

export function FeedbackWidget() {
  const widgetKey = process.env.NEXT_PUBLIC_ACS_FEEDBACK_WIDGET_KEY?.trim();
  if (!widgetKey) return null;
  return (
    // A plain script tag, not next/script: the widget positions its own
    // button and needs no hydration help; `defer` keeps it behind the page.
    <script
      src={ACS_FEEDBACK_WIDGET_SRC}
      defer
      data-product="covate"
      data-widget-key={widgetKey}
    />
  );
}
