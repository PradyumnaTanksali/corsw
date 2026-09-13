"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { reveal, useRevealTransition, viewport } from "@/lib/motion";


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
