"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { reveal, useRevealTransition, viewport } from "@/lib/motion";

const facts = [
  { label: "People", value: "One" },
  { label: "Founded", value: "2024" },
  { label: "Based", value: "India" },
];

export function Provenance() {
  const revealTransition = useRevealTransition();

  return (
    <section className="py-32 md:py-40">
      <Container>
        <motion.div
          variants={reveal}
          initial="initial"
          whileInView="whileInView"
          viewport={viewport}
          transition={revealTransition}
          className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 lg:gap-16"
        >
          <div className="md:col-span-4">
            <SectionRule n={5} label="Provenance" />
            <dl className="mt-10 space-y-3 font-mono text-[13px] leading-[1.7] tabular-nums">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="uppercase tracking-[0.18em] text-ink">
                    {fact.label}
                  </dt>
                  <dd className="text-ink-muted">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="md:col-span-8 md:col-start-5">
            <div className="max-w-prose space-y-6 text-[15px] leading-[1.6] text-ink md:text-base">
              <p>
                Corner Software is one person: Pradyumna Tanksali. Design,
                engineering, deployment and support come from the same desk.
              </p>
              <p className="text-ink-muted">
                Earlier work shipped under two names, Modlio and Scene. Both
                sites stay up as an archive. Everything new ships as Corsw.
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
