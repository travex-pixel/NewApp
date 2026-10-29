"use client";

import { setFromIds } from "@/lib/game/engine";
import { useHydrated } from "@/lib/game/progress-store";
import { loadSession } from "@/lib/game/session-store";
import { Game } from "./Game";

/**
 * The server provides today's five so the first situation is in the HTML.
 * After hydration, if this tab has a round from today in progress (a
 * refresh), the game remounts with that round restored. A round from a
 * previous day is discarded: today's five is today's five.
 */
export function PlayGame({ dateKey, roundIds }: { dateKey: string; roundIds: string[] }) {
  const hydrated = useHydrated();
  const today = setFromIds(roundIds) ?? [];

  if (hydrated) {
    const session = loadSession();
    if (session && session.dateKey === dateKey) {
      const restored = setFromIds(session.roundIds);
      if (restored) return <Game key="resume" mode="round" dateKey={dateKey} round={restored} resume={session} />;
    }
  }
  return <Game key="fresh" mode="round" dateKey={dateKey} round={today} roundIndex={0} />;
}
