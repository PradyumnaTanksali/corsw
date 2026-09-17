import Link from "next/link";
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { StatusBadge } from "@/components/primitives/StatusBadge";
import { Capture } from "@/components/site/Capture";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { projectHref, type Project } from "@/lib/projects";

const services = ["Product design", "Engineering", "Hosting and operations", "Ongoing support"];

type Engagement = Pick<Project, "kind" | "slug" | "name" | "status" | "tagline" | "capture">;

/** Chapter C. Custom platforms, and the engagements that show them. */
export function Engineering({ engagements }: { engagements: Engagement[] }) {
  return (
    <section
      data-tone="carbon"
      id="engineering"
      aria-labelledby="engineering-title"
      className="pb-32 pt-8 md:pb-44"
    >
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={4} label="Engineering" className="md:col-span-3" />
          <div className="md:col-span-9">
            <SplitReveal
              id="engineering-title"
              className="text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-balance"
            >
              Custom platforms. Same{" "}
              <span className="font-mono font-medium tracking-[-0.07em] text-accent">standards.</span>
            </SplitReveal>

            <Reveal>
              <p data-reveal className="mt-12 max-w-prose text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.4] text-ink text-balance">
                When no product fits, Corsw designs and builds the platform, then hosts and runs it the way
                it runs its own products.
              </p>
              <p data-reveal className="mt-6 max-w-prose text-[17px] leading-[1.6] text-ink-muted">
                From the first workshop to production support, one team owns the outcome.
              </p>
              <ul
                data-reveal
                aria-label="Services"
                className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-ink-rule pt-5 font-mono text-[13px] text-ink"
              >
                {services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </Reveal>

            <div className="mt-20">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">Selected engagement</p>
              {engagements.map((e) => (
                <article
                  key={e.slug}
                  aria-labelledby={`engagement-${e.slug}`}
                  className="mt-6 grid gap-6 border-t border-ink-rule pt-6 md:grid-cols-12"
                >
                  <div className="relative aspect-[16/10] overflow-hidden border border-ink-rule bg-bg-card md:col-span-5">
                    <Capture shot={e.capture} sizes="(min-width: 768px) 30vw, 100vw" />
                  </div>
                  <div className="flex flex-col md:col-span-7">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h3
                        id={`engagement-${e.slug}`}
                        className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-none tracking-[-0.03em] text-balance"
                      >
                        {e.name}
                      </h3>
                      <StatusBadge status={e.status} />
                    </div>
                    <p className="mt-4 max-w-[46ch] text-[17px] leading-[1.5] text-ink-muted">{e.tagline}</p>
                    <Link
                      href={projectHref(e)}
                      className="mt-6 inline-flex items-center gap-2 font-mono text-[13px] text-accent"
                    >
                      <span className="link-draw">Read the engagement</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
