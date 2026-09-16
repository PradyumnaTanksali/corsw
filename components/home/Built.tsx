import { Container } from "@/components/primitives/Container";
import { Ordinal } from "@/components/primitives/Ordinal";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Diagram } from "@/components/site/Diagram";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";

const principles = [
  "Start from how the business actually runs.",
  "Build for daily use, on the devices people already carry.",
  "Stay after launch: hosting, updates and support.",
  "Clear scope and plain communication throughout.",
];

/** Chapter C. The approach beside a system as it is actually deployed. */
export function Built() {
  return (
    <section data-tone="carbon" aria-labelledby="built-title" className="py-32 md:py-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={3} label="Approach" className="md:col-span-3" />
          <div className="md:col-span-9">
            <SplitReveal
              id="built-title"
              className="text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-balance"
            >
              How Corsw <span className="font-mono font-medium tracking-[-0.07em] text-accent">works.</span>
            </SplitReveal>
          </div>
        </div>

        <div className="mt-20 grid gap-12 md:mt-28 lg:grid-cols-12 lg:gap-10">
          <figure className="border border-ink-rule bg-bg-card p-5 md:p-7 lg:col-span-7 lg:self-start">
            <figcaption className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
              <span>System diagram</span>
              <span>Ordio</span>
            </figcaption>
            <div className="mt-4">
              <Diagram name="ordio" />
            </div>
          </figure>

          <Reveal className="lg:col-span-5">
            <ol>
              {principles.map((principle, i) => (
                <li
                  key={principle}
                  data-reveal
                  className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-b border-ink-rule py-6 first:pt-0 last:border-b-0"
                >
                  <Ordinal n={i + 1} dot className="text-2xl text-accent" />
                  <span className="text-[clamp(1.125rem,1.6vw,1.375rem)] font-medium leading-[1.35] tracking-[-0.01em] text-balance">
                    {principle}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
