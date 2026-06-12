"use client";

import { MotionConfig } from "framer-motion";

/**
 * Applies `reducedMotion="user"` to every motion component below it, so the
 * whileInView reveals respect `prefers-reduced-motion` (Framer drives inline
 * styles that the CSS-only @media block cannot stop).
 */
export function MotionProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
