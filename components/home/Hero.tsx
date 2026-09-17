import type { CSSProperties } from "react";
import { Container } from "@/components/primitives/Container";
import { Drift } from "@/components/motion/Drift";
import { DEMO_HREF } from "@/lib/projects";

const line = (n: number) => ({ "--line": n }) as CSSProperties;

/** Chapter B. The headline rises in CSS (no JS for the LCP element) and lifts away on scroll. */
export function Hero() {
  return (
    <section data-tone="bone" className="relative flex min-h-svh flex-col justify-end pb-14 pt-28 md:pb-20">
      <Container>
        <Drift y={-140} fade>
          <div className="flex items-center gap-4">
            <svg aria-hidden="true" viewBox="0 0 64 64" shapeRendering="crispEdges" className="size-10 md:size-14">
              <rect width="64" height="64" fill="var(--ink)" />
              <path d="M8 8 L40 8 L40 40 L8 40 Z M8 8 L8 56 L56 56 L56 40 L40 40 Z" fill="var(--bg)" />
              <rect className="mark-stamp" x="16" y="16" width="16" height="16" fill="var(--accent)" />
            </svg>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              Est. 2024
              <span aria-hidden="true" className="mx-2 text-ink-faint">·</span>
              India
            </p>
          </div>

          <h1 className="mt-10 font-accent text-[clamp(3.25rem,12.5vw,12rem)] leading-[0.84] tracking-[-0.035em] md:mt-14">
            <span className="line-mask">
              <span className="line-rise" style={line(0)}>Software</span>
            </span>
            <span className="line-mask">
              <span className="line-rise" style={line(1)}>
                at every <span className="text-accent">corner.</span>
              </span>
            </span>
          </h1>
        </Drift>

        <div className="mt-12 grid gap-8 border-t border-ink-rule pt-6 md:mt-16 md:grid-cols-12 md:items-start">
          <p className="text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium leading-[1.2] tracking-[-0.02em] text-balance md:col-span-6">
            Industry platforms for healthcare, manufacturing and food service. Built, hosted and{" "}
            <span className="font-extrabold">run</span> by Corner Software.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[13px] md:col-span-6 md:justify-end">
            <a href={DEMO_HREF} className="inline-flex items-center gap-2 text-accent">
              <span className="link-draw">Request a demo</span>
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="#engineering"
              className="inline-flex items-center gap-2 text-ink transition-colors duration-150 hover:text-accent"
            >
              <span className="link-draw">Build with Corsw</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
