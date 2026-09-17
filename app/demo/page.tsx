import type { Metadata, Viewport } from "next";
import { Container } from "@/components/primitives/Container";
import { ProjectCard } from "@/components/primitives/ProjectCard";
import { Footer } from "@/components/site/Footer";
import { DEMO_EMAIL, projects } from "@/lib/projects";
import { TONES } from "@/lib/tones";

const title = "Corsw · Platforms in service";
const description =
  "Arogyam for clinics, StreamLine for manufacturers, Ordio for café counters. Ask to see one running.";
const demoHref = `mailto:${DEMO_EMAIL}?subject=${encodeURIComponent("Demo request")}`;

// On a wildcard host "/" is rewritten back to this page, so links home are absolute.
const HOME = "https://corsw.in";

// Noindex: the operating projects under a short header, also served at the
// root of every unassigned *.corsw.in subdomain. The homepage is the page that ranks.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/demo" },
  robots: { index: false, follow: true },
  // Setting openGraph/twitter here replaces the root's, so the image is named explicitly.
  openGraph: {
    title,
    description,
    url: "/demo",
    siteName: "Corner Software",
    type: "website",
    images: "/opengraph-image",
  },
  twitter: { card: "summary_large_image", title, description, images: "/opengraph-image" },
};

// This page opens in the ink chapter, not the root layout's bone default.
export const viewport: Viewport = {
  themeColor: TONES.ink["--bg"],
};

export default function DemoPage() {
  const operating = projects.filter((p) => p.status === "operating");

  return (
    <main id="content" data-tone-start="ink">
      <header data-tone="ink" className="pt-28 md:pt-36">
        <Container>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            <a href={HOME} className="transition-colors duration-150 hover:text-ink">
              Corner Software
            </a>
            <span aria-hidden="true" className="mx-3 text-ink-faint">·</span>
            Demo
          </p>

          <h1 className="mt-12 text-[clamp(3rem,9vw,8rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-balance md:mt-16">
            <span className="line-mask">
              <span className="line-rise">
                Platforms in <span className="font-accent font-normal text-accent">service.</span>
              </span>
            </span>
          </h1>

          <div className="mt-12 flex flex-col gap-6 border-t border-ink-rule pt-8 sm:flex-row sm:items-center sm:gap-10 md:mt-16">
            <a
              href={demoHref}
              className="inline-flex items-center justify-between gap-3 border border-accent px-5 py-3 font-mono text-[13px] text-accent transition-colors duration-150 hover:bg-accent hover:text-bg sm:justify-start"
            >
              Ask for a demo <span aria-hidden="true">→</span>
            </a>
            <a
              href={HOME}
              className="inline-flex items-center gap-2 font-mono text-[13px] text-ink-muted transition-colors duration-150 hover:text-ink"
            >
              <span className="link-draw">Everything Corsw builds</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </Container>
      </header>

      <section data-tone="ink" aria-labelledby="platforms" className="pb-20 pt-16 md:pb-28 md:pt-24">
        <Container>
          {/* Card taglines are h3; this keeps the outline h1 → h2 → h3. */}
          <h2 id="platforms" className="sr-only">Platforms in service</h2>
          {operating.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </Container>
      </section>

      <section data-tone="ink" className="border-t border-ink-rule py-24 md:py-32">
        <Container className="text-center">
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1] tracking-[-0.03em] text-balance">
            See one running.
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-ink-muted">
            A walk through a live tenant: the operator&apos;s screens, not slides. Name the platform
            in the subject line, or describe what you would like built.
          </p>
          <a
            href={demoHref}
            className="link-draw mt-10 inline-block break-words font-mono text-[15px] tabular-nums text-ink transition-colors duration-150 hover:text-accent"
          >
            {DEMO_EMAIL}
          </a>
        </Container>
      </section>

      <Footer tone="ink" />
    </main>
  );
}
