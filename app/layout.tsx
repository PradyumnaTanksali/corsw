import type { Metadata } from "next";
import "./globals.css";
import { inter, ebGaramond, jetbrainsMono } from "./fonts";
import { ColumnGrid } from "@/components/primitives/ColumnGrid";
import { MotionProvider } from "@/components/primitives/MotionProvider";

export const metadata: Metadata = {
  title: "Corner Software · A holding company for software product divisions.",
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
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ebGaramond.variable} ${jetbrainsMono.variable}`}
    >
      <body className="relative min-h-screen bg-bg text-ink antialiased">
        <ColumnGrid />
        <div className="relative z-10">
          <MotionProvider>{children}</MotionProvider>
        </div>
      </body>
    </html>
  );
}
