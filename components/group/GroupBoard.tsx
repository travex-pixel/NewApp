"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ListChecks, RefreshCw, Send } from "lucide-react";
import type { Board } from "@/lib/group";
import { GameHeader } from "@/components/game/GameHeader";
import { GameShell } from "@/components/game/GameShell";
import { MotifMark } from "@/components/game/MotifMark";
import { Sheet } from "@/components/game/Sheet";

const EASE = [0.16, 1, 0.3, 1] as const;

/** The group's shared result: everyone's aura, the closest pair and the wildcard. */
export function GroupBoard({
  board,
  host,
  meId,
  onInvite,
  onRefresh,
  refreshing,
  toast,
}: {
  board: Board;
  host: string;
  meId?: string;
  onInvite: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  toast?: string | null;
}) {
  const reduce = useReducedMotion();
  const [splitOpen, setSplitOpen] = useState(false);
  const n = board.members.length;
  const fade = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay, ease: EASE } };

  return (
    <GameShell
      theme="ink"
      head={<GameHeader right={<span className="small muted">{host}&rsquo;s group</span>} />}
      foot={
        <>
          <button type="button" className="btn btn-accent btn-block" onClick={onInvite}>
            <Send size={18} aria-hidden="true" /> Invite the group chat
          </button>
          <div className={n >= 2 ? "grid grid-cols-2 gap-2" : "grid"}>
            {n >= 2 ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSplitOpen(true)}>
                <ListChecks size={16} aria-hidden="true" /> How we split
              </button>
            ) : null}
            <button type="button" className="btn btn-ghost btn-sm" onClick={onRefresh} disabled={refreshing}>
              <RefreshCw size={16} aria-hidden="true" /> {refreshing ? "Checking…" : "Refresh"}
            </button>
          </div>
        </>
      }
      aria-label="Your group"
    >
      <div className="py-2">
        <motion.div {...fade(0)}>
          <h1 className="display" style={{ fontSize: "clamp(1.6rem, 4.4dvh, 2.1rem)" }}>
            Who&rsquo;s who
          </h1>
          <p className="small muted mt-1">
            {n === 1 ? "Just you so far. Send the link to the group chat." : `${n} people have played the same five.`}
          </p>
        </motion.div>

        {board.closest || board.wildcard ? (
          <motion.div className="mt-3 grid grid-cols-2 gap-2" {...fade(0.1)}>
            {board.closest ? (
              <div className="panel" style={{ marginTop: 0 }}>
                <p className="label">Most alike</p>
                <p className="small font-semibold mt-1" style={{ lineHeight: 1.25 }}>
                  {board.closest.a.name} &amp; {board.closest.b.name}
                </p>
                <p className="tiny faint mt-0.5">{board.closest.matches} of 5 the same</p>
              </div>
            ) : null}
            {board.wildcard ? (
              <div className="panel" style={{ marginTop: 0 }}>
                <p className="label" style={{ color: "var(--accent)" }}>
                  The wildcard
                </p>
                <p className="small font-semibold mt-1">{board.wildcard.name}</p>
                <p className="tiny faint mt-0.5">Least like everyone else</p>
              </div>
            ) : null}
          </motion.div>
        ) : null}

        <motion.ul className="mt-3 grid gap-1.5" {...fade(0.2)} aria-label="Everyone's aura">
          {board.members.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3"
              style={{
                padding: "0.55rem 0.7rem",
                borderRadius: "var(--r-sm)",
                background: m.id === meId ? "var(--surface)" : "transparent",
                border: "1px solid var(--line)",
              }}
            >
              <MotifMark motif={m.archetype.motif} size={24} stroke="var(--accent-2)" dot="var(--accent)" />
              <span className="font-semibold" style={{ minWidth: "4.5rem" }}>
                {m.name}
                {m.id === meId ? <span className="tiny faint"> (you)</span> : null}
              </span>
              <span className="small muted" style={{ marginLeft: "auto", textAlign: "right" }}>
                {m.archetype.name.replace(/^The /, "")}
              </span>
            </li>
          ))}
        </motion.ul>

      </div>

      <Sheet open={splitOpen} onClose={() => setSplitOpen(false)} title="How the group split" theme="ink">
        <ul className="grid gap-1">
          {board.splits.map((s) => (
            <li key={s.title} className="flex items-center gap-2" style={{ padding: "0.5rem 0", borderTop: "1px solid var(--line)" }}>
              <span style={{ flex: 1 }} className="muted">
                {s.title}
              </span>
              <span className="tabular">
                <span className="font-semibold">{s.top.toUpperCase()}</span> {s.count} of {s.of}
              </span>
            </li>
          ))}
        </ul>
        <p className="small faint mt-3">The most picked answer for each situation, and how many of you picked it.</p>
      </Sheet>

      {toast ? (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}
    </GameShell>
  );
}
