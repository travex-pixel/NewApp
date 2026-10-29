import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { SCENARIOS } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "What Instinct is, what it isn't, and what it keeps.",
};

export default function AboutPage() {
  return (
    <div className="page flex-1 flex flex-col" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
      <header className="flex items-center justify-between py-3">
        <Wordmark />
        <Link href="/play" className="small" style={{ color: "var(--fg-2)" }}>Play</Link>
      </header>
      <main className="pt-10 pb-16" style={{ maxWidth: "62ch" }}>
        <h1 className="display" style={{ fontSize: "clamp(2.25rem, 9vw, 3.5rem)" }}>
          Practice, not a verdict.
        </h1>

        <div className="mt-8 grid gap-5" style={{ color: "var(--fg-2)" }}>
          <p>
            Instinct is a game about the moments where a good response isn&rsquo;t obvious: a joke at your
            expense, a boundary someone pushes on, a deadline that may be invented. You choose, you see what
            the choice probably gets you and what it costs, and you leave with one idea you can actually use.
          </p>
          <p>
            <span className="runin">What the scores mean.</span> A &ldquo;strong read&rdquo; is the response
            that, in our judgement, gets the most of what you want at the least cost to the relationship. It is a
            judgement, written by people, and we say so when another path is also fair. The score measures how
            you played this round, inside the game&rsquo;s own rules. It is not a measurement of you, your
            empathy, or your intelligence, and we&rsquo;d be suspicious of anything that claimed to be.
          </p>
          <p>
            <span className="runin">No invented science.</span> The principles are practical, not clinical:
            separate impact from intention, ask before you anchor, correct in private. Where a situation
            genuinely depends on things you can&rsquo;t know, the reveal says that too.
          </p>
          <p>
            <span className="runin">What we keep.</span> Your answers and XP are stored in this browser, on this
            device, and nowhere else. There are no accounts. If you clear your browser data, it&rsquo;s gone. Challenge
            links carry the situation and the sender&rsquo;s answer inside the link itself, so nothing about you is
            stored on a server to make them work. We record anonymous usage events (which situations get played,
            where people stop) to improve the game.
          </p>
          <p>
            <span className="runin">Today&rsquo;s situation.</span> Everyone gets the same one each day. It changes
            at midnight UTC, so your local reset time depends on where you are.
          </p>
          <p>
            There are {SCENARIOS.length} situations so far. More are being written.
          </p>
        </div>

        <div className="mt-10 grid gap-3" style={{ maxWidth: "26rem" }}>
          <Link href="/play" className="btn btn-block">Play a round</Link>
        </div>
      </main>
    </div>
  );
}
