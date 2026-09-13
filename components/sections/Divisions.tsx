"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { DivisionCard } from "@/components/primitives/DivisionCard";
import { cn } from "@/lib/utils";
import {
  reveal,
  stagger,
  staggerTransition,
  useRevealTransition,
  viewport,
} from "@/lib/motion";

const divisions = [
  {
    ordinal: "I.",
    wordmark: "MODLIO",
    role: "Enterprise software division.",
    description:
      "Modlio builds the long-running, high-stakes systems. Healthcare platforms, financial automation, IoT infrastructure. Things that need uptime, audits, and decade-scale thinking.",
    inventory: [
      { label: "Founded", value: "2025" },
      { label: "Focus", value: "Enterprise · Healthcare · Fintech" },
      { label: "Active", value: "1 platform · 2 in build" },
    ],
    href: "https://modlio.corsw.in",
    hrefLabel: "Visit modlio.corsw.in",
  },
  {
    ordinal: "II.",
    wordmark: "SCENE STUDIO",
    role: "Indie product studio.",
    description:
      "Scene Studio ships small, opinionated tools and personal-scale apps. Fast cycles, minimal scope, thoughtful taste. Where the experiments live.",
    inventory: [
      { label: "Founded", value: "2025" },
      { label: "Focus", value: "Tools · Apps · Open work" },
      { label: "Active", value: "2 shipped · 1 in research" },
    ],
    href: "https://scenestudio.corsw.in",
    hrefLabel: "Visit scenestudio.corsw.in",
  },
];

export function Divisions() {
  const revealTransition = useRevealTransition();

  return (
    <section className="py-32 md:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
          <div className="md:col-span-4">
            <SectionRule numeral="II" label="Divisions" />
            <h2 className="mt-8 max-w-xs text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.015em] text-balance">
              Two divisions, one{" "}
              <span className="font-serif italic font-normal text-accent">
                architecture
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
            className="md:col-span-8 md:col-start-5 grid grid-cols-1 md:grid-cols-2"
          >
            {divisions.map((division, i) => (
              <motion.div
                key={division.wordmark}
                variants={reveal}
                transition={revealTransition}
                className={cn(
                  // Overlap adjacent card borders into a single hairline;
                  // hover:z-10 lets the hovered card's vermillion border win.
                  "relative hover:z-10",
                  i > 0 && "-mt-px md:mt-0 md:-ml-px",
                )}
              >
                <DivisionCard {...division} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
