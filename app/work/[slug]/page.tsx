import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Architecture } from "@/components/work/Architecture";
import { Business } from "@/components/work/Business";
import { CaseHero } from "@/components/work/CaseHero";
import { NextProject } from "@/components/work/NextProject";
import { Walkthrough } from "@/components/work/Walkthrough";
import { Footer } from "@/components/site/Footer";
import { projects } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} · Corner Software`,
    description: project.tagline,
    alternates: { canonical: `/work/${project.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.tagline,
    url: `https://corsw.in/work/${project.slug}`,
    creator: { "@type": "Organization", "@id": "https://corsw.in/#organization", name: "Corner Software" },
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
      <NextProject project={next} />
      <Footer tone="ink" />
    </main>
  );
}
