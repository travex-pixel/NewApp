"use client";

import { nextSet, playedTodaysFive, roundsToday, setFromIds, sydneyDateKey, todaysSet } from "@/lib/game/engine";
import { useEffect, useState } from "react";
import { readProgress, useHydrated } from "@/lib/game/progress-store";
import { loadSession } from "@/lib/game/session-store";
import { Game } from "./Game";
import { GameHeader } from "./GameHeader";

/**
 * Today's five is picked by the date in Sydney, so everyone gets the same five
 * and it resets at 12am Sydney time. It's chosen in the browser at the moment
 * of play. A refresh mid-round restores that round. Once today's five is
 * done on this device, coming back starts a fresh five instead of repeating it.
 */
/** Set after the game first shows in this page load. Later visits to /play are in-app navigations, not refreshes. */
let shownInThisLoad = false;

export function PlayGame() {
  const hydrated = useHydrated();
  // Captured on first mount: true only for the first game shown in this page load.
  const [firstInLoad] = useState(() => !shownInThisLoad);
  useEffect(() => {
    shownInThisLoad = true;
  }, []);

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

  const dateKey = sydneyDateKey();
  const session = loadSession();
  // A finished round comes back only on a refresh. Choosing to play again
  // (a link or a new visit) starts something new.
  const keep = session && session.dateKey === dateKey && (!session.finished || (firstInLoad && wasReload()));
  if (session && keep) {
    const restored = setFromIds(session.roundIds);
    if (restored) return <Game key="resume" mode="round" dateKey={dateKey} round={restored} resume={session} />;
  }

  const progress = readProgress();
  if (playedTodaysFive(progress.results, dateKey)) {
    const n = Math.max(1, roundsToday(progress.results, dateKey));
    const played = new Set(progress.plays.map((p) => p.scenarioId));
    return <Game key={`more-${dateKey}-${n}`} mode="round" dateKey={dateKey} round={nextSet(dateKey, n, played)} roundIndex={n} />;
  }
  return <Game key={`fresh-${dateKey}`} mode="round" dateKey={dateKey} round={todaysSet(dateKey)} roundIndex={0} />;
}

function wasReload(): boolean {
  try {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    return nav?.type === "reload";
  } catch {
    return false;
  }
}
