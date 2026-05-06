import type { Variants } from "framer-motion";

export const ease = [0.32, 0.72, 0, 1] as const;

export const reveal: Variants = {
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
};

export const revealTransition = {
  duration: 0.5,
  ease,
};

export const fade: Variants = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
};

export const fadeTransition = {
  duration: 0.6,
  ease,
};

export const stagger: Variants = {
  initial: {},
  whileInView: {},
};

export const staggerTransition = {
  staggerChildren: 0.05,
  delayChildren: 0.05,
};

export const viewport = { once: true, margin: "-120px" } as const;
