"use client";

import { useRef } from "react";
import { Container } from "@/components/primitives/Container";
import { Ordinal } from "@/components/primitives/Ordinal";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Device } from "@/components/site/Device";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { Project } from "@/lib/projects";

/**
 * Desktop with motion: one sticky frame swaps screens as each step's caption
 * crosses the middle of the viewport. Otherwise every step shows its own
 * device inline.
 */
export function Walkthrough({ project }: { project: Project }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        el.setAttribute("data-live", "");
        const screens = gsap.utils.toArray<HTMLElement>("[data-screen]", el);
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]", el);
        const show = (index: number) => {
          gsap.to(screens, { autoAlpha: (j: number) => (j === index ? 1 : 0), duration: 0.5, overwrite: true });
          steps.forEach((s, j) => s.toggleAttribute("data-active", j === index));
        };
        gsap.set(screens, { autoAlpha: (j: number) => (j === 0 ? 1 : 0) });
        steps[0]?.setAttribute("data-active", "");
        steps.forEach((step, i) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => {
              if (self.isActive) show(i);
            },
          });
        });
        return () => {
          el.removeAttribute("data-live");
          steps.forEach((s) => s.removeAttribute("data-active"));
        };
      });
    },
    { scope: root },
  );

  return (
    <section data-tone="ink" aria-labelledby="walk-title" className="py-32 md:py-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={2} label="In use" className="md:col-span-3" />
          <SplitReveal
            id="walk-title"
            className="text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-balance md:col-span-9"
          >
            How it <span className="font-accent text-accent">runs.</span>
          </SplitReveal>
        </div>

        <div ref={root} className="mt-20 grid gap-4 md:mt-28 md:grid-cols-12 md:gap-10">
          <div data-walk-stage className="md:col-span-7">
            <div className="sticky top-24 aspect-[5/4] border border-ink-rule bg-bg-card">
              {project.walkthrough.map((step) => (
                <div
                  key={step.alt}
                  data-screen
                  className="absolute inset-0 flex items-center justify-center p-8 lg:p-12"
                >
                  <Device
                    step={step}
                    sizes="(min-width: 768px) 55vw, 100vw"
                    className={step.device === "phone" ? "h-full" : "w-full"}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Stacked (no sticky stage): the steps take the folio's nine columns. */}
          <ol className="md:col-span-9 md:col-start-4 md:in-data-live:col-span-5 md:in-data-live:col-start-auto">
            {project.walkthrough.map((step, i) => (
              <li
                key={step.alt}
                data-step
                className="flex flex-col gap-6 border-t border-ink-rule py-10 md:min-h-[70svh] md:justify-center md:border-t-0"
              >
                <div data-inline-device>
                  <Device
                    step={step}
                    sizes="100vw"
                    className={step.device === "phone" ? "mx-auto w-full max-w-[280px]" : "w-full"}
                  />
                </div>
                <Ordinal n={i + 1} dot className="text-2xl text-accent" />
                <p className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-balance">
                  {step.caption}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
