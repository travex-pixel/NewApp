import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { ArrowRight } from "lucide-react";
import { Game } from "@/components/game/Game";
import { Wordmark } from "@/components/Wordmark";
import { ForkMark } from "@/components/ForkMark";
import { ChallengeBeacon } from "@/components/ChallengeBeacon";
import { ShareButton } from "@/components/ShareButton";
import { decodeChallenge } from "@/lib/game/challenge";
import { utcDateKey } from "@/lib/game/engine";
import { SITE_NAME } from "@/lib/site";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const challenge = decodeChallenge(code);
  if (!challenge) {
    return { title: "This link isn't valid", description: "The link may have been mistyped. The game is still here.", robots: { index: false } };
  }
  const title = `What would you do? “${challenge.scenario.title}”`;
  return {
    title,
    description: "Someone sent you a situation. Their answer is hidden until you've given yours.",
    robots: { index: false },
    openGraph: { title: `${title} · ${SITE_NAME}`, description: "Their answer is hidden until you've given yours.", type: "website" },
  };
}

async function ChallengeLoader({ params }: Props) {
  const { code } = await params;
  const challenge = decodeChallenge(code);

  if (!challenge) {
    return (
      <div className="page min-h-dvh flex flex-col" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
        <ChallengeBeacon scenarioId="invalid" valid={false} />
        <header className="flex items-center justify-between py-3">
          <Wordmark />
        </header>
        <main className="pt-12">
          <ForkMark size={36} className="olive" />
          <h1 className="display mt-5" style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}>
            That link doesn&rsquo;t go anywhere.
          </h1>
          <p className="mt-4 muted" style={{ maxWidth: "46ch" }}>
            Challenge links look like <code className="tabular">/c/xxxx</code>. This one may have been cut off when it was pasted. The
            situation it pointed to is still in the game.
          </p>
          <div className="mt-8 grid gap-3" style={{ maxWidth: "24rem" }}>
            <Link href="/play" className="btn btn-block">
              Play today&rsquo;s 5 <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  await connection();
  const dateKey = utcDateKey();
  return (
    <>
      <ChallengeBeacon scenarioId={challenge.scenario.id} valid />
      <Game
        mode="challenge"
        dateKey={dateKey}
        round={[challenge.scenario]}
        challengerChoice={challenge.choiceId}
        drawerFooter={
          <ShareButton scenarioId={challenge.scenario.id} choiceId={challenge.choiceId} label="Send this situation on" className="btn btn-ghost btn-sm" />
        }
      />
    </>
  );
}

export default function ChallengePage(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="shell" aria-busy="true">
          <header className="shell-head">
            <Wordmark />
            <span className="small muted">A challenge</span>
          </header>
          <div className="shell-main" />
          <div />
        </div>
      }
    >
      <ChallengeLoader params={props.params} />
    </Suspense>
  );
}
