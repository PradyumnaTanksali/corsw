import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { ProjectPage, projectMetadata } from "@/components/work/ProjectPage";
import { projects } from "@/lib/projects";
import { TONES } from "@/lib/tones";

type Props = { params: Promise<{ slug: string }> };

const products = projects.filter((p) => p.kind === "product");

export const dynamicParams = false;

// Opens in the ink chapter, not the root layout's bone default.
export const viewport: Viewport = { themeColor: TONES.ink["--bg"] };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  return product ? projectMetadata(product) : {};
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();
  return <ProjectPage project={product} />;
}
