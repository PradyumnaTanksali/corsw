import { ImageResponse } from "next/og";

export const alt = "Corner Software · Industry platforms, built and run.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SERIF_TEXT = "Software at every corner.";
const SANS_TEXT = "Industry platforms, built and run by Corner Software.";
const MONO_TEXT = "CORNER SOFTWARE · EST. 2024 · INDIA";

async function loadGoogleFont(family: string, axes: string, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:${axes}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url, { cache: "force-cache" })).text();
  const resource = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
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
  const [garamond, schibsted, mono] = await Promise.all([
    loadGoogleFont("EB Garamond", "ital,wght@1,400", SERIF_TEXT),
    loadGoogleFont("Schibsted Grotesk", "wght@600", SANS_TEXT),
    loadGoogleFont("JetBrains Mono", "wght@400", MONO_TEXT),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ECE6DA",
          color: "#141310",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          fontFamily: "Schibsted Grotesk",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, background: "#141310", position: "relative", display: "flex" }}>
            <div style={{ width: 20, height: 20, background: "#ECE6DA", position: "absolute", top: 5, left: 5 }} />
            <div style={{ width: 10, height: 10, background: "#A8341E", position: "absolute", top: 10, left: 10 }} />
          </div>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 16, letterSpacing: "0.22em", color: "#45423C" }}>
            CORNER SOFTWARE · EST. 2024 · INDIA
          </span>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            fontFamily: "EB Garamond",
            fontStyle: "italic",
            fontSize: 132,
            lineHeight: 0.86,
            letterSpacing: "-0.03em",
          }}
        >
          <span>Software</span>
          <span style={{ display: "flex", gap: 28 }}>
            <span>at every</span>
            <span style={{ color: "#A8341E" }}>corner.</span>
          </span>
        </div>

        <div
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: "1px solid #D3CBBD",
            display: "flex",
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          Industry platforms, built and run by Corner Software.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "EB Garamond", data: garamond, weight: 400, style: "italic" },
        { name: "Schibsted Grotesk", data: schibsted, weight: 600, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
