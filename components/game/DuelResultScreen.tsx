"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Send, Sparkles } from "lucide-react";
import type { Choice } from "@/lib/content";
import type { Archetype } from "@/lib/game/archetypes";
import type { Match } from "@/lib/game/duel";
import { buzz, play } from "@/lib/sound";
import { AuraCard } from "./AuraCard";
import { GameHeader } from "./GameHeader";
import { GameShell } from "./GameShell";
import { MotifMark } from "./MotifMark";
import { Sheet } from "./Sheet";
import { useShare } from "./useShare";

const EASE = [0.16, 1, 0.3, 1] as const;

export interface DuelRow {
  title: string;
  mine: Choice;
  theirs: Choice;
}

/** The payoff of "compare with a friend": how alike you are, both auras, and the five side by side. */
export function DuelResultScreen({
  match,
  me,
  them,
  rows,
  onSendBack,
  onPlayToday,
  toast,
}: {
  match: Match;
  me: Archetype;
  them: Archetype;
  rows: DuelRow[];
  onSendBack: () => void;
  onPlayToday: () => void;
  toast?: string | null;
}) {
  const reduce = useReducedMotion();
  const [mine, setMine] = useState(false);
  const share = useShare(me);

  useEffect(() => {
    play.aura();
    buzz([12, 60, 18]);
  }, []);

  const fade = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: EASE } };

  return (
    <GameShell
      theme="ink"
      head={<GameHeader right={<span className="small muted">You vs your friend</span>} />}
      foot={
        <>
          <motion.button type="button" className="btn btn-accent btn-block" onClick={onSendBack} {...fade(0.8)}>
            <Send size={18} aria-hidden="true" /> Send your five back
          </motion.button>
          <motion.div className="grid grid-cols-2 gap-2" {...fade(0.9)}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setMine(true)}>
              <Sparkles size={16} aria-hidden="true" /> Your aura
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onPlayToday}>
              Today&rsquo;s 5 <ArrowRight size={16} aria-hidden="true" />
            </button>
          </motion.div>
        </>
      }
      aria-label="How you compare"
    >
      <div className="centred">
        <motion.div className="text-center" {...fade(0.05)}>
          <p className="display tabular" style={{ fontSize: "clamp(3rem, 9dvh, 4.25rem)", lineHeight: 1 }}>
            {match.count}
            <span style={{ color: "var(--fg-3)", fontSize: "0.5em" }}> of 5</span>
          </p>
          <p className="display mt-1.5" style={{ fontSize: "clamp(1.35rem, 3.6dvh, 1.75rem)" }}>
            {match.title}
          </p>
          <p className="small muted mt-1.5" style={{ maxWidth: "30ch", marginInline: "auto", textWrap: "pretty" }}>
            {match.line}
          </p>
        </motion.div>

        <motion.div className="mt-4 grid grid-cols-2 gap-2" {...fade(0.25)}>
          {[
            { who: "You", a: me },
            { who: "Your friend", a: them },
          ].map(({ who, a }) => (
            <div key={who} className="panel" style={{ padding: "0.65rem 0.75rem", marginTop: 0 }}>
              <p className="tiny faint">{who}</p>
              <div className="flex items-center gap-2 mt-1">
                <MotifMark motif={a.motif} size={22} stroke="var(--accent-2)" dot="var(--accent)" />
                <p className="small font-semibold" style={{ lineHeight: 1.2 }}>
                  {a.name.replace(/^The /, "")}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.ul className="mt-3 grid gap-1" {...fade(0.4)} aria-label="Your five, side by side">
          <li className="flex items-center gap-2 tiny faint" style={{ padding: "0 0.25rem" }}>
            <span style={{ flex: 1 }}>Situation</span>
            <span style={{ width: "2.1rem", textAlign: "center" }}>You</span>
            <span style={{ width: "2.1rem", textAlign: "center" }}>Them</span>
          </li>
          {rows.map((r) => {
            const same = r.mine.id === r.theirs.id;
            return (
              <li key={r.title} className="flex items-center gap-2 small" style={{ padding: "0.35rem 0.25rem", borderTop: "1px solid var(--line)" }}>
                <span style={{ flex: 1, lineHeight: 1.25 }} className={same ? "" : "muted"}>
                  {same ? <Check size={13} className="accent inline mr-1" aria-label="Matched" /> : null}
                  {r.title}
                </span>
                <span className="tabular font-semibold" style={{ width: "2.1rem", textAlign: "center" }}>
                  {r.mine.id.toUpperCase()}
                </span>
                <span className="tabular font-semibold" style={{ width: "2.1rem", textAlign: "center", color: same ? "var(--fg)" : "var(--accent)" }}>
                  {r.theirs.id.toUpperCase()}
                </span>
              </li>
            );
          })}
        </motion.ul>
      </div>

      {toast || share.toast ? (
        <div className="toast" role="status" aria-live="polite">
          {toast || share.toast}
        </div>
      ) : null}

      <Sheet open={mine} onClose={() => setMine(false)} title="Your aura" theme="ink">
        <div className="grid gap-4">
          <div style={{ width: "min(100%, 300px)", marginInline: "auto" }}>
            <AuraCard archetype={me} />
          </div>
          <p className="muted" style={{ textWrap: "pretty" }}>
            {me.description}
          </p>
          <button type="button" className="btn btn-accent btn-block" onClick={share.shareImage} disabled={share.busy}>
            {share.busy ? "Making your card…" : "Share your aura card"}
          </button>
        </div>
      </Sheet>
    </GameShell>
  );
}
