"use client";

import { useReducedMotion, type Transition, type Variants } from "framer-motion";

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

/**
 * `MotionConfig reducedMotion="user"` only snaps positional keys (x/y/etc.);
 * opacity tweens still run at full duration, and per-component `transition`
 * props override MotionConfig anyway. These hooks return the shared
 * transition consts unchanged (reference-identical) for normal motion, and a
 * duration-0 variant when the user prefers reduced motion, so reveals snap
 * instead of fading.
 */
const instantTransition: Transition = { duration: 0 };

export function useRevealTransition(): Transition {
  return useReducedMotion() ? instantTransition : revealTransition;
}

export function useFadeTransition(): Transition {
  return useReducedMotion() ? instantTransition : fadeTransition;
}

export const stagger: Variants = {
  initial: {},
  whileInView: {},
};

export const staggerTransition = {
  staggerChildren: 0.05,
  delayChildren: 0.05,
};

export const viewport = { once: true, margin: "-120px" } as const;
