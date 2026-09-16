import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

// ponytail: no lastModified (a build timestamp would be a lie).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://corsw.in" },
    ...projects.map((p) => ({ url: `https://corsw.in/work/${p.slug}` })),
  ];
}
