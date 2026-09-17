import { ViewTransition } from "react";
import { Container } from "@/components/primitives/Container";
import { Ordinal } from "@/components/primitives/Ordinal";
import { StatusBadge } from "@/components/primitives/StatusBadge";
import { Capture } from "@/components/site/Capture";
import type { Project } from "@/lib/projects";

export function CaseHero({ project }: { project: Project }) {
  // Products lead with who they are built for; engagements with their sector.
  const sector = project.table.find((row) => row.label === "BUILT FOR" || row.label === "SECTOR")?.value;

  return (
    <section data-tone="ink" className="pt-28 md:pt-36">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <p className="flex items-baseline gap-3">
            <Ordinal n={project.n} dot className="text-[15px] normal-case tracking-normal text-accent" />
            <span>{sector}</span>
          </p>
          <StatusBadge status={project.status} />
        </div>
        <h1 className="mt-8 text-[clamp(3.5rem,13vw,12rem)] font-extrabold leading-[0.85] tracking-[-0.05em] text-balance">
          <span className="line-mask">
            <span className="line-rise">{project.name}</span>
          </span>
        </h1>
        <p className="mt-8 max-w-[28ch] text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.025em] text-balance">
          {project.tagline}
        </p>
      </Container>

      <div className="mt-16 px-5 md:mt-24 md:px-10">
        <div className="relative mx-auto aspect-[16/10] max-w-[1440px] overflow-hidden border border-ink-rule bg-bg-card">
          <ViewTransition name={`capture-${project.slug}`}>
            <div className="absolute inset-0">
              <Capture shot={project.capture} sizes="100vw" priority />
            </div>
          </ViewTransition>
        </div>
      </div>
    </section>
  );
}
