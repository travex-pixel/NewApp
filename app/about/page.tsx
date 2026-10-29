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
    <div className="grain relative min-h-dvh">
      <div className="page flex flex-col" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
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
              Instinct is a game about the moments where the right move isn&rsquo;t obvious. A joke at your expense. An auntie with a
              question. A group chat that&rsquo;s missing someone. You get four ways to respond, you pick one, and you see what it
              probably gets you and what it costs. After five, you get your social aura.
            </p>
            <p>
              <span className="font-semibold" style={{ color: "var(--fg)" }}>
                The verdicts are opinions.
              </span>{" "}
              They&rsquo;re written by people who&rsquo;ve been in those rooms. Tap &ldquo;See how the other answers play out&rdquo; and
              you&rsquo;ll see that every option has an upside. Real life rarely has one right answer and we don&rsquo;t pretend it does.
            </p>
            <p>
              <span className="font-semibold" style={{ color: "var(--fg)" }}>
                How the aura works.
              </span>{" "}
              Every answer nudges six instincts: directness, diplomacy, boldness, empathy, boundaries and dodging. The one or two that
              stand out pick your aura, out of {ARCHETYPE_IDS.length}. Play another five and you might get a different one. It describes
              a round, not you.
            </p>
            <p>
              <span className="font-semibold" style={{ color: "var(--fg)" }}>
                Do you get better?
              </span>{" "}
              Nobody&rsquo;s keeping score on whether you&rsquo;re &ldquo;right&rdquo;. What changes is your range. After each round you
              get one thing to try next time, and the collection shows which auras you&rsquo;ve found and which you haven&rsquo;t. The
              more of them you can reach on purpose, the more ways you&rsquo;ve got to handle a tricky moment.
            </p>
            <p>
              <span className="font-semibold" style={{ color: "var(--fg)" }}>
                The psychology.
              </span>{" "}
              Where there&rsquo;s solid research behind a situation, the reveal says &ldquo;Behind it&rdquo; and shows the finding in
              plain English, with who found it, so you can look it up. We only include findings that have held up. If the evidence is
              shaky, it&rsquo;s not in the game.
            </p>
            <p>
              <span className="font-semibold" style={{ color: "var(--fg)" }}>
                What we keep.
              </span>{" "}
              Your answers stay in this browser on this phone. No accounts. Challenge links carry the situation and the sender&rsquo;s
              answer inside the link itself. We count anonymous things, like which situations get played and where people stop, to make
              the game better.
            </p>
            <p>
              <span className="font-semibold" style={{ color: "var(--fg)" }}>
                Today&rsquo;s five.
              </span>{" "}
              A new five every day at midnight Sydney time, the same five for everyone, so you can compare with friends. After that, play another five from the {SCENARIOS.length} situations written
              so far.
            </p>
          </div>
          <div className="mt-10 grid gap-3" style={{ maxWidth: "24rem" }}>
            <Link href="/play" className="btn btn-block">
              Play today&rsquo;s 5
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
