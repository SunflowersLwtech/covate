import { ImageResponse } from "next/og";

// covate.org had og:title but no og:image, so every share and every AI preview
// fell back to whatever the platform guessed. Generated rather than designed:
// the card is the positioning sentence in the site's own palette, so it cannot
// drift from the product the way a hand-exported PNG does.
export const runtime = "nodejs";
export const alt = "Covate — turn AI-assisted coding into real understanding";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0a0e14";
const PANEL = "#131a24";
const RULE = "#232c39";
const INK = "#e6edf3";
const MUTED = "#9aa7b5";
const ACCENT = "#34d399";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              background: ACCENT,
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 30,
              color: INK,
              letterSpacing: "-0.01em",
              fontWeight: 600,
              display: "flex",
            }}
          >
            Covate
          </div>
          <div style={{ flex: 1, display: "flex" }} />
          <div style={{ fontSize: 22, color: MUTED, display: "flex" }}>covate.org</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              fontSize: 68,
              lineHeight: 1.08,
              color: INK,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              maxWidth: 940,
              display: "flex",
            }}
          >
            Turn AI-assisted coding into real understanding.
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              color: MUTED,
              maxWidth: 900,
              display: "flex",
            }}
          >
            An open-source MCP quizzes you on your own diffs, so you learn while you build.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            borderTop: `1px solid ${RULE}`,
            paddingTop: 26,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: ACCENT,
              background: PANEL,
              border: `1px solid ${RULE}`,
              borderRadius: 6,
              padding: "8px 16px",
            }}
          >
            Free · MIT · no sign-up for the MCP
          </div>
        </div>
      </div>
    ),
    size,
  );
}
