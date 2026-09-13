"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/primitives/Container";
import { reveal, useRevealTransition, viewport } from "@/lib/motion";

export function Colophon() {
  const revealTransition = useRevealTransition();

  return (
    <footer className="pb-24 pt-20 md:pb-32 md:pt-32">
      <Container>
        <motion.div
          variants={reveal}
          initial="initial"
          whileInView="whileInView"
          viewport={viewport}
          transition={revealTransition}
          className="flex flex-col items-center gap-6 border-t border-ink-rule pt-12 text-center"
        >
          <p className="font-mono text-[13px] leading-[1.7] text-ink-muted tabular-nums">
            Set in Inter, EB Garamond and JetBrains Mono.
            <br />
            Built and run by Pradyumna Tanksali.
            <br />
            Version 2.0 · September 2026.
          </p>

          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
            © Corner Software, 2024–2026.
          </p>

          <span
            aria-hidden="true"
            className="mt-2 inline-block h-2 w-2 bg-accent"
          />
        </motion.div>
      </Container>
    </footer>
  );
}
