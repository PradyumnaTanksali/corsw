import { Container } from "@/components/primitives/Container";
import { DataTable } from "@/components/primitives/DataTable";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Diagram } from "@/components/site/Diagram";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { DEMO_EMAIL, type Project } from "@/lib/projects";

export function Architecture({ project }: { project: Project }) {
  return (
    <section data-tone="carbon" aria-labelledby="arch-title" className="py-32 md:py-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={3} label="Architecture" className="md:col-span-3" />
          <SplitReveal
            id="arch-title"
            className="text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-balance md:col-span-9"
          >
            How it is <span className="font-mono font-medium tracking-[-0.07em] text-accent">built.</span>
          </SplitReveal>
        </div>

        <div className="mt-20 grid gap-12 md:mt-28 lg:grid-cols-12 lg:gap-10">
          <figure className="border border-ink-rule bg-bg-card p-5 md:p-7 lg:col-span-7 lg:self-start">
            <figcaption className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
              <span>System diagram</span>
              <span className="tabular-nums">{project.diagramLabel}</span>
            </figcaption>
            <div className="mt-4">
              <Diagram name={project.diagram} />
            </div>
          </figure>

          <div className="lg:col-span-5">
            <Reveal>
              {project.description.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} data-reveal className="mb-5 text-[17px] leading-[1.65] text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </Reveal>
            <div className="mt-8">
              <DataTable caption={`${project.name} at a glance`} rows={project.table} />
            </div>
            {project.status === "operating" && (
              <a
                href={`mailto:${DEMO_EMAIL}?subject=${encodeURIComponent(`Demo request — ${project.name}`)}`}
                className="mt-10 inline-flex items-center justify-between gap-3 border border-accent px-5 py-3 font-mono text-[13px] text-accent transition-colors duration-150 hover:bg-accent hover:text-bg"
              >
                Ask for a demo <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
