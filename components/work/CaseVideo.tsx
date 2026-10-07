"use client";

import { useEffect, useRef, useState } from "react";
import type { Clip } from "@/lib/projects";

/**
 * A silent product loop filling its positioned parent. Plays once hydrated unless
 * reduced motion is on; without JS or with reduced motion it is the poster. A Pause
 * control, since it loops past five seconds.
 */
export function CaseVideo({ clip }: { clip: Clip }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => (still.matches ? v.pause() : v.play().catch(() => {}));
    sync();
    still.addEventListener("change", sync);
    return () => still.removeEventListener("change", sync);
  }, []);

  return (
    <>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        poster={clip.poster}
        aria-label={clip.label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={clip.webm} type="video/webm" />
        <source src={clip.mp4} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={() => (ref.current?.paused ? ref.current.play().catch(() => {}) : ref.current?.pause())}
        className="absolute bottom-3 right-3 border border-ink-rule bg-bg px-3 py-2 font-mono text-[12px] uppercase tracking-[0.14em] text-ink hover:text-accent"
      >
        {playing ? "Pause" : "Play"}
      </button>
    </>
  );
}
