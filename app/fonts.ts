import { EB_Garamond, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";

// Variable weight axis (400–900): headlines change weight on scroll and hover.
export const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  display: "swap",
});

// On screen, Garamond is only ever set italic (accent words, ordinals, hero).
export const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
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
