"use client";

/**
 * Scroll-triggered animation primitives built on Framer Motion.
 *
 * Usage:
 *   <FadeUp>          — fade + translate-Y on scroll
 *   <FadeIn>          — fade only
 *   <SlideIn dir="left"> — slide from a side
 *   <Stagger>         — stagger container (wrap StaggerItem children)
 *   <StaggerItem>     — individual staggered child
 *
 * Everything here uses `m` (not `motion`) so it only pulls in
 * framer-motion's lightweight core — the actual animation engine is
 * loaded via <MotionProvider>'s <LazyMotion features={domAnimation}>
 * once, near the root, instead of every component eagerly bundling
 * the full renderer. Keeps these additions from adding page-load weight.
 *
 * Button/CTA hover (background + text colour + lift) is intentionally
 * NOT done here with framer — see the `.btn-fx` / `.btn-fx-primary` /
 * `.btn-fx-ghost` classes in globals.css. Pure CSS :hover costs nothing
 * on load and can't be beaten on performance by a JS-driven equivalent.
 */

import { m } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "-80px 0px" } as const;

/* ── Icon-button / card motion helpers ─────────────────────────
   For small JS-driven interactions that pure CSS can't express as
   cleanly (icon rotate/swap tied to React state, card lift paired
   with the scroll-reveal entrance spring already on StaggerItem).
──────────────────────────────────────────────────────────────── */
export const MotionButton = m.button;
export const MotionSpan = m.span;

export const ICON_BTN_TAP = { scale: 0.86 };
export const ICON_BTN_SPRING = { type: "spring", stiffness: 500, damping: 20 } as const;

export const CARD_SPRING = { type: "spring", stiffness: 320, damping: 24 } as const;
/* Transition lives *inside* whileHover (not as a sibling `transition` prop)
   so it only governs the hover animation — FadeUp/StaggerItem already use
   their own top-level `transition` for the scroll-entrance, and a sibling
   `transition` prop would silently override that. */
export const CARD_HOVER = { y: -6, transition: CARD_SPRING };

/* ── FadeUp ─────────────────────────────────────────────────── */
interface FadeUpProps extends HTMLMotionProps<"div"> {
  delay?: number;
  duration?: number;
  distance?: number;
}
export function FadeUp({
  delay = 0,
  duration = 0.45,
  distance = 30,
  ...props
}: FadeUpProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE }}
      {...props}
    />
  );
}

/* ── FadeIn ─────────────────────────────────────────────────── */
interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number;
  duration?: number;
}
export function FadeIn({ delay = 0, duration = 0.4, ...props }: FadeInProps) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    />
  );
}

/* ── SlideIn ────────────────────────────────────────────────── */
interface SlideInProps extends HTMLMotionProps<"div"> {
  dir?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
  distance?: number;
}
export function SlideIn({
  dir = "left",
  delay = 0,
  duration = 0.45,
  distance = 40,
  ...props
}: SlideInProps) {
  const initial = {
    opacity: 0,
    x: dir === "left" ? -distance : dir === "right" ? distance : 0,
    y: dir === "up" ? distance : dir === "down" ? -distance : 0,
  };
  return (
    <m.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE }}
      {...props}
    />
  );
}

/* ── Stagger container ──────────────────────────────────────── */
interface StaggerProps extends HTMLMotionProps<"div"> {
  staggerDelay?: number;
  delayChildren?: number;
}
export function Stagger({
  staggerDelay = 0.07,
  delayChildren = 0.03,
  ...props
}: StaggerProps) {
  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay, delayChildren },
        },
      }}
      {...props}
    />
  );
}

/* ── Stagger child ──────────────────────────────────────────── */
interface StaggerItemProps extends HTMLMotionProps<"div"> {
  distance?: number;
  duration?: number;
}
export function StaggerItem({
  distance = 22,
  duration = 0.38,
  ...props
}: StaggerItemProps) {
  return (
    <m.div
      variants={{
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: EASE },
        },
      }}
      {...props}
    />
  );
}
