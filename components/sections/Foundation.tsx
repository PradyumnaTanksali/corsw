"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { reveal, useRevealTransition, viewport } from "@/lib/motion";

export function Foundation() {
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
            <SectionRule n={1} label="Foundation" />
          </div>

          <div className="md:col-span-8 md:col-start-5">
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.015em] text-balance">
              Software at every{" "}
              <span className="font-accent text-accent">corner</span>.
            </h2>

            <p className="mt-10 max-w-prose text-lg leading-[1.5] text-ink text-balance">
              Corner Software builds the systems small businesses run on every
              day. A clinic&apos;s front desk. A factory&apos;s order book. A
              café&apos;s counter. A distributor&apos;s catalogue.
            </p>

            <p className="mt-6 max-w-prose text-[15px] leading-[1.6] text-ink-muted md:text-base">
              Every project is designed, built and kept running by Corsw. Launch
              is where the work starts, not where it ends.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
