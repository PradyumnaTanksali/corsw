"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/**
 * A heading whose lines rise out of masks when it scrolls into view.
 * SplitText re-splits on resize and font load, and keeps an aria-label with
 * the full text so the split lines read as one sentence.
 */
export function SplitReveal({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          // Masks get the `line-mask` class, whose padding keeps descenders.
          linesClass: "line",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 135,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            }),
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <h2 ref={ref} id={id} className={className}>
      {children}
    </h2>
  );
}
