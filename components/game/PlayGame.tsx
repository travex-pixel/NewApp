"use client";

import { localDateKey, setFromIds, todaysSet } from "@/lib/game/engine";
import { useHydrated } from "@/lib/game/progress-store";
import { loadSession } from "@/lib/game/session-store";
import { Game } from "./Game";
import { GameHeader } from "./GameHeader";

/**
 * Today's five depends on the player's own date, so it's chosen in the
 * browser. A refresh mid-round restores that round. A round from a previous
 * day is discarded: today's five is today's five.
 */
export function PlayGame() {
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="shell grain" aria-busy="true">
        <header className="shell-head">
          <GameHeader />
        </header>
        <div className="shell-main" />
        <div />
      </div>
    );
  }

  const dateKey = localDateKey();
  const session = loadSession();
  if (session && session.dateKey === dateKey) {
    const restored = setFromIds(session.roundIds);
    if (restored) return <Game key="resume" mode="round" dateKey={dateKey} round={restored} resume={session} />;
  }
  return <Game key={`fresh-${dateKey}`} mode="round" dateKey={dateKey} round={todaysSet(dateKey)} roundIndex={0} />;
}
