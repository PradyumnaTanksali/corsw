"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Words drifting left, faster while the page scrolls. Screen readers get the list once. */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const track = el?.querySelector<HTMLElement>("[data-track]");
      if (!el || !track) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const setX = gsap.quickSetter(track, "x", "px");
        const onScreen = ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top" });
        let x = 0;
        let lastY = window.scrollY;
        const tick = (_time: number, deltaMs: number) => {
          const y = window.scrollY;
          // Base 60px/s, plus up to ~1100px/s while scrolling fast.
          const speed = 60 + Math.min(Math.abs(y - lastY), 80) * 14;
          lastY = y;
          if (!onScreen.isActive) return;
          x = (x - (speed * deltaMs) / 1000) % (track.scrollWidth / 2);
          setX(x);
        };
        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
      });
    },
    { scope: root },
  );

  const line = items.map((item) => (
    <span key={item} className="flex items-center gap-[0.35em] pr-[0.35em]">
      {item}
      <span className="font-accent text-accent">·</span>
    </span>
  ));

  return (
    <div ref={root} className={cn("overflow-hidden border-y border-ink-rule py-6", className)}>
      <p className="sr-only">{items.join(" · ")}</p>
      <div
        data-track
        aria-hidden="true"
        className="flex w-max whitespace-nowrap text-[clamp(2.5rem,7vw,6.5rem)] font-semibold leading-none tracking-[-0.035em]"
      >
        {line}
        {line}
      </div>
    </div>
  );
}
