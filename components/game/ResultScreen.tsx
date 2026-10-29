"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { RotateCcw } from "lucide-react";
import type { Archetype, Totals } from "@/lib/game/archetypes";
import { patternSummary } from "@/lib/game/archetypes";
import { trackOnce } from "@/lib/analytics";
import { Wordmark } from "@/components/Wordmark";
import { AuraCard } from "./AuraCard";
import { GameShell } from "./GameShell";
import { ShareActions } from "./ShareActions";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ResultScreen({
  archetype,
  totals,
  onPlayAgain,
  roundIndex,
  storageOk,
}: {
  archetype: Archetype;
  totals: Totals;
  onPlayAgain: () => void;
  roundIndex: number;
  storageOk: boolean;
}) {
  const reduce = useReducedMotion();
  useEffect(() => {
    trackOnce(`result:${roundIndex}:${archetype.id}`, "result_viewed", { archetype_id: archetype.id });
  }, [archetype.id, roundIndex]);

  const item = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: EASE } };

  return (
    <GameShell
      theme="ink"
      head={
        <>
          <Wordmark />
          <span className="small muted">Your social aura</span>
        </>
      }
      foot={
        <button type="button" className="btn btn-ghost btn-block" onClick={onPlayAgain}>
          <RotateCcw size={18} aria-hidden="true" /> Play another five
        </button>
      }
      aria-label="Your result"
    >
      <div className="py-2">
        <motion.div {...item(0.1)}>
          <AuraCard archetype={archetype} />
        </motion.div>

        <motion.div className="mt-5" style={{ maxWidth: "34rem", marginInline: "auto" }} {...item(0.3)}>
          <p style={{ color: "var(--fg-2)", textWrap: "pretty" }}>{archetype.description}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="consequence-label">Where it shines</p>
              <ul className="mt-1.5 grid gap-1">
                {archetype.strengths.map((s) => (
                  <li key={s} className="small" style={{ color: "var(--fg-2)" }}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="consequence-label" style={{ color: "var(--accent)" }}>Watch out for</p>
              <ul className="mt-1.5 grid gap-1">
                {archetype.watchOuts.map((s) => (
                  <li key={s} className="small" style={{ color: "var(--fg-2)" }}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="small mt-4" style={{ color: "var(--fg-3)" }}>
            {patternSummary(totals)} It&rsquo;s a read of five choices, not a diagnosis of you.
            {storageOk ? "" : " This device couldn't save your round."}
          </p>
        </motion.div>

        <motion.div className="mt-5" style={{ maxWidth: "34rem", marginInline: "auto" }} {...item(0.45)}>
          <ShareActions archetype={archetype} />
        </motion.div>
      </div>
    </GameShell>
  );
}
