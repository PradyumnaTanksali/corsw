"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

interface AccentLineProps {
  className?: string;
  height?: string;
}

/**
 * Reduced motion is handled by the root <MotionConfig reducedMotion="user">:
 * height is a positional value, so Framer sets it instantly (full line, no
 * draw) when the user prefers reduced motion. A manual useReducedMotion()
 * branch here would render different markup from the server pass and React
 * does not patch inline-style mismatches on hydration — the line would stay
 * at 0px for reduced-motion users.
 */
export function AccentLine({
  className,
  height = "60vh",
}: AccentLineProps) {
  return (
    <motion.span
      aria-hidden="true"
      className={className}
      style={{
        display: "block",
        width: "1px",
        background: "var(--accent)",
        transformOrigin: "top",
      }}
      initial={{ height: 0 }}
      animate={{ height }}
      transition={{ duration: 1.2, ease }}
    />
  );
}
