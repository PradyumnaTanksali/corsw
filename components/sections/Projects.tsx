import { Container } from "@/components/primitives/Container";
import { ProjectCard } from "@/components/primitives/ProjectCard";
import { SectionRule } from "@/components/primitives/SectionRule";
import { projects } from "@/lib/projects";

export function Projects() {
  return (
    <section id="projects" className="py-32 md:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
          <div className="md:col-span-4">
            <SectionRule n={2} label="Projects" />
            <h2 className="mt-8 max-w-xs text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.015em] text-balance">
              Four projects, one{" "}
              <span className="font-accent font-normal text-accent">
                workshop
              </span>
              .
            </h2>
          </div>

          <p className="max-w-prose text-[15px] leading-[1.6] text-ink-muted md:col-span-8 md:col-start-5 md:mt-14 md:text-base">
            Four projects, each with its own users: a clinic, a factory floor, a
            café counter, a wholesale buyer. The schematic on each card is the
            architecture as it actually runs.
          </p>
        </div>

        <div className="mt-16 md:mt-20">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
