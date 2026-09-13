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

const rows: Array<{ key: string; label: string; href: string }> = [
  {
    key: "modlio.corsw.in",
    label: "Enterprise division",
    href: "https://modlio.corsw.in",
  },
  {
    key: "scenestudio.corsw.in",
    label: "Indie studio",
    href: "https://scenestudio.corsw.in",
  },
  {
    key: "github.com/corsw",
    label: "Public source",
    href: "https://github.com/corsw",
  },
  {
    key: "hello@corsw.in",
    label: "Direct line",
    href: "mailto:hello@corsw.in",
  },
];

export function Ledger() {
  const revealTransition = useRevealTransition();

  return (
    <section className="py-32 md:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
          <div className="md:col-span-4">
            <SectionRule numeral="VII" label="Ledger" />
            <h2 className="mt-8 max-w-xs text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.015em] text-balance">
              External{" "}
              <span className="font-serif italic font-normal text-accent">
                lines
              </span>
              .
            </h2>
          </div>

          <motion.ul
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={viewport}
            transition={staggerTransition}
            className="md:col-span-8 md:col-start-5 font-mono text-[13px] leading-[1.7] tabular-nums"
          >
            {rows.map((row) => (
              <motion.li
                key={row.key}
                variants={reveal}
                transition={revealTransition}
                className="border-t border-ink-rule first:border-t-0"
              >
                <a
                  href={row.href}
                  target={row.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    row.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group grid grid-cols-12 items-baseline gap-4 py-4 transition-colors duration-150"
                >
                  <span className="col-span-12 text-ink underline decoration-transparent underline-offset-4 transition-colors duration-150 group-hover:decoration-accent group-hover:text-accent md:col-span-5">
                    {row.key}
                  </span>
                  <span className="col-span-9 text-ink-muted md:col-span-6">
                    {row.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="col-span-3 text-right text-ink-faint transition-colors duration-150 group-hover:text-accent md:col-span-1"
                  >
                    →
                  </span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </Container>
    </section>
  );
}
