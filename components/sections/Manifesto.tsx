"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/primitives/Container";
import { Ordinal } from "@/components/primitives/Ordinal";
import { SectionRule } from "@/components/primitives/SectionRule";
import {
  reveal,
  stagger,
  staggerTransition,
  useRevealTransition,
  viewport,
} from "@/lib/motion";

const principles = [
  "One company. One person accountable for every project.",
  "Build it, then run it. Nothing is handed off.",
  "Small scope. Real users. Long horizons.",
  "A number on this page is a number measured.",
  "Fewer projects, finished properly.",
  "No deck. No sales call. The demo is the product running.",
  "Corsw will be here in ten years.",
];

export function Manifesto() {
  const revealTransition = useRevealTransition();

  return (
    <section className="py-32 md:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
          <div className="md:col-span-4">
            <SectionRule n={4} label="Manifesto" />
            <h2 className="mt-8 max-w-xs text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.015em] text-balance">
              Seven{" "}
              <span className="font-accent font-normal text-accent">
                principles
              </span>
              .
            </h2>
          </div>

          <motion.ol
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={viewport}
            transition={staggerTransition}
            className="md:col-span-8 md:col-start-5 max-w-2xl"
          >
            {principles.map((principle, i) => (
              <motion.li
                key={principle}
                variants={reveal}
                transition={revealTransition}
                className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-b border-ink-rule py-6 last:border-b-0 md:grid-cols-[4rem_1fr] md:gap-6"
              >
                <Ordinal
                  n={i + 1}
                  dot
                  className="text-2xl tracking-[0.02em] text-accent md:text-3xl"
                />
                <span className="text-lg leading-[1.45] text-ink text-balance">
                  {principle}
                </span>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </Container>
    </section>
  );
}
