import type { Metadata } from "next";
import { Masthead } from "@/components/sections/Masthead";
import { Foundation } from "@/components/sections/Foundation";
import { Projects } from "@/components/sections/Projects";
import { IndexSection } from "@/components/sections/Index";
import { Manifesto } from "@/components/sections/Manifesto";
import { Contact } from "@/components/sections/Contact";
import { Colophon } from "@/components/sections/Colophon";
import { DEMO_EMAIL, projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Corner Software · Software, built and run.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

const ORG_ID = "https://corsw.in/#organization";

// Only facts stated on the page (Masthead, Work, Company, Contact).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Corner Software",
      alternateName: "Corsw",
      url: "https://corsw.in",
      logo: "https://corsw.in/brand/monogram-dark.svg",
      description: "Software, built and run.",
      foundingDate: "2024",
      email: DEMO_EMAIL,
      founder: {
        "@type": "Person",
        name: "Pradyumna Tanksali",
        // A personal profile: it identifies the founder, not the company.
        sameAs: ["https://github.com/PradyumnaTanksali"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://corsw.in/#website",
      name: "Corner Software",
      url: "https://corsw.in",
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "ItemList",
      itemListElement: projects.map((p) => ({
        "@type": "ListItem",
        position: p.n,
        item: {
          "@type": "CreativeWork",
          name: p.name,
          description: p.tagline,
          creator: { "@id": ORG_ID },
        },
      })),
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
      <Projects />
      <IndexSection />
      <Manifesto />
      <Contact />
      <Colophon />
    </main>
  );
}
