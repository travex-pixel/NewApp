"use client";

import { useHydrated } from "@/lib/game/progress-store";
import { loadSession } from "@/lib/game/session-store";
import { Game } from "./Game";

/**
 * The server renders the first scenario so it's in the HTML immediately.
 * After hydration, if this tab has a round in progress (a refresh), the game
 * remounts with that round restored.
 */
export function PlayGame() {
  const hydrated = useHydrated();
  const session = hydrated ? loadSession() : null;
  if (session) return <Game key="resume" mode="round" resume={session} />;
  return <Game key="fresh" mode="round" />;
}
