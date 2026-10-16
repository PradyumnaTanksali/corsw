"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ScrollTrigger } from "@/lib/gsap";

type Mount = (root: HTMLElement) => void;
declare global {
  interface Window {
    isoFigures?: Record<string, Mount>;
  }
}

// The kit tones mix from the chapter roles, so a figure follows the chapter it sits in.
const ROLES = {
  "--fig-card": "var(--bg-card)",
  "--fig-ink": "var(--ink)",
  "--fig-accent": "var(--accent)",
  "--fig-rule": "var(--ink-rule)",
  "--fig-mono": "var(--font-jetbrains-mono)",
} as CSSProperties;

const scripts = new Map<string, Promise<void>>();
/** One <script type="module"> per figure for the whole visit; it registers window.isoFigures[name]. */
function load(src: string) {
  let ready = scripts.get(src);
  if (!ready) {
    ready = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.type = "module";
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => {
        scripts.delete(src);
        reject(new Error(`could not load ${src}`));
      };
      document.head.appendChild(script);
    });
    scripts.set(src, ready);
  }
  return ready;
}

/**
 * A working drawing from public/figures (built in corsw-figures, framework-free): the drawing and
 * its live script are fetched only as it nears the viewport. `fig` and `title` set the plate's
 * corner labels, which the product pages leave as their own.
 */
export function IsoFigure({ name, fig, title, theme }: { name: string; fig: string; title: string; theme: "light" | "dark" }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let gone = false;
    const seen = new IntersectionObserver(
      async ([entry]) => {
        if (!entry?.isIntersecting) return;
        seen.disconnect();
        try {
          const res = await fetch(`/figures/${name}.html`);
          if (!res.ok) throw new Error(`figure ${name}: ${res.status}`);
          const html = await res.text();
          if (gone) return;
          el.innerHTML = html;
          const corner = (key: string, text: string) => {
            const node = el.querySelector(`[data-corner="${key}"]`);
            if (node) node.textContent = text;
          };
          corner("fig", fig);
          corner("title", title);
          // the triggers below measured the placeholder; measure again
          requestAnimationFrame(() => ScrollTrigger.refresh());
          await load(`/figures/${name}.js`);
          if (!gone) window.isoFigures?.[name]?.(el);
        } catch {
          // no drawing is the fallback; the section copy stands alone
          if (!gone) el.hidden = true;
        }
      },
      { rootMargin: "600px 0px" },
    );
    seen.observe(el);
    return () => {
      gone = true;
      seen.disconnect();
    };
  }, [name, fig, title]);

  // No placeholder size: without JS there is no drawing and no gap. The site has no shadows, so the
  // drawing's ground halo is off here.
  return <div ref={root} className="iso iso-embed [&_.iso-halo]:hidden" data-theme={theme} style={ROLES} />;
}
