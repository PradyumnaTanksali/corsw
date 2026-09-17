import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Statement } from "@/components/home/Statement";
import { Products } from "@/components/home/Products";
import { Platform } from "@/components/home/Platform";
import { Engineering } from "@/components/home/Engineering";
import { Contact } from "@/components/home/Contact";
import { Footer } from "@/components/site/Footer";
import { DEMO_EMAIL, projectHref, projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Corner Software · Industry platforms, built and run.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

const ORG_ID = "https://corsw.in/#organization";

const products = projects.filter((p) => p.kind === "product");
const engagements = projects.filter((p) => p.kind === "engagement");

// Client components get only the fields they render.
const pick = ({ kind, slug, n, name, status, tagline, capture }: (typeof projects)[number]) => ({
  kind,
  slug,
  n,
  name,
  status,
  tagline,
  capture,
});

// Only facts stated on the page (Hero, Products, Company, Contact).
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
      description: "Industry platforms, built and run.",
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
      itemListElement: products.map((p) => ({
        "@type": "ListItem",
        position: p.n,
        item: {
          "@type": "SoftwareApplication",
          name: p.name,
          description: p.tagline,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `https://corsw.in${projectHref(p)}`,
          publisher: { "@id": ORG_ID },
        },
      })),
    },
  ],
};

export default function Home() {
  return (
    <main id="content" data-tone-start="bone">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <Statement />
      <Products products={products.map(pick)} />
      <Platform />
      <Engineering engagements={engagements.map(pick)} />
      <Contact />
      <Footer tone="carbon" />
    </main>
  );
}
