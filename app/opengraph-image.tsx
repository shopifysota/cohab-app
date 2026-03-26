import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "NestRules — Free Cohabitation Agreement Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
          padding: "60px",
        }}
      >
        {/* Shield icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.15)",
            marginBottom: "32px",
          }}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "28px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.05em",
            marginBottom: "16px",
          }}
        >
          NESTRULES
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "52px",
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "20px",
          }}
        >
          Free Cohabitation Agreement Generator
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "24px",
            color: "rgba(255,255,255,0.8)",
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: "800px",
          }}
        >
          Create a professional agreement in 5 minutes. Free and easy to use.
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            marginTop: "48px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          <span>✓ Free forever</span>
          <span>✓ Download PDF or DOCX</span>
          <span>✓ No sign-up required</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
