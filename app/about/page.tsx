import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { SCENARIOS } from "@/lib/content";
import { ARCHETYPE_IDS } from "@/lib/game/archetypes";

export const metadata: Metadata = {
  title: "About",
  description: "What Instinct is, what it isn't, and what it keeps.",
};

export default function AboutPage() {
  return (
    <div className="page min-h-dvh flex flex-col" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
      <header className="flex items-center justify-between py-3">
        <Wordmark />
        <Link href="/play" className="small muted">
          Play
        </Link>
      </header>
      <main className="pt-10 pb-16" style={{ maxWidth: "60ch" }}>
        <h1 className="display" style={{ fontSize: "clamp(2.25rem, 9vw, 3.25rem)" }}>
          A game, not a verdict.
        </h1>
        <div className="mt-8 grid gap-5 muted">
          <p>
            Instinct is a social judgement game. You get an everyday situation, a joke at your expense, an auntie with a question,
            a group chat that&rsquo;s missing someone, and four ways to respond. Pick one, see what it probably gets you and what it
            costs, and after five you get a social aura: an affectionate read of the pattern in your choices.
          </p>
          <p>
            <span className="font-semibold" style={{ color: "var(--fg)" }}>The verdicts are opinions.</span> They&rsquo;re written by
            people who&rsquo;ve been in those rooms, and the drawer under each one shows why the other paths can work too. Nothing
            here has one universally correct answer, and we don&rsquo;t pretend otherwise.
          </p>
          <p>
            <span className="font-semibold" style={{ color: "var(--fg)" }}>The aura is a pattern, not a personality test.</span>{" "}
            Five answers nudge six simple dials: directness, diplomacy, risk, empathy, boundaries and avoidance. The shape of those
            dials picks one of {ARCHETYPE_IDS.length} archetypes. Play another five and you may get a different one. That&rsquo;s the
            point: it describes a round, not you.
          </p>
          <p>
            <span className="font-semibold" style={{ color: "var(--fg)" }}>What we keep.</span> Your answers stay in this browser, on
            this device, and nowhere else. No accounts. Challenge links carry the situation and the sender&rsquo;s answer inside the
            link itself. We record anonymous usage events (which situations get played, where people stop) to improve the game.
          </p>
          <p>
            <span className="font-semibold" style={{ color: "var(--fg)" }}>Today&rsquo;s five.</span> Everyone gets the same five each
            day, changing at midnight UTC. After that, play another five from the {SCENARIOS.length} situations written so far.
          </p>
        </div>
        <div className="mt-10 grid gap-3" style={{ maxWidth: "24rem" }}>
          <Link href="/play" className="btn btn-block">
            Play today&rsquo;s 5
          </Link>
        </div>
      </main>
    </div>
  );
}
