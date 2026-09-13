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

const rows: Array<{
  label: string;
  value: string;
  sub: string;
  ref: string;
}> = [
  { label: "Entity", value: "Corner Software", sub: "Corsw", ref: "ent/01" },
  { label: "Founded", value: "2024", sub: "India", ref: "fnd/01" },
  { label: "People", value: "One.", sub: "Pradyumna Tanksali", ref: "peo/01" },
  {
    label: "Projects",
    value: "Four",
    sub: "Arogyam · StreamLine · Ordio · SSC",
    ref: "prj/04",
  },
  { label: "Operating", value: "Three", sub: "One in build", ref: "ops/03" },
  { label: "Archive", value: "Two sites", sub: "Modlio · Scene", ref: "arc/02" },
];

export function IndexSection() {
  const revealTransition = useRevealTransition();

  return (
    <section className="py-32 md:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
          <div className="md:col-span-4">
            <SectionRule n={3} label="Index" />
            <h2 className="mt-8 max-w-xs text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.015em] text-balance">
              The whole company in one{" "}
              <span className="font-accent font-normal text-accent">table</span>.
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
                <dd className="col-span-6 text-ink md:col-span-3">{row.value}</dd>
                <dd className="col-span-6 text-ink-muted md:col-span-4">
                  {row.sub}
                </dd>
                <dd className="col-span-12 text-accent md:col-span-2 md:text-right">
                  {row.ref}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </Container>
    </section>
  );
}
