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

const cities = [
  {
    name: "Hyderabad",
    coord: "17.385° N · 78.486° E",
    role: "Primary node.",
    detail: "Operations and direction.",
  },
  {
    name: "Pune",
    coord: "18.520° N · 73.856° E",
    role: "Engineering node.",
    detail: "Build and ship.",
  },
  {
    name: "Solapur",
    coord: "17.660° N · 75.906° E",
    role: "Field node.",
    detail: "Healthcare ops, Arogyam.",
  },
];

export function Coordinates() {
  const revealTransition = useRevealTransition();

  return (
    <section className="py-32 md:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
          <div className="md:col-span-4">
            <SectionRule numeral="IV" label="Coordinates" />
            <h2 className="mt-8 max-w-xs text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.015em] text-balance">
              Three cities, one{" "}
              <span className="font-serif italic font-normal text-accent">
                operation
              </span>
              .
            </h2>
          </div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={viewport}
            transition={staggerTransition}
            className="md:col-span-8 md:col-start-5 grid grid-cols-1 gap-px bg-ink-rule lg:grid-cols-3"
          >
            {cities.map((city) => (
              <motion.div
                key={city.name}
                variants={reveal}
                transition={revealTransition}
                className="bg-bg p-8 md:p-10"
              >
                <div className="text-2xl font-medium tracking-[-0.01em] md:text-3xl">
                  {city.name}
                </div>
                <div className="mt-3 font-mono text-[13px] tabular-nums text-ink-muted">
                  {city.coord}
                </div>
                <div className="mt-8 font-mono text-[13px] leading-[1.7] text-ink">
                  {city.role}
                </div>
                <div className="font-mono text-[13px] leading-[1.7] text-ink-muted">
                  {city.detail}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
