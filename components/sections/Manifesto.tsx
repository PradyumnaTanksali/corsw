"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import {
  reveal,
  revealTransition,
  stagger,
  staggerTransition,
  viewport,
} from "@/lib/motion";

const principles = [
  "We build companies, not features.",
  "The division is the product. The product belongs to the division.",
  "Outside work is a distraction. We refuse it.",
  "Small teams. Short meetings. Long horizons.",
  "We will be here in ten years.",
  "The two divisions do not compete. They do different work.",
  "The parent does not interfere. It only protects.",
];

const numerals = ["I.", "II.", "III.", "IV.", "V.", "VI.", "VII."];

export function Manifesto() {
  return (
    <section className="py-32 md:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <SectionRule numeral="V" label="Manifesto" />
            <p className="mt-8 max-w-xs text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.015em] text-balance">
              Seven{" "}
              <span className="font-serif italic font-normal text-accent">
                principles
              </span>
              .
            </p>
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
                key={i}
                variants={reveal}
                transition={revealTransition}
                className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-b border-ink-rule py-6 last:border-b-0 md:grid-cols-[4rem_1fr] md:gap-6"
              >
                <span
                  aria-hidden="true"
                  className="font-serif italic text-2xl text-accent tracking-[0.02em] tabular-nums md:text-3xl"
                >
                  {numerals[i]}
                </span>
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
