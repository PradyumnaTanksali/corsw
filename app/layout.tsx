import type { Metadata } from "next";
import "./globals.css";
import { inter, ebGaramond, ebGaramondPrint, jetbrainsMono } from "./fonts";
import { ColumnGrid } from "@/components/primitives/ColumnGrid";
import { MotionProvider } from "@/components/primitives/MotionProvider";

// Title, canonical and robots live in app/page.tsx so the 404 page doesn't
// inherit a second <title> and an `index, follow` next to Next's `noindex`.
export const metadata: Metadata = {
  description:
    "Corner Software is a holding company for software product divisions. Modlio (enterprise) and Scene Studio (indie). Hyderabad · Pune · Solapur. Founded 2024.",
  metadataBase: new URL("https://corsw.in"),
  openGraph: {
    title: "Corner Software",
    description:
      "A holding company for software product divisions. Modlio · Scene Studio.",
    url: "https://corsw.in",
    siteName: "Corner Software",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corner Software",
    description:
      "A holding company for software product divisions. Modlio · Scene Studio.",
  },
  // Icons come from the app/icon.png + app/icon.svg file conventions; a manual
  // `icons` entry here would suppress those generated <link> tags.
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ebGaramond.variable} ${ebGaramondPrint.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="relative min-h-screen bg-bg text-ink antialiased">
        {/* Holds the masthead fade (≤3s) until Inter and Garamond italic are
            in. They swap at different moments and the h1 re-wraps each time;
            that must happen while it is still transparent or it is CLS. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{const d=document.documentElement;d.classList.add("fonts-pending");Promise.race([Promise.all(["500 1em Inter","italic 1em 'EB Garamond'"].map((f)=>document.fonts.load(f))),new Promise((r)=>setTimeout(r,3000))]).finally(()=>d.classList.remove("fonts-pending"))})()`,
          }}
        />
        <ColumnGrid />
        <div className="relative z-10">
          <MotionProvider>{children}</MotionProvider>
        </div>
      </body>
    </html>
  );
}
