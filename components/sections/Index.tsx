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
  {
    label: "Entity",
    value: "Corner Software Pvt. Ltd.",
    sub: "Holding company",
    ref: "ent/01",
  },
  { label: "Founded", value: "2024", sub: "Hyderabad", ref: "fnd/01" },
  {
    label: "Divisions",
    value: "Two",
    sub: "Modlio · Scene Studio",
    ref: "dv/01,02",
  },
  {
    label: "Locations",
    value: "Three",
    sub: "Hyderabad · Pune · Solapur",
    ref: "loc/03",
  },
  { label: "People", value: "Small.", sub: "Intentionally.", ref: "peo/01" },
  {
    label: "External work",
    value: "None.",
    sub: "Not accepting.",
    ref: "ext/00",
  },
  {
    label: "Project count",
    value: "Six",
    sub: "Across both divisions",
    ref: "prj/06",
  },
  {
    label: "Public artifacts",
    value: "Two",
    sub: "Modlio · Scene Studio",
    ref: "art/02",
  },
];

export function IndexSection() {
  const revealTransition = useRevealTransition();

  return (
    <section className="py-32 md:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <SectionRule numeral="III" label="Index" />
            <p className="mt-8 max-w-xs text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.015em] text-balance">
              The whole company in one{" "}
              <span className="font-serif italic font-normal text-accent">
                table
              </span>
              .
            </p>
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
                <dd className="col-span-6 text-ink md:col-span-4">
                  {row.value}
                </dd>
                <dd className="col-span-6 text-ink-muted md:col-span-3">
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
