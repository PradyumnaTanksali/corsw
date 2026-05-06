"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";

interface VermillionLineProps {
  className?: string;
  height?: string;
}

export function VermillionLine({
  className,
  height = "60vh",
}: VermillionLineProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <span
        aria-hidden="true"
        className={className}
        style={{
          display: "block",
          width: "1px",
          height,
          background: "var(--accent)",
        }}
      />
    );
  }

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
