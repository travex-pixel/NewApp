"use client";

import { motion, useReducedMotion } from "motion/react";
import { ForkMark } from "./ForkMark";
import { useHydrated } from "@/lib/game/progress-store";

/** The fork, drawing itself: one road, then the split, then the dot. Static when motion is reduced. */
export function HeroMark({ size = 44 }: { size?: number }) {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  // The server and the first client render show the finished mark, so they match.
  // Once the page is live, the drawing animation plays (unless motion is reduced).
  if (!hydrated || reduce) return <ForkMark size={size} className="olive" />;
  const draw = (delay: number) => ({
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 0.55, delay, ease: [0.65, 0, 0.35, 1] as const },
  });
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="olive">
      <motion.path d="M2.5 12H10.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...draw(0.1)} />
      <motion.path d="M10.5 12L19.5 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...draw(0.5)} />
      <motion.path d="M10.5 12L19.5 19.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...draw(0.5)} />
      <motion.circle
        cx="19.5"
        cy="4.5"
        r="2.1"
        fill="var(--accent)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 14, delay: 1.0 }}
      />
    </svg>
  );
}
