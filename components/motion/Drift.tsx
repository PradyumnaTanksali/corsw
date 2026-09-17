"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Moves its content by `y` px (and optionally fades it) over the first screen of scrolling. */
export function Drift({
  y,
  fade = false,
  className,
  children,
}: {
  y: number;
  fade?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(ref.current, {
          y,
          opacity: fade ? 0.15 : 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: 0, end: "bottom top", scrub: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
