import { ImageResponse } from "next/og";

export const alt = "Corner Software · Software, built and run.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SANS_TEXT =
  "Corner Software builds software, and it. so far. · Est. 2024";
const SERIF_TEXT = "runs Four ";
const MONO_TEXT = "CORSW · SEPTEMBER 2026 ONE PERSON · INDIA";

async function loadGoogleFont(
  family: string,
  axes: string,
  text: string,
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:${axes}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url, { cache: "force-cache" })).text();
  const resource = css.match(
    /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
  );
  if (!resource) {
    throw new Error(`Could not resolve font face for ${family}`);
  }
  const response = await fetch(resource[1], { cache: "force-cache" });
  if (!response.ok) {
    throw new Error(`Could not load font data for ${family}`);
  }
  return response.arrayBuffer();
}

export default async function OpengraphImage() {
  const [inter, ebGaramondItalic, jetBrainsMono] = await Promise.all([
    loadGoogleFont("Inter", "wght@500", SANS_TEXT + SANS_TEXT.toUpperCase()),
    loadGoogleFont("EB Garamond", "ital,wght@1,400", SERIF_TEXT),
    loadGoogleFont("JetBrains Mono", "wght@400", MONO_TEXT),
  ]);

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
          fontFamily: "Inter",
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
            maxWidth: 1000,
          }}
        >
          <span>Corner Software builds</span>
          <span>
            {"software, and "}
            <span
              style={{
                fontFamily: "EB Garamond",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              {"runs "}
            </span>
              it.
          </span>
          <span>
            <span
              style={{
                fontFamily: "EB Garamond",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              {"Four "}
            </span>
            so far.
          </span>
        </div>

        <div
          style={{
            marginTop: 64,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "JetBrains Mono",
            fontSize: 16,
            letterSpacing: "-0.01em",
            color: "#A8A39A",
          }}
        >
          <span>CORSW · SEPTEMBER 2026</span>
          <span style={{ paddingRight: 48 }}>ONE PERSON · INDIA</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: inter, weight: 500, style: "normal" },
        {
          name: "EB Garamond",
          data: ebGaramondItalic,
          weight: 400,
          style: "italic",
        },
        {
          name: "JetBrains Mono",
          data: jetBrainsMono,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
