"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/primitives/Container";
import { VermillionLine } from "@/components/primitives/VermillionLine";
import { ease } from "@/lib/motion";

export function Masthead() {
  const reduce = useReducedMotion();

  return (
    <header className="relative pt-12 md:pt-20">
      <div className="pointer-events-none absolute right-8 top-0 md:right-16 print:hidden">
        <VermillionLine height="60vh" />
      </div>

      <Container>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          <span>Corner Software</span>
          <span aria-hidden="true" className="text-ink-faint">·</span>
          <span>Est. 2024</span>
          <span aria-hidden="true" className="text-ink-faint">·</span>
          <span>Hyderabad / Pune / Solapur</span>
        </div>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: reduce ? 0 : 0.2 }}
          className="mt-16 max-w-[16ch] text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.02em] text-balance md:mt-24"
        >
          Corner Software builds
          <br />
          software{" "}
          <span className="font-serif italic font-normal">companies</span>.
          <br />
          <span className="font-serif italic font-normal">Two</span> so far.
        </motion.h1>

        <div className="mt-16 border-t border-ink-rule pt-4 md:mt-24">
          <span className="font-mono text-[13px] tracking-[-0.01em] text-ink-muted">
            MAY · 2026 / ISSUE 01
          </span>
        </div>
      </Container>
    </header>
  );
}
