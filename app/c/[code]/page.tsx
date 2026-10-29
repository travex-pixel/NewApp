import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Game } from "@/components/Game";
import { Wordmark } from "@/components/Wordmark";
import { ForkMark } from "@/components/ForkMark";
import { ChallengeBeacon } from "@/components/ChallengeBeacon";
import { decodeChallenge } from "@/lib/game/challenge";
import { SITE_NAME } from "@/lib/site";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const challenge = decodeChallenge(code);
  if (!challenge) {
    return {
      title: "This challenge link isn't valid",
      description: "The link may have been mistyped. You can still play.",
      robots: { index: false },
    };
  }
  const title = `What would you do? “${challenge.scenario.title}”`;
  return {
    title,
    description: "Someone sent you a situation. Their answer is hidden until you've given yours.",
    robots: { index: false },
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      description: "Someone sent you a situation. Their answer is hidden until you've given yours.",
      type: "website",
    },
  };
}

async function ChallengeLoader({ params }: Props) {
  const { code } = await params;
  const challenge = decodeChallenge(code);

  if (!challenge) {
    return (
      <div className="page flex-1 flex flex-col" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
        <ChallengeBeacon scenarioId="invalid" valid={false} />
        <header className="flex items-center justify-between py-3">
          <Wordmark />
        </header>
        <main className="pt-12">
          <ForkMark size={36} />
          <h1 className="display mt-5" style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}>
            That link doesn&rsquo;t go anywhere.
          </h1>
          <p className="mt-4" style={{ color: "var(--fg-2)", maxWidth: "48ch" }}>
            Challenge links look like <code className="tabular">/c/xxxx</code>. This one may have been cut off or mistyped
            when it was pasted. The situation it pointed to is still in the game.
          </p>
          <div className="mt-8 grid gap-3" style={{ maxWidth: "26rem" }}>
            <Link href="/play" className="btn btn-block">Play a round instead</Link>
            <Link href="/" className="btn btn-ghost btn-block">Start from the beginning</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <ChallengeBeacon scenarioId={challenge.scenario.id} valid />
      <Game mode="challenge" scenario={challenge.scenario} challengerChoice={challenge.choiceId} />
    </>
  );
}

export default function ChallengePage(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="page flex-1" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
          <header className="flex items-center justify-between py-3">
            <Wordmark />
            <span className="small" style={{ color: "var(--fg-2)" }}>A challenge</span>
          </header>
          <p className="small mt-6" style={{ color: "var(--fg-3)" }}>Opening the situation…</p>
        </div>
      }
    >
      <ChallengeLoader params={props.params} />
    </Suspense>
  );
}
