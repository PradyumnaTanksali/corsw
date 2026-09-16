import Link from "next/link";
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { DEMO_EMAIL, NEW_PROJECT_HREF } from "@/lib/projects";

const rows = [
  { label: "Company", value: "Corner Software (Corsw)" },
  { label: "Founded", value: "2024" },
  { label: "Based", value: "India" },
  { label: "Sectors", value: "Healthcare · Manufacturing · Food service · Distribution" },
  { label: "Services", value: "Product design · Engineering · Hosting and support" },
];

/** Chapter C, closing: the company at a glance, then the one way to start. */
export function Contact() {
  return (
    <section data-tone="carbon" id="contact" aria-labelledby="contact-title" className="pb-24 pt-8 md:pb-32">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={4} label="Company" className="md:col-span-3" />
          <Reveal className="md:col-span-9">
            <dl className="font-mono text-[13px] leading-[1.7] tabular-nums">
              {rows.map((row) => (
                <div
                  key={row.label}
                  data-reveal
                  className="grid grid-cols-12 gap-4 border-t border-ink-rule py-4 first:border-t-0 first:pt-0"
                >
                  <dt className="col-span-12 uppercase tracking-[0.18em] text-ink-faint md:col-span-3">{row.label}</dt>
                  <dd className="col-span-12 text-ink md:col-span-9">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="mt-32 grid gap-10 md:mt-44 md:grid-cols-12">
          <SectionRule n={5} label="Contact" className="md:col-span-3" />
          <div className="md:col-span-9">
            <SplitReveal
              id="contact-title"
              className="text-[clamp(3rem,10vw,9rem)] font-semibold leading-[0.86] tracking-[-0.045em] text-balance"
            >
              Start a <span className="font-mono font-medium tracking-[-0.08em] text-accent">project.</span>
            </SplitReveal>

            <Reveal>
              <p data-reveal className="mt-12 max-w-prose text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.4] text-ink text-balance">
                Corsw designs, builds and operates software for businesses that rely on it every day.
              </p>
              <p data-reveal className="mt-6 max-w-prose text-[17px] leading-[1.6] text-ink-muted">
                Share what you run today and where it slows you down. The reply sets out what can be
                built, the timeline and the cost.
              </p>
            </Reveal>

            <a
              href={NEW_PROJECT_HREF}
              className="group mt-16 flex items-center justify-between gap-6 border-y border-ink-rule py-6 text-[clamp(2rem,5vw,4.25rem)] font-normal leading-none tracking-[-0.035em] transition-[font-weight,color] duration-500 hover:font-extrabold hover:text-accent focus-visible:font-extrabold focus-visible:text-accent"
            >
              <span>Start a project</span>
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-3">→</span>
            </a>

            <div className="mt-8 flex flex-col gap-4 font-mono text-[13px] sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                <span className="link-draw">See a platform running</span>
                <span aria-hidden="true">→</span>
              </Link>
              <a
                href={`mailto:${DEMO_EMAIL}`}
                className="link-draw break-words tabular-nums text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                {DEMO_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
