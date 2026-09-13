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
              Corner Software is one company with one{" "}
              <span className="font-accent font-normal text-accent">name</span>.
            </h2>

            <div className="mt-10 max-w-prose space-y-6 text-[15px] leading-[1.6] text-ink-muted md:text-base">
              <p>
                Every project here is built and run by Corsw. Clinics, factory
                floors, café counters, a wholesale catalogue. Nothing is handed
                over and left.
              </p>
              <p>
                Three of the four are multi-tenant platforms with real tenants.
                The numbers on this page are the ones in production.
              </p>
              <p>Software at every corner. The name is the plan.</p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
