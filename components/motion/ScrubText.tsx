"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/** Lines brighten from faint to full ink as the paragraph crosses the viewport. */
export function ScrubText({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(el, {
          type: "lines",
          autoSplit: true,
          // "auto" (the default) sets aria-label on this <p> — invalid there,
          // and ignored by screen readers — and aria-hidden on every line,
          // which silences the paragraph entirely. Leave the real text alone.
          aria: "none",
          onSplit: (self) =>
            gsap.fromTo(
              self.lines,
              { opacity: 0.15 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.4,
                scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 50%", scrub: true },
              },
            ),
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}
