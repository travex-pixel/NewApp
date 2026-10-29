"use client";

import { motion, useReducedMotion } from "motion/react";
import { formatDayLabel, sydneyDateKey, todaysSet } from "@/lib/game/engine";
import { useHydrated, useProgress } from "@/lib/game/progress-store";
import { ARCHETYPE_IDS } from "@/lib/game/archetypes";

/** What's in today's five, and how many auras this player has found. */
export function TodayTeaser() {
  const hydrated = useHydrated();
  const progress = useProgress();
  const reduce = useReducedMotion();

  if (!hydrated) return <div style={{ minHeight: 76 }} aria-hidden="true" />;

  const key = sydneyDateKey();
  const set = todaysSet(key);
  const found = new Set(progress.results.map((r) => r.archetypeId)).size;
  const playedToday = progress.results.some((r) => r.dateKey === key);

  return (
    <motion.div
      style={{ minHeight: 76 }}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="small muted">
        <span className="olive font-semibold">{formatDayLabel(key)}</span>
        {playedToday ? " · done today, play another 5 any time" : " · a new five at midnight, Sydney time"}
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Today's situations">
        {set.map((s) => (
          <li key={s.id} className="chip">
            {s.category}
          </li>
        ))}
      </ul>
      {found > 0 ? (
        <p className="small faint mt-2">
          You&rsquo;ve found {found} of {ARCHETYPE_IDS.length} auras.
        </p>
      ) : null}
    </motion.div>
  );
}
