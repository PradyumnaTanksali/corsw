"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/**
 * A heading whose lines rise out of masks when it scrolls into view.
 * SplitText re-splits on resize and font load, and keeps an aria-label with
 * the full text so the split lines read as one sentence.
 */
export function SplitReveal({
  as = "h2",
  id,
  className,
  children,
}: {
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  // A JSX host element (not React.createElement) so eslint-plugin-react-hooks
  // can see the ref is handled by the jsx-runtime, not read during render.
  // `as` is narrowed to a union of tag names; widen it so TS resolves one
  // generic ref/props shape instead of failing to unify the union.
  const Tag = as as ElementType;

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
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
