import type { MetadataRoute } from "next";

// ponytail: single page; no lastModified (a build timestamp would be a lie).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://corsw.in" }];
}
