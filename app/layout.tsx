import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inter, ebGaramond, ebGaramondPrint, jetbrainsMono } from "./fonts";
import { ColumnGrid } from "@/components/primitives/ColumnGrid";
import { MotionProvider } from "@/components/primitives/MotionProvider";

const shareDescription = "Software, built and run. Arogyam · StreamLine · Ordio · SSC.";

// Title, canonical and robots live in each page so the 404 page doesn't
// inherit a second <title> and an `index, follow` next to Next's `noindex`.
export const metadata: Metadata = {
  description:
    "Corner Software (Corsw) builds and runs software: Arogyam for clinics, StreamLine for manufacturers, Ordio for cafés, and a wholesale catalogue for SSC. Taking on new clients. Run by Pradyumna Tanksali. Founded 2024.",
  metadataBase: new URL("https://corsw.in"),
  openGraph: {
    title: "Corner Software",
    description: shareDescription,
    url: "https://corsw.in",
    siteName: "Corner Software",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corner Software",
    description: shareDescription,
  },
  // Icons come from the app/icon.png + app/icon.svg file conventions; a manual
  // `icons` entry here would suppress those generated <link> tags.
};

// Both themes are dark; browser chrome follows Paper.
export const viewport: Viewport = {
  themeColor: "#0e0e0e",
  colorScheme: "dark",
};

// Runs before first paint so a saved Schematic choice never flashes Paper.
const THEME_BOOT =
  'try{var t=localStorage.getItem("corsw-theme");if(t==="paper"||t==="schematic")document.documentElement.dataset.theme=t}catch(e){}';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="paper"
      suppressHydrationWarning
      className={`${inter.variable} ${ebGaramond.variable} ${ebGaramondPrint.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className="relative min-h-screen bg-bg text-ink antialiased">
        <ColumnGrid />
        <div className="relative z-10">
          <MotionProvider>{children}</MotionProvider>
        </div>
      </body>
    </html>
  );
}
