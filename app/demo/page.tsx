import type { Metadata } from "next";
import { Container } from "@/components/primitives/Container";
import { ProjectCard } from "@/components/primitives/ProjectCard";
import { ThemeToggle } from "@/components/primitives/ThemeToggle";
import { DEMO_EMAIL, projects } from "@/lib/projects";

const title = "Corsw · Three platforms in service";
const description =
  "Arogyam for clinics, StreamLine for manufacturers, Ordio for café counters. Ask to see one running.";
const demoHref = `mailto:${DEMO_EMAIL}?subject=${encodeURIComponent("Demo request")}`;

// On a wildcard host "/" is rewritten back to this page, so links home are absolute.
const HOME = "https://corsw.in";

// Noindex: the homepage's project cards under a short header, also served at the
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

export default function DemoPage() {
  const operating = projects.filter((p) => p.status === "operating");

  return (
    <main>
      <header className="pt-12 md:pt-20">
        <Container>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            <a href={HOME} className="transition-colors duration-150 hover:text-ink">
              Corner Software
            </a>
            <span className="whitespace-nowrap">
              <span aria-hidden="true" className="mr-3 text-ink-faint">·</span>
              Demo
            </span>
            <ThemeToggle className="ml-auto" />
          </div>

          <h1 className="mt-16 sm:max-w-[18ch] text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.02em] text-balance motion-safe:animate-masthead-rise md:mt-24">
            {operating.length === 3 ? "Three" : operating.length} platforms.
            <br />
            <span className="text-ink-muted">
              All of them{" "}
              <br className="sm:hidden" />
              in <span className="font-accent text-accent">service</span>.
            </span>
          </h1>

          <div className="mt-12 flex flex-col gap-6 border-t border-ink-rule pt-8 sm:flex-row sm:items-center sm:gap-10 md:mt-16">
            <a
              href={demoHref}
              className="inline-flex items-center justify-between gap-3 border border-accent px-5 py-3 font-mono text-[13px] text-accent transition-colors duration-150 hover:bg-accent hover:text-bg focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent sm:justify-start"
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

      <section aria-label="Platforms in service" className="pb-20 pt-16 md:pb-28 md:pt-24">
        <Container>
          {operating.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </Container>
      </section>

      <section className="border-t border-ink-rule py-24 md:py-32">
        <Container className="text-center">
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.015em] text-balance">
            See one running.
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-[15px] leading-[1.6] text-ink-muted md:text-base">
            A walk through a live tenant: the operator&apos;s screens, not slides.
            Name the platform in the subject line.
          </p>
          <a
            href={demoHref}
            className="link-draw mt-10 inline-block break-words font-mono text-[14px] tabular-nums text-ink transition-colors duration-150 hover:text-accent md:text-[15px]"
          >
            {DEMO_EMAIL}
          </a>
        </Container>
      </section>

      <footer className="border-t border-ink-rule">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-8 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
          <a href={HOME} className="transition-colors duration-150 hover:text-ink-muted">
            Corner Software
          </a>
          <span>corsw.in/demo</span>
        </Container>
      </footer>
    </main>
  );
}
