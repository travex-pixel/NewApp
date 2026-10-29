"use client";

import { dailyScenario, formatDailyDate, utcDateKey } from "@/lib/game/daily";
import { useHydrated, useProgress } from "@/lib/game/progress-store";
import { Game } from "./Game";
import { Wordmark } from "./Wordmark";

/**
 * The daily scenario depends on the date, so it's resolved on the device.
 * The server ships a static shell; the scenario appears on hydration.
 */
export function DailyGame() {
  const hydrated = useHydrated();
  const progress = useProgress();

  if (!hydrated) {
    return (
      <div className="page flex-1" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
        <header className="flex items-center justify-between py-3">
          <Wordmark />
          <span className="small" style={{ color: "var(--fg-2)" }}>Today</span>
        </header>
        <p className="small mt-6" style={{ color: "var(--fg-3)" }} aria-live="polite">
          Finding today&rsquo;s situation…
        </p>
      </div>
    );
  }

  const dateKey = utcDateKey();
  const scenario = dailyScenario(dateKey);
  const priorRecord = progress.dailiesDone.includes(dateKey)
    ? [...progress.plays].reverse().find((r) => r.scenarioId === scenario.id)
    : undefined;

  return (
    <Game
      key={dateKey}
      mode="daily"
      scenario={scenario}
      dateKey={dateKey}
      dateLabel={formatDailyDate(dateKey)}
      priorRecord={priorRecord}
    />
  );
}
