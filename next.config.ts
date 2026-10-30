import type { NextConfig } from "next";

const CANONICAL = "corsw.in";
const escaped = CANONICAL.replace(/\./g, "\\.");
const host = (value: string) => [{ type: "host" as const, value }];

const nextConfig: NextConfig = {
  reactCompiler: true,
  // React's <ViewTransition> carries a project's capture from the home page
  // into its case study. Browsers without the API navigate instantly.
  experimental: { viewTransition: true },

  // Host routing lives here, not in proxy.ts: a Next 16 proxy is a Node
  // function that runs on every request (bots, prefetches, junk paths), and
  // Hobby meters that as Fluid Active CPU. Config rules are resolved by the
  // platform router with no function call. Redirects run before rewrites, so
  // www never reaches the wildcard rewrite below.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: host(`www\\.${escaped}`),
        destination: `https://${CANONICAL}/:path*`,
        permanent: true,
      },
    ];
  },

  // corsw.in owns the *.corsw.in wildcard. Project subdomains (stream., ordio.,
  // arogyam., ssc., …) are assigned to their own Vercel projects and never reach
  // this project; any other subdomain does, and its root shows the demo page.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: host(`(?<sub>.+)\\.${escaped}`),
          destination: "/demo",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  // Every host except the apex (wildcard subdomains, previews, localhost) is a
  // duplicate of it and stays out of search.
  async headers() {
    return [
      {
        source: "/:path*",
        has: host(`(?!${escaped}$).*`),
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;
