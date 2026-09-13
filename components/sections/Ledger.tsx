"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { DEMO_EMAIL } from "@/lib/projects";
import {
  reveal,
  stagger,
  staggerTransition,
  useRevealTransition,
  viewport,
} from "@/lib/motion";

const rows: Array<{ key: string; label: string; href: string }> = [
  { key: DEMO_EMAIL, label: "Direct line", href: `mailto:${DEMO_EMAIL}` },
  { key: "corsw.in/demo", label: "See a platform running", href: "/demo" },
  {
    key: "github.com/PradyumnaTanksali",
    label: "Source",
    href: "https://github.com/PradyumnaTanksali",
  },
  {
    key: "modlio.corsw.in",
    label: "Archive · platforms",
    href: "https://modlio.corsw.in",
  },
  {
    key: "scenestudio.corsw.in",
    label: "Archive · apps",
    href: "https://scenestudio.corsw.in",
  },
];

export function Ledger() {
  const revealTransition = useRevealTransition();

  return (
    <section className="py-32 md:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
          <div className="md:col-span-4">
            <SectionRule n={6} label="Ledger" />
            <h2 className="mt-8 max-w-xs text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.015em] text-balance">
              External{" "}
              <span className="font-accent font-normal text-accent">lines</span>.
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
            {rows.map((row) => {
              const external = row.href.startsWith("http");
              return (
                <motion.li
                  key={row.key}
                  variants={reveal}
                  transition={revealTransition}
                  className="border-t border-ink-rule first:border-t-0"
                >
                  <a
                    href={row.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="group grid grid-cols-12 items-baseline gap-4 py-4 transition-colors duration-150"
                  >
                    <span className="col-span-12 break-words text-ink underline decoration-transparent underline-offset-4 transition-colors duration-150 group-hover:decoration-accent group-hover:text-accent md:col-span-6">
                      {row.key}
                    </span>
                    <span className="col-span-9 text-ink-muted md:col-span-5">
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
              );
            })}
          </motion.ul>
        </div>
      </Container>
    </section>
  );
}
