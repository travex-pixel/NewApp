import Link from "next/link";
import { FIRST_ROUND, SCENARIOS, getScenario } from "@/lib/content";
import { Wordmark } from "@/components/Wordmark";
import { LandingBeacon } from "@/components/LandingBeacon";
import { ForkMark } from "@/components/ForkMark";

export default function Home() {
  const first = getScenario(FIRST_ROUND[0])!;

  return (
    <div className="page flex-1 flex flex-col" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
      <LandingBeacon />
      <header className="flex items-center justify-between py-3">
        <Wordmark />
        <Link href="/daily" className="small" style={{ color: "var(--fg-2)" }}>
          Today&rsquo;s situation
        </Link>
      </header>

      <main className="pt-10 pb-12 sm:pt-16">
        <h1 className="display" style={{ fontSize: "clamp(2.75rem, 11vw, 4.75rem)" }}>
          Think you read people well?
        </h1>
        <p className="mt-5 serif" style={{ fontSize: "1.25rem", lineHeight: 1.4, color: "var(--fg-2)", maxWidth: "30ch", textWrap: "pretty" }}>
          Real situations. Hard choices. Find out what your instincts miss.
        </p>

        <div className="mt-8 grid gap-3" style={{ maxWidth: "26rem" }}>
          <Link href="/play" className="btn btn-block" prefetch>
            Test your instincts <span aria-hidden="true">→</span>
          </Link>
          <p className="small" style={{ color: "var(--fg-3)" }}>
            No sign-up. Five situations. About three minutes.
          </p>
        </div>

        {/* The first situation is right here, so the game is visible before you start. */}
        <section className="mt-14" aria-label="The first situation">
          <hr className="rule" />
          <p className="small mt-4" style={{ color: "var(--fg-2)" }}>
            Situation one
          </p>
          <div className="narrative mt-3 grid gap-3" style={{ maxWidth: "34rem" }}>
            <p>{first.setup[0]}</p>
            <p>{first.setup[1]}</p>
          </div>
          <p className="mt-4 font-semibold">{first.prompt}</p>
          <Link href="/play" className="textlink mt-2 inline-block" prefetch>
            Answer it
          </Link>
        </section>

        <section className="mt-14" aria-labelledby="how-heading">
          <hr className="rule" />
          <h2 id="how-heading" className="serif mt-5" style={{ fontSize: "1.375rem", fontWeight: 500 }}>
            How it works
          </h2>
          <ol className="mt-4 grid gap-3" style={{ maxWidth: "56ch", color: "var(--fg-2)" }}>
            <li className="flex gap-3"><span className="tabular font-semibold" style={{ color: "var(--fg)" }}>1</span><span>You get a situation you&rsquo;ve probably been in. Four ways to respond, all of them plausible.</span></li>
            <li className="flex gap-3"><span className="tabular font-semibold" style={{ color: "var(--fg)" }}>2</span><span>Pick one. See what it likely gets you, what it costs, and the one idea worth keeping.</span></li>
            <li className="flex gap-3"><span className="tabular font-semibold" style={{ color: "var(--fg)" }}>3</span><span>Send the one that got you to a friend. Their answer stays hidden until yours is in.</span></li>
          </ol>
          <p className="small mt-5" style={{ color: "var(--fg-3)", maxWidth: "56ch" }}>
            {SCENARIOS.length} situations, written by people, no AI at the table. Nothing here measures who you are;
            it&rsquo;s practice. Progress stays on this device.{" "}
            <Link href="/about">More about that</Link>.
          </p>
        </section>
      </main>

      <footer className="mt-auto py-6 flex items-center justify-between small" style={{ color: "var(--fg-3)" }}>
        <span className="inline-flex items-center gap-1.5"><ForkMark size={14} /> Instinct</span>
        <Link href="/about">About</Link>
      </footer>
    </div>
  );
}
