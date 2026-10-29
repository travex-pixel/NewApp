"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { Archetype } from "@/lib/game/archetypes";
import { ForkMark } from "@/components/ForkMark";
import { SITE_HOST } from "@/lib/site";
import { MotifMark } from "./MotifMark";

/**
 * The social aura card. A 4:5 collectible in paper and ink that tilts under
 * your finger and catches the light once when it arrives. The exported PNG
 * (lib/aura-image.tsx) mirrors this composition.
 */
export function AuraCard({ archetype, entrance = false }: { archetype: Archetype; entrance?: boolean }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [9, -9]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-11, 11]), { stiffness: 180, damping: 18 });
  const glare = useTransform([px, py], ([x, y]: number[]) => {
    const strength = Math.min(0.32, (Math.abs(x) + Math.abs(y)) * 0.6);
    return `radial-gradient(circle at ${50 + x * 70}% ${50 + y * 70}%, rgb(255 255 255 / ${strength}), transparent 55%)`;
  });

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function leave() {
    px.set(0);
    py.set(0);
  }

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        className="aura-card"
        data-archetype={archetype.id}
        onPointerMove={move}
        onPointerLeave={leave}
        onPointerUp={leave}
        style={reduce ? undefined : { rotateX: rx, rotateY: ry }}
        initial={entrance && !reduce ? { opacity: 0, y: 40, scale: 0.9, rotateX: 18 } : false}
        animate={entrance && !reduce ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : undefined}
        transition={{ type: "spring", damping: 20, stiffness: 140, mass: 0.9 }}
      >
        {!reduce ? (
          <motion.div
            className="aura-sheen"
            aria-hidden="true"
            initial={{ x: "-70%" }}
            animate={{ x: "70%" }}
            transition={{ duration: 1.3, delay: entrance ? 0.7 : 0.2, ease: [0.4, 0, 0.2, 1] }}
          />
        ) : null}
        {!reduce ? (
          <motion.div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: glare,
              mixBlendMode: "soft-light",
            }}
          />
        ) : null}

        <div className="flex items-center justify-between" style={{ fontSize: "3.8cqw" }}>
          <span className="inline-flex items-center gap-1.5 serif" style={{ fontWeight: 600, fontSize: "4.6cqw" }}>
            <ForkMark size={16} /> Instinct
          </span>
          <span style={{ color: "var(--cool)", fontWeight: 600 }}>Social aura</span>
        </div>

        <div className="mt-auto">
          <MotifMark motif={archetype.motif} size={56} stroke="var(--cool)" dot="var(--hot)" />
          <motion.p
            className="display mt-3"
            style={{ fontSize: "9.6cqw", lineHeight: 1.02, fontWeight: 600, letterSpacing: "-0.025em" }}
            initial={entrance && !reduce ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {archetype.name}
          </motion.p>
          <motion.p
            className="serif mt-2.5"
            style={{ fontStyle: "italic", fontSize: "5.3cqw", lineHeight: 1.3, color: "var(--ink-2)", textWrap: "pretty" }}
            initial={entrance && !reduce ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {archetype.headline}
          </motion.p>
        </div>

        <div className="mt-auto pt-4" style={{ fontSize: "3.5cqw", color: "var(--ink-2)" }}>
          <div style={{ width: "8cqw", height: 3, background: "var(--hot)", marginBottom: 6 }} />
          <div>Five situations. One gut instinct.</div>
          <div className="flex items-baseline justify-between gap-2" style={{ color: "var(--ink-3)" }}>
            <span>Which one are you?</span>
            <span className="tabular" style={{ whiteSpace: "nowrap", fontSize: "3.1cqw" }}>
              {SITE_HOST}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
