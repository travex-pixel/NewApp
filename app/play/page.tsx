import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { PlayGame } from "@/components/game/PlayGame";
import { Wordmark } from "@/components/Wordmark";
import { todaysSet, utcDateKey } from "@/lib/game/engine";

export const metadata: Metadata = {
  title: "Today's 5",
  description: "Five situations. Your gut instinct. About a minute.",
};

async function Today() {
  // Today's five depends on the date, so this part renders at request time.
  await connection();
  const dateKey = utcDateKey();
  const ids = todaysSet(dateKey).map((s) => s.id);
  return <PlayGame dateKey={dateKey} roundIds={ids} />;
}

function Shell() {
  return (
    <div className="shell" aria-busy="true">
      <header className="shell-head">
        <Wordmark />
      </header>
      <div className="shell-main" />
      <div />
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<Shell />}>
      <Today />
    </Suspense>
  );
}
