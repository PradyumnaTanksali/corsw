import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Reveal } from "@/components/motion/Reveal";
import { ScrubText } from "@/components/motion/ScrubText";
import type { Project } from "@/lib/projects";

export function Business({ project }: { project: Project }) {
  const [problem, answer] = project.business;

  return (
    <section data-tone="bone" aria-label="The business" className="py-32 md:py-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={1} label="The business" className="md:col-span-3" />
          <div className="md:col-span-9">
            <ScrubText className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
              {problem}
            </ScrubText>
            <Reveal>
              <p data-reveal className="mt-10 max-w-prose text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.4] text-ink-muted text-balance">
                {answer}
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
