import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { ProjectPage, projectMetadata } from "@/components/work/ProjectPage";
import { projects } from "@/lib/projects";
import { TONES } from "@/lib/tones";

type Props = { params: Promise<{ slug: string }> };

const engagements = projects.filter((p) => p.kind === "engagement");

export const dynamicParams = false;

// Opens in the ink chapter, not the root layout's bone default.
export const viewport: Viewport = { themeColor: TONES.ink["--bg"] };

export function generateStaticParams() {
  return engagements.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const engagement = engagements.find((p) => p.slug === slug);
  return engagement ? projectMetadata(engagement) : {};
}

export default async function EngagementPage({ params }: Props) {
  const { slug } = await params;
  const engagement = engagements.find((p) => p.slug === slug);
  if (!engagement) notFound();
  return <ProjectPage project={engagement} />;
}
