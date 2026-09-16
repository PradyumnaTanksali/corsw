"use client";

import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { TONES, type Tone } from "@/lib/tones";

/**
 * Takes over from the static per-section tones: adds `tones-live` to <html>
 * and scrubs the role variables from one section's tone to the next as that
 * section scrolls in. Reduced motion keeps the static tones.
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

        sections.slice(1).forEach((section, i) => {
          const from = toneOf(sections[i]);
          const to = toneOf(section);
          if (from === to) return;
          gsap.fromTo(
            root,
            { ...from },
            {
              ...to,
              ease: "none",
              immediateRender: false,
              scrollTrigger: { trigger: section, start: "top 85%", end: "top 35%", scrub: true },
            },
          );
        });

        return () => {
          root.classList.remove("tones-live");
          for (const role of Object.keys(TONES.bone)) root.style.removeProperty(role);
        };
      });
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
