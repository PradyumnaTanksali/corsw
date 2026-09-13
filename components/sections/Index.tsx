"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import {
  reveal,
  stagger,
  staggerTransition,
  useRevealTransition,
  viewport,
} from "@/lib/motion";

const rows: Array<{ label: string; value: string }> = [
  { label: "Company", value: "Corner Software (Corsw)" },
  { label: "Founded", value: "2024" },
  { label: "Based", value: "India" },
  { label: "Sectors", value: "Healthcare · Manufacturing · Food service · Distribution" },
  { label: "Services", value: "Product design · Engineering · Hosting and support" },
];

export function IndexSection() {
  const revealTransition = useRevealTransition();

  return (
    <section className="py-32 md:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
          <div className="md:col-span-4">
            <SectionRule n={3} label="Company" />
            <h2 className="mt-8 max-w-xs text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.015em] text-balance">
              At a <span className="font-accent text-accent">glance</span>.
            </h2>
          </div>

          <motion.dl
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={viewport}
            transition={staggerTransition}
            className="md:col-span-8 md:col-start-5 font-mono text-[13px] leading-[1.7] tabular-nums"
          >
            {rows.map((row) => (
              <motion.div
                key={row.label}
                variants={reveal}
                transition={revealTransition}
                className="grid grid-cols-12 gap-4 border-t border-ink-rule py-3 first:border-t-0"
              >
                <dt className="col-span-12 uppercase tracking-[0.18em] text-ink-faint md:col-span-3">
                  {row.label}
                </dt>
                <dd className="col-span-12 text-ink md:col-span-9">{row.value}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </Container>
    </section>
  );
}
