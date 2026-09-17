import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { ScrubText } from "@/components/motion/ScrubText";

export function Statement() {
  return (
    <section data-tone="bone" aria-label="Overview" className="pb-24 pt-32 md:pb-32 md:pt-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={1} label="Overview" className="md:col-span-3" />
          <div className="md:col-span-9">
            <ScrubText className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
              Every business runs on a handful of systems it cannot afford to lose: the front desk, the
              order book, the kitchen ticket. Corner Software builds those systems as platforms,
              operates them, and improves them for every customer at once.
            </ScrubText>
            <Reveal>
              <p data-reveal className="mt-10 max-w-prose text-[17px] leading-[1.6] text-ink-muted">
                Arogyam, StreamLine and Ordio serve healthcare, manufacturing and food service. The same
                engineering practice builds custom platforms for businesses no product fits yet.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
      <Marquee
        items={["Healthcare practices", "Manufacturing", "Trading", "Restaurants and cafés", "Wholesale distribution"]}
        className="mt-24 md:mt-36"
      />
    </section>
  );
}
