import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { ArrowRight } from "lucide-react";
import { Wordmark } from "@/components/Wordmark";
import { ForkMark } from "@/components/ForkMark";
import { LandingBeacon } from "@/components/LandingBeacon";
import { formatDayLabel, utcDateKey } from "@/lib/game/engine";
import { SCENARIOS } from "@/lib/content";

async function TodayLabel() {
  await connection();
  return <>{formatDayLabel(utcDateKey())}</>;
}

export default function Home() {
  return (
    <div className="page min-h-dvh flex flex-col" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
      <LandingBeacon />
      <header className="flex items-center justify-between py-3">
        <Wordmark />
        <Link href="/about" className="small muted">
          About
        </Link>
      </header>

      <main className="flex-1 flex flex-col justify-center py-10">
        <ForkMark size={40} className="olive" />
        <h1 className="display mt-5" style={{ fontSize: "clamp(2.75rem, 11.5vw, 4.5rem)", fontWeight: 500 }}>
          Think you read people well?
        </h1>
        <p className="serif mt-4" style={{ fontSize: "1.25rem", lineHeight: 1.4, color: "var(--fg-2)", maxWidth: "28ch", textWrap: "pretty" }}>
          Five situations. Your gut instinct. Let&rsquo;s see what it says about you.
        </p>

        <div className="mt-8 grid gap-3" style={{ maxWidth: "24rem" }}>
          <Link href="/play" className="btn btn-block" prefetch>
            Play today&rsquo;s 5 <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <p className="small faint">
            About a minute. No overthinking. No sign-up.
          </p>
        </div>

        <p className="small mt-10 muted">
          <span className="olive font-semibold">Today&rsquo;s five</span> ·{" "}
          <Suspense fallback={<span aria-hidden="true">&nbsp;</span>}>
            <TodayLabel />
          </Suspense>
          . Same five for everyone, new set at midnight UTC.
        </p>
      </main>

      <footer className="py-6 flex items-center justify-between small faint">
        <span>{SCENARIOS.length} situations, written by people.</span>
        <span>Progress stays on this device.</span>
      </footer>
    </div>
  );
}
