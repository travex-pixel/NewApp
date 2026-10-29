import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Wordmark } from "@/components/Wordmark";
import { HeroMark } from "@/components/HeroMark";
import { LandingBeacon } from "@/components/LandingBeacon";
import { SoundToggle } from "@/components/SoundToggle";
import { TodayTeaser } from "@/components/TodayTeaser";
import { SCENARIOS } from "@/lib/content";
import { ARCHETYPE_IDS } from "@/lib/game/archetypes";

export default function Home() {
  return (
    <div className="grain relative min-h-dvh flex flex-col">
      <div className="page flex-1 flex flex-col" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
        <LandingBeacon />
        <header className="flex items-center justify-between py-3">
          <Wordmark />
          <div className="flex items-center gap-3">
            <Link href="/about" className="small muted">
              About
            </Link>
            <SoundToggle />
          </div>
        </header>

        <main className="flex-1 flex flex-col justify-center py-8">
          <HeroMark />
          <h1 className="display mt-5 enter" style={{ fontSize: "clamp(2.75rem, 11.5vw, 4.5rem)", fontWeight: 500 }}>
            Think you read people well?
          </h1>
          <p
            className="serif mt-4 enter"
            style={{ fontSize: "1.25rem", lineHeight: 1.4, color: "var(--fg-2)", maxWidth: "28ch", textWrap: "pretty", animationDelay: "120ms" }}
          >
            Five situations. Your gut instinct. Let&rsquo;s see what it says about you.
          </p>

          <div className="mt-8 grid gap-3 enter" style={{ maxWidth: "24rem", animationDelay: "220ms" }}>
            <Link href="/play" className="btn btn-block" prefetch>
              Play today&rsquo;s 5 <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <p className="small faint">About a minute. No overthinking. No sign-up.</p>
          </div>

          <div className="mt-9">
            <TodayTeaser />
          </div>
        </main>

        <footer className="py-6 small faint">
          {SCENARIOS.length} situations · {ARCHETYPE_IDS.length} auras to find · saved on this phone only
        </footer>
      </div>
    </div>
  );
}
