"use client";

import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { TONES, type Tone } from "@/lib/tones";

/**
 * Takes over from the static per-section tones: adds `tones-live` to <html>
 * and crossfades the role variables to a section's tone when that section
 * reaches 60% of the viewport. Timed, not scrubbed: a scrub can stop halfway,
 * where text and ground meet near 1:1 contrast. Reduced motion keeps the
 * static tones.
 */
export function ToneScroller() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const root = document.documentElement;
        const sections = gsap.utils.toArray<HTMLElement>("main [data-tone]");
        if (sections.length === 0) return;
        const toneOf = (el: HTMLElement) => TONES[el.dataset.tone as Tone];

        gsap.set(root, toneOf(sections[0]));
        root.classList.add("tones-live");

        for (const section of sections) {
          ScrollTrigger.create({
            trigger: section,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => {
              if (self.isActive) {
                gsap.to(root, { ...toneOf(section), duration: 0.6, ease: "power2.inOut", overwrite: "auto" });
              }
            },
          });
        }

        return () => {
          // Crossfades start in callbacks, outside this context's cleanup.
          gsap.killTweensOf(root);
          root.classList.remove("tones-live");
          for (const role of Object.keys(TONES.bone)) root.style.removeProperty(role);
        };
      });
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
