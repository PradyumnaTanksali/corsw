import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Corner Software · A holding company for software product divisions.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0E0E0E",
          color: "#F5F1E8",
          display: "flex",
          flexDirection: "column",
          padding: "72px",
          position: "relative",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 72,
            width: 1,
            height: "100%",
            background: "#D4452C",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: "#0E0E0E",
              position: "relative",
              border: "1px solid #2A2825",
              display: "flex",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                background: "#F5F1E8",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                background: "#0E0E0E",
                position: "absolute",
                top: 0,
                right: 0,
              }}
            />
            <div
              style={{
                width: 9,
                height: 9,
                background: "#D4452C",
                position: "absolute",
                top: 5,
                left: 5,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 14,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#A8A39A",
            }}
          >
            Corner Software · Est. 2024
          </span>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            fontSize: 84,
            fontWeight: 500,
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            maxWidth: 880,
          }}
        >
          <span>Corner Software builds</span>
          <span>
            software{" "}
            <span style={{ fontStyle: "italic", fontWeight: 400 }}>
              companies.
            </span>
          </span>
          <span>
            <span style={{ fontStyle: "italic", fontWeight: 400 }}>Two</span>{" "}
            so far.
          </span>
        </div>

        <div
          style={{
            marginTop: 64,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            letterSpacing: "-0.01em",
            color: "#A8A39A",
            fontFamily: "monospace",
          }}
        >
          <span>CORSW · MAY 2026</span>
          <span style={{ paddingRight: 48 }}>HYDERABAD / PUNE / SOLAPUR</span>
        </div>
      </div>
    ),
    size,
  );
}
