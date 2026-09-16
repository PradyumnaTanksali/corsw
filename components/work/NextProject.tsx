import Link from "next/link";
import { Container } from "@/components/primitives/Container";
import type { Project } from "@/lib/projects";

export function NextProject({ project }: { project: Project }) {
  return (
    <section data-tone="ink" aria-label="Next project" className="border-t border-ink-rule">
      <Link href={`/work/${project.slug}`} className="group block">
        <Container className="py-24 md:py-40">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted">
            Next project <span aria-hidden="true">→</span>
          </p>
          <p className="mt-6 text-[clamp(3.5rem,12vw,11rem)] font-normal leading-[0.85] tracking-[-0.05em] transition-[font-weight,color] duration-700 group-hover:font-extrabold group-hover:text-accent group-focus-visible:font-extrabold group-focus-visible:text-accent">
            {project.name}
          </p>
          <p className="mt-6 max-w-[40ch] text-lg leading-[1.5] text-ink-muted">{project.tagline}</p>
        </Container>
      </Link>
    </section>
  );
}
