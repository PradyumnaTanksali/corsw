import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ebGaramond, ebGaramondPrint, jetbrainsMono, schibsted } from "./fonts";
import { Bar } from "@/components/site/Bar";
import { Textures } from "@/components/site/Textures";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ToneScroller } from "@/components/motion/ToneScroller";
import { toneCss } from "@/lib/tones";

const shareDescription = "Software, built and run. Arogyam · StreamLine · Ordio · SSC.";

// Title, canonical and robots live in each page so the 404 page doesn't
// inherit a second <title> and an `index, follow` next to Next's `noindex`.
export const metadata: Metadata = {
  description:
    "Corner Software (Corsw) designs, builds and operates software for healthcare, manufacturing, food service and distribution businesses. Founded 2024, based in India.",
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

// Browser chrome follows the home page's opening chapter.
export const viewport: Viewport = {
  themeColor: "#ece6da",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${schibsted.variable} ${ebGaramond.variable} ${ebGaramondPrint.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: toneCss() }} />
      </head>
      <body className="relative min-h-screen bg-bg text-ink antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-16 focus:z-50 focus:bg-bg focus:px-3 focus:py-2 focus:font-mono focus:text-[13px]"
        >
          Skip to content
        </a>
        <Textures />
        <Bar />
        <div className="relative z-10">{children}</div>
        <SmoothScroll />
        <ToneScroller />
      </body>
    </html>
  );
}
