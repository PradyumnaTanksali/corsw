import { Inter, EB_Garamond, JetBrains_Mono } from "next/font/google";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

// On screen, Garamond is only ever set italic (numerals, emphasis words).
export const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  style: ["italic"],
});

// Upright Garamond is the print body (globals.css @media print). Separate
// loader with preload off so screens don't download it on every visit.
export const ebGaramondPrint = EB_Garamond({
  variable: "--font-eb-garamond-print",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  style: ["normal"],
  preload: false,
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});
