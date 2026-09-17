import type { Metadata } from "next";
import { Architecture } from "@/components/work/Architecture";
import { Business } from "@/components/work/Business";
import { CaseHero } from "@/components/work/CaseHero";
import { NextProject } from "@/components/work/NextProject";
import { Walkthrough } from "@/components/work/Walkthrough";
import { Footer } from "@/components/site/Footer";
import { products, projectHref, type Project } from "@/lib/projects";

const ORG = {
  "@type": "Organization",
  "@id": "https://corsw.in/#organization",
  name: "Corner Software",
  url: "https://corsw.in",
};

export function projectMetadata(project: Project): Metadata {
  const title = `${project.name} · Corner Software`;
  const { tagline: description } = project;
  const url = projectHref(project);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    // Without these the page shares with the root layout's home title,
    // description and og:url, so every page's card collapses to one.
    openGraph: {
      title,
      description,
      url,
      siteName: "Corner Software",
      type: "website",
      images: "/opengraph-image",
    },
    twitter: { card: "summary_large_image", title, description, images: "/opengraph-image" },
  };
}

/** One detail page for products and engagements; labels differ by kind. */
export function ProjectPage({ project }: { project: Project }) {
  const next =
    project.kind === "product"
      ? products[(products.findIndex((p) => p.slug === project.slug) + 1) % products.length]
      : null;
  const url = `https://corsw.in${projectHref(project)}`;

  const jsonLd =
    project.kind === "product"
      ? {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: project.name,
          description: project.tagline,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url,
          publisher: ORG,
        }
      : {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.name,
          description: project.tagline,
          url,
          creator: ORG,
        };

  return (
    <main id="content" data-tone-start="ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <CaseHero project={project} />
      <Business project={project} />
      <Walkthrough project={project} />
      <Architecture project={project} />
      <NextProject next={next} />
      <Footer tone="ink" />
    </main>
  );
}
