"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { NEW_PROJECT_HREF } from "@/lib/projects";
import { reveal, useRevealTransition, viewport } from "@/lib/motion";

export function Clients() {
  const revealTransition = useRevealTransition();

  return (
    <section id="clients" className="py-32 md:py-40">
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
            <SectionRule n={6} label="Next" />
            <h2 className="mt-8 max-w-xs text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.015em] text-balance">
              This is the{" "}
              <span className="font-accent text-accent">start</span>.
            </h2>
          </div>

          <div className="md:col-span-8 md:col-start-5">
            <p className="max-w-prose text-lg leading-[1.45] text-ink text-balance">
              Four projects are where Corsw begins, not where it stops. The plan
              is more clients and more platforms.
            </p>

            <div className="mt-8 max-w-prose space-y-6 text-[15px] leading-[1.6] text-ink-muted md:text-base">
              <p>
                Corsw is taking on new client work: software a business depends
                on every day, built to be run rather than handed over. A clinic,
                a factory floor, a café and a distributor so far.
              </p>
              <p>
                Write with what you run today and where it slows you down. The
                reply is a straight answer: whether Corsw can build it, and how.
              </p>
            </div>

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
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
