import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { IsoFigure } from "@/components/site/IsoFigure";
import { SplitReveal } from "@/components/motion/SplitReveal";

// Platform first, then the products in their site order. Each drawing's caption carries its facts.
const DRAWINGS = [
  { name: "vault", title: "Platform · Isolation" },
  { name: "dial", title: "Arogyam · Slots" },
  { name: "ledger", title: "StreamLine · Stock" },
  { name: "rail", title: "Ordio · Kitchen" },
] as const;

/** Chapter C. Working drawings: each mechanism as a small machine that moves by the product's rules. */
export function Drawings() {
  return (
    <section data-tone="carbon" id="drawings" aria-labelledby="drawings-title" className="py-32 md:py-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={4} label="Drawings" className="md:col-span-3" />
          <div className="md:col-span-9">
            <SplitReveal
              id="drawings-title"
              className="text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-balance"
            >
              Drawn from the <span className="font-mono font-medium tracking-[-0.07em] text-accent">code.</span>
            </SplitReveal>
            <p className="mt-8 max-w-prose text-[17px] leading-[1.6] text-ink-muted">
              Working drawings of how the software behaves. Each is a small machine that moves by the same rules as
              the product: how one customer&apos;s data stays apart, how open slots are found, how stock adds up and
              how an order reaches the table. Hover, click or use the arrow keys.
            </p>

            <div className="mt-20 grid gap-20 md:mt-28">
              {DRAWINGS.map((d, i) => (
                <IsoFigure key={d.name} name={d.name} fig={`Fig ${i + 1}`} title={d.title} theme="dark" />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
