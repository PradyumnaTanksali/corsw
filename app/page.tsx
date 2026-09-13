import type { Metadata } from "next";
import { Masthead } from "@/components/sections/Masthead";
import { Foundation } from "@/components/sections/Foundation";
import { Divisions } from "@/components/sections/Divisions";
import { IndexSection } from "@/components/sections/Index";
import { Coordinates } from "@/components/sections/Coordinates";
import { Manifesto } from "@/components/sections/Manifesto";
import { Provenance } from "@/components/sections/Provenance";
import { Ledger } from "@/components/sections/Ledger";
import { Colophon } from "@/components/sections/Colophon";

export const metadata: Metadata = {
  title: "Corner Software · A holding company for software product divisions.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

// Only facts stated on the page (Index, Coordinates, Divisions, Ledger).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://corsw.in/#organization",
      name: "Corner Software",
      alternateName: "Corsw",
      legalName: "Corner Software Pvt. Ltd.",
      url: "https://corsw.in",
      logo: "https://corsw.in/brand/monogram-dark.svg",
      description: "A holding company for software product divisions.",
      foundingDate: "2024",
      email: "hello@corsw.in",
      location: ["Hyderabad", "Pune", "Solapur"].map((city) => ({
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: city,
          addressCountry: "IN",
        },
      })),
      subOrganization: [
        {
          "@type": "Organization",
          name: "Modlio",
          url: "https://modlio.corsw.in",
          description: "Enterprise software division.",
        },
        {
          "@type": "Organization",
          name: "Scene Studio",
          url: "https://scenestudio.corsw.in",
          description: "Indie product studio.",
        },
      ],
      sameAs: ["https://github.com/corsw"],
    },
    {
      "@type": "WebSite",
      "@id": "https://corsw.in/#website",
      name: "Corner Software",
      url: "https://corsw.in",
      inLanguage: "en",
      publisher: { "@id": "https://corsw.in/#organization" },
    },
  ],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Masthead />
      <Foundation />
      <Divisions />
      <IndexSection />
      <Coordinates />
      <Manifesto />
      <Provenance />
      <Ledger />
      <Colophon />
    </main>
  );
}
