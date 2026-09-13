"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { DEMO_EMAIL, NEW_PROJECT_HREF } from "@/lib/projects";
import { reveal, useRevealTransition, viewport } from "@/lib/motion";

export function Contact() {
  const revealTransition = useRevealTransition();

  return (
    <section id="contact" className="py-32 md:py-40">
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
            <SectionRule n={5} label="Contact" />
            <h2 className="mt-8 max-w-xs text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.015em] text-balance">
              Start a <span className="font-accent text-accent">project</span>.
            </h2>
          </div>

          <div className="md:col-span-8 md:col-start-5">
            <p className="max-w-prose text-lg leading-[1.5] text-ink text-balance">
              Corsw designs, builds and operates software for businesses that
              rely on it every day.
            </p>
            <p className="mt-6 max-w-prose text-[15px] leading-[1.6] text-ink-muted md:text-base">
              Share what you run today and where it slows you down. The reply
              sets out what can be built, the timeline and the cost.
            </p>

            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
              <a
                href={NEW_PROJECT_HREF}
                className="inline-flex items-center justify-between gap-3 border border-accent px-5 py-3 font-mono text-[13px] text-accent transition-colors duration-150 hover:bg-accent hover:text-bg sm:justify-start"
              >
                Start a project <span aria-hidden="true">→</span>
              </a>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 font-mono text-[13px] text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                <span className="link-draw">See a platform running</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <a
              href={`mailto:${DEMO_EMAIL}`}
              className="link-draw mt-10 inline-block break-words font-mono text-[13px] tabular-nums text-ink-muted transition-colors duration-150 hover:text-ink"
            >
              {DEMO_EMAIL}
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
