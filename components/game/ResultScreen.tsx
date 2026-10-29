"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Copy, Download, Info, Link2, RotateCcw, Share2 } from "lucide-react";
import type { Archetype, Totals } from "@/lib/game/archetypes";
import { ARCHETYPE_IDS, DIMENSION_LABELS, nextRoundTip, patternSummary } from "@/lib/game/archetypes";
import { trackOnce } from "@/lib/analytics";
import { buzz, play } from "@/lib/sound";
import { AuraCard } from "./AuraCard";
import { AuraCollection } from "./AuraCollection";
import { GameHeader } from "./GameHeader";
import { GameShell } from "./GameShell";
import { Sheet } from "./Sheet";
import { useShare } from "./useShare";

const EASE = [0.16, 1, 0.3, 1] as const;

export interface Pick {
  tag: string;
  title: string;
}

export function ResultScreen({
  archetype,
  totals,
  picks,
  found,
  isNew,
  onPlayAgain,
  roundIndex,
  storageOk,
}: {
  archetype: Archetype;
  totals: Totals;
  picks: Pick[];
  found: Set<string>;
  isNew: boolean;
  onPlayAgain: () => void;
  roundIndex: number;
  storageOk: boolean;
}) {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<"reading" | "card">(reduce ? "card" : "reading");
  const [about, setAbout] = useState(false);
  const share = useShare(archetype);
  const tip = useMemo(() => nextRoundTip(totals), [totals]);

  useEffect(() => {
    trackOnce(`result:${roundIndex}:${archetype.id}`, "result_viewed", { archetype_id: archetype.id });
  }, [archetype.id, roundIndex]);

  // The little ceremony: read back the five, then reveal the card.
  useEffect(() => {
    if (stage !== "reading") return;
    const ticks = picks.map((_, i) => window.setTimeout(() => play.tick(i), 260 + i * 260));
    const done = window.setTimeout(() => setStage("card"), 260 + picks.length * 260 + 650);
    return () => {
      ticks.forEach(window.clearTimeout);
      window.clearTimeout(done);
    };
  }, [stage, picks]);

  useEffect(() => {
    if (stage !== "card") return;
    play.aura();
    buzz([12, 60, 18]);
  }, [stage]);

  const fade = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: EASE } };

  return (
    <GameShell
      theme="ink"
      head={<GameHeader right={<span className="small muted">Your social aura</span>} />}
      foot={
        stage === "card" ? (
          <>
            <motion.button type="button" className="btn btn-accent btn-block" onClick={share.shareImage} disabled={share.busy} {...fade(0.9)}>
              <Share2 size={18} aria-hidden="true" />
              {share.busy ? "Making your card…" : "Share your social aura"}
            </motion.button>
            <motion.div className="grid grid-cols-2 gap-2" {...fade(1.0)}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAbout(true)}>
                <Info size={16} aria-hidden="true" /> What it means
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={onPlayAgain}>
                <RotateCcw size={16} aria-hidden="true" /> Play another 5
              </button>
            </motion.div>
          </>
        ) : undefined
      }
      aria-label="Your result"
    >
      <AnimatePresence mode="wait">
        {stage === "reading" ? (
          <motion.button
            key="reading"
            type="button"
            className="centred text-left w-full"
            onClick={() => setStage("card")}
            aria-label="Reading your five answers. Tap to skip."
            exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
            transition={{ duration: 0.35 }}
            style={{ background: "none", border: 0, cursor: "pointer" }}
          >
            <motion.p className="display" style={{ fontSize: "clamp(1.6rem, 4.5dvh, 2.2rem)" }} {...fade(0)}>
              Reading your five…
            </motion.p>
            <ul className="mt-5 grid gap-2">
              {picks.map((p, i) => (
                <motion.li
                  key={i}
                  className="panel flex items-center gap-3"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.26 + i * 0.26, ease: EASE }}
                >
                  <Check size={16} className="accent" aria-hidden="true" />
                  <span className="small muted" style={{ flex: 1 }}>
                    {p.title}
                  </span>
                  <span className="small font-semibold">{p.tag}</span>
                </motion.li>
              ))}
            </ul>
            <p className="small faint mt-5">Tap to skip</p>
          </motion.button>
        ) : (
          <motion.div key="card" className="centred w-full" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
            {isNew ? (
              <motion.p className="small accent font-semibold text-center mb-2" {...fade(0.9)}>
                New aura found · {found.size} of {ARCHETYPE_IDS.length}
              </motion.p>
            ) : null}
            <div style={{ width: "min(100%, calc((100dvh - 290px) * 0.8), 360px)", marginInline: "auto" }}>
              <AuraCard archetype={archetype} entrance />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {share.toast ? (
        <div className="toast" role="status" aria-live="polite">
          {share.toast}
        </div>
      ) : null}

      <Sheet open={about} onClose={() => setAbout(false)} title={archetype.name} theme="ink">
        <div className="grid gap-5">
          <p className="muted" style={{ textWrap: "pretty" }}>
            {archetype.description}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="label">Where it shines</p>
              <ul className="mt-1.5 grid gap-1">
                {archetype.strengths.map((s) => (
                  <li key={s} className="small muted">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label" style={{ color: "var(--accent)" }}>
                Watch out for
              </p>
              <ul className="mt-1.5 grid gap-1">
                {archetype.watchOuts.map((s) => (
                  <li key={s} className="small muted">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="panel">
            <p className="label">Try next round</p>
            <p className="mt-1" style={{ textWrap: "pretty" }}>
              {tip.tip}
            </p>
            <p className="small faint mt-1">You used {DIMENSION_LABELS[tip.dimension].toLowerCase()} least this time.</p>
          </div>
          <p className="small faint">
            {patternSummary(totals)} It&rsquo;s a read of five choices, not a verdict on you.
            {storageOk ? "" : " This device couldn't save your round."}
          </p>
          <AuraCollection found={found} current={archetype.id} />
          <div>
            <p className="label">More ways to share</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button type="button" className="btn btn-ghost btn-sm" onClick={share.download} disabled={share.busy}>
                <Download size={16} aria-hidden="true" /> Image
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={share.copyLink}>
                <Link2 size={16} aria-hidden="true" /> Link
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={share.copyText}>
                <Copy size={16} aria-hidden="true" /> Text
              </button>
            </div>
          </div>
        </div>
      </Sheet>
    </GameShell>
  );
}
