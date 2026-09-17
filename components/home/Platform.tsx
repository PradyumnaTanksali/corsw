import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Diagram } from "@/components/site/Diagram";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";

const pillars = [
  {
    label: "Isolation",
    copy: "Each customer's data is isolated in the database itself, with row-level security on every business table.",
  },
  {
    label: "History",
    copy: "Critical records are append-only: audit logs, casepaper versions, stock movements and invoice payments are added to, never overwritten.",
  },
  {
    label: "Money",
    copy: "Amounts are calculated in whole paise on the server, never trusted from the screen.",
  },
  {
    label: "Identity",
    copy: "Every customer runs under its own address, branding and settings, on a subdomain or its own domain.",
  },
  {
    label: "India-ready",
    copy: "GST invoices, PF and ESI, English and Marathi, built into the products that need them.",
  },
  {
    label: "Operated",
    copy: "Hosted and updated by Corsw. One release reaches every customer.",
  },
];

/** Chapter C. The standards every product shares, beside its diagram. */
export function Platform() {
  return (
    <section data-tone="carbon" id="platform" aria-labelledby="platform-title" className="py-32 md:py-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={3} label="Platform" className="md:col-span-3" />
          <div className="md:col-span-9">
            <SplitReveal
              id="platform-title"
              className="text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-balance"
            >
              Built to one <span className="font-mono font-medium tracking-[-0.07em] text-accent">standard.</span>
            </SplitReveal>
            <p className="mt-8 max-w-prose text-[17px] leading-[1.6] text-ink-muted">
              Every Corsw product is built to the same engineering standards and runs as one hosted
              platform. An improvement ships once and reaches every customer of that product.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-12 md:mt-28 lg:grid-cols-12 lg:gap-10">
          <figure className="border border-ink-rule bg-bg-card p-5 md:p-7 lg:col-span-7 lg:self-start">
            <figcaption className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
              <span>System diagram</span>
              <span>Platform</span>
            </figcaption>
            <div className="mt-4">
              <Diagram name="platform" />
            </div>
          </figure>

          <Reveal className="lg:col-span-5">
            <dl>
              {pillars.map((pillar) => (
                <div
                  key={pillar.label}
                  data-reveal
                  className="border-b border-ink-rule py-5 first:pt-0 last:border-b-0"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">{pillar.label}</dt>
                  <dd className="mt-2 text-[clamp(1.0625rem,1.4vw,1.25rem)] leading-[1.4] tracking-[-0.01em] text-ink text-balance">
                    {pillar.copy}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
