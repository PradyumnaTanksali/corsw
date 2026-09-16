"use client";

import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Lenis inertia scrolling on fine pointers, driven by GSAP's ticker so
 * ScrollTrigger reads the same position every frame. Touch and reduced motion
 * keep native scrolling.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenis = useRef<Lenis | null>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const instance = new Lenis({ lerp: 0.1, anchors: true, stopInertiaOnNavigate: true });
      const raf = (time: number) => instance.raf(time * 1000);
      instance.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      lenis.current = instance;
      return () => {
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
        instance.destroy();
        lenis.current = null;
      };
    });
    // Web fonts change line lengths after first layout; re-measure once they land.
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  });

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
