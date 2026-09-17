"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/** Lines brighten from faint to full ink as the paragraph crosses the viewport. */
export function ScrubText({
  as = "p",
  className,
  children,
}: {
  as?: "p" | "h2";
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
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
