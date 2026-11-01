import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { Game } from "@/components/game/Game";
import { Wordmark } from "@/components/Wordmark";
import { ForkMark } from "@/components/ForkMark";
import { DuelBeacon } from "@/components/DuelBeacon";
import { decodeDuel } from "@/lib/game/duel";
import { SITE_NAME } from "@/lib/site";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const duel = decodeDuel(code);
  if (!duel) return { title: "This link isn't valid", robots: { index: false } };
  const title = "Do you think alike? Play my five";
  return {
    title,
    description: "Your friend played five everyday situations. Play the same five and see how your instincts compare.",
    robots: { index: false },
    openGraph: { title: `${title} · ${SITE_NAME}`, description: "Play the same five and see how you compare.", type: "website" },
  };
}

async function DuelLoader({ params }: Props) {
  const { code } = await params;
  const duel = decodeDuel(code);

  if (!duel) {
    return (
      <div className="page min-h-dvh flex flex-col" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
        <DuelBeacon valid={false} />
        <header className="flex items-center justify-between py-3">
          <Wordmark />
        </header>
        <main className="pt-12">
          <ForkMark size={36} className="olive" />
          <h1 className="display mt-5" style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}>
            That link doesn&rsquo;t work.
          </h1>
          <p className="mt-4 muted" style={{ maxWidth: "46ch" }}>
            It might have been cut off when it was pasted. Ask your friend to send it again, or play today&rsquo;s five yourself.
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

  return (
    <>
      <DuelBeacon valid />
      <Game mode="duel" round={duel.round} friendChoices={duel.choices} />
    </>
  );
}

export default function DuelPage(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="shell grain" aria-busy="true">
          <header className="shell-head">
            <Wordmark />
          </header>
          <div className="shell-main" />
          <div />
        </div>
      }
    >
      <DuelLoader params={props.params} />
    </Suspense>
  );
}
