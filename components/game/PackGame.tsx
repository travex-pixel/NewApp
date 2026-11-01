"use client";

import { useEffect } from "react";
import { getPack, packSet } from "@/lib/content/packs";
import { sydneyDateKey } from "@/lib/game/engine";
import { readProgress, useHydrated } from "@/lib/game/progress-store";
import { trackOnce } from "@/lib/analytics";
import { Game } from "./Game";
import { GameHeader } from "./GameHeader";

/** Five situations from one pack, unplayed ones first. */
export function PackGame({ packId }: { packId: string }) {
  const hydrated = useHydrated();
  const pack = getPack(packId);

  useEffect(() => {
    if (pack) trackOnce(`pack:${pack.id}`, "pack_started", { pack_id: pack.id });
  }, [pack]);

  if (!hydrated || !pack) {
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
  const played = new Set(readProgress().plays.map((p) => p.scenarioId));
  return (
    <Game
      key={`pack-${pack.id}`}
      mode="pack"
      dateKey={dateKey}
      round={packSet(pack, dateKey, 0, played)}
      roundIndex={0}
      nextRound={(i, seen) => packSet(pack, dateKey, i, seen)}
      headRight={undefined}
    />
  );
}
