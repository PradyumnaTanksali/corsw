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
            <SectionRule numeral="I" label="Foundation" />
          </div>

          <div className="md:col-span-8 md:col-start-5">
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.015em] text-balance">
              Corner Software is a holding company for software product{" "}
              <span className="font-serif italic font-normal text-accent">
                divisions
              </span>
              .
            </h2>

            <div className="mt-10 max-w-prose space-y-6 text-[15px] leading-[1.6] text-ink-muted md:text-base">
              <p>
                We do not take external work. We do not bid. We do not pitch.
                Each division operates under its own name, ships under its own
                brand, and is responsible for its own product.
              </p>
              <p>
                Corsw is what they share — the architecture, the operating
                standards, the long horizon.
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
