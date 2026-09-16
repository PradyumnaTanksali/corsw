import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { ScrubText } from "@/components/motion/ScrubText";

export function Foundation() {
  return (
    <section data-tone="bone" aria-label="Foundation" className="pb-24 pt-32 md:pb-32 md:pt-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={1} label="Foundation" className="md:col-span-3" />
          <div className="md:col-span-9">
            <ScrubText className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
              Corner Software builds the systems small businesses run on every day. A clinic&apos;s
              front desk. A factory&apos;s order book. A café&apos;s counter. A distributor&apos;s
              catalogue.
            </ScrubText>
            <Reveal>
              <p data-reveal className="mt-10 max-w-prose text-[17px] leading-[1.6] text-ink-muted">
                Every project is designed, built and kept running by Corsw. Launch is where the work
                starts, not where it ends.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
      <Marquee
        items={["Healthcare", "Manufacturing", "Food service", "Distribution"]}
        className="mt-24 md:mt-36"
      />
    </section>
  );
}
