import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // React's <ViewTransition> carries a project's capture from the home page
  // into its case study. Browsers without the API navigate instantly.
  experimental: { viewTransition: true },
};

export default nextConfig;
