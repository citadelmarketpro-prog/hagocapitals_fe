"use client";

/**
 * Wraps the (site) route group so every animated component can use the
 * lightweight `m` component instead of the full `motion` bundle.
 * `domAnimation` covers everything this codebase uses (animate,
 * whileHover/whileTap, whileInView, AnimatePresence exit animations) at a
 * fraction of the JS cost of importing `motion` directly everywhere —
 * keeps the animation additions from adding page-load weight.
 */

import { LazyMotion, domAnimation } from "framer-motion";

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
