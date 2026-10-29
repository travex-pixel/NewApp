"use client";

import Link from "next/link";
import type { Choice } from "@/lib/content";
import { summariseRound, totalXp, type Milestone, type PlayRecord, type Progress } from "@/lib/game/engine";
import { ForkMark } from "./ForkMark";
import { ShareButton } from "./ShareButton";

export function RoundResult({
  records,
  progress,
  newMilestones,
  roundNumber,
  onPlayAgain,
  storageOk,
}: {
  records: PlayRecord[];
  progress: Progress;
  newMilestones: Milestone[];
  roundNumber: number;
  onPlayAgain: () => void;
  storageOk: boolean;
}) {
  const s = summariseRound(records);
  const hardestRecord = s.hardest ? records.find((r) => r.scenarioId === s.hardest!.id) : undefined;

  const headline =
    s.points === s.maxPoints
      ? "Clean round."
      : s.points >= s.maxPoints * 0.8
        ? "Sharp."
        : s.points >= s.maxPoints * 0.55
          ? "Mixed, like most people."
          : "A few of those bit.";

  return (
    <section aria-labelledby="result-heading">
      <p className="small" style={{ color: "var(--fg-2)" }}>
        Round {roundNumber}
      </p>
      <h2 id="result-heading" className="display mt-2" style={{ fontSize: "clamp(2.25rem, 9vw, 3.25rem)" }}>
        {headline}
      </h2>

      {/* The artefact: what you'd screenshot. */}
      <div className="artefact mt-6">
        <div className="flex items-baseline justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 serif" style={{ fontWeight: 600, fontSize: "1.05rem" }}>
            <ForkMark size={16} /> Instinct
          </span>
          <span className="small tabular" style={{ color: "var(--fg-2)" }}>
            Round {roundNumber}
          </span>
        </div>
        <p className="display mt-5 tabular" style={{ fontSize: "3.5rem", lineHeight: 1 }}>
          {s.points}
          <span style={{ color: "var(--fg-3)", fontSize: "1.75rem" }}> / {s.maxPoints}</span>
        </p>
        <p className="mt-2" style={{ color: "var(--fg-2)" }}>
          {s.strongReads} strong {s.strongReads === 1 ? "read" : "reads"} out of {records.length}.
          {s.strongest ? ` Strongest on ${s.strongest.toLowerCase()}.` : ""}
          {s.blindSpot ? ` Softest on ${s.blindSpot.toLowerCase()}.` : ""}
        </p>
        {s.hardest ? (
          <p className="mt-4 serif" style={{ fontStyle: "italic", fontSize: "1.125rem", textWrap: "pretty" }}>
            The one that got me: &ldquo;{s.hardest.title}&rdquo;
          </p>
        ) : null}
      </div>

      <dl className="mt-7">
        <div className="row">
          <dt style={{ color: "var(--fg-2)" }}>XP this round</dt>
          <dd className="tabular font-semibold">+{s.xp}</dd>
        </div>
        <div className="row">
          <dt style={{ color: "var(--fg-2)" }}>XP on this device</dt>
          <dd className="tabular font-semibold">{totalXp(progress)}</dd>
        </div>
        <div className="row">
          <dt style={{ color: "var(--fg-2)" }}>Situations played</dt>
          <dd className="tabular font-semibold">{progress.plays.length}</dd>
        </div>
      </dl>

      {newMilestones.length ? (
        <ul className="mt-5 grid gap-2" aria-label="New milestones">
          {newMilestones.map((m) => (
            <li key={m.id} className="flex items-baseline gap-3">
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>+</span>
              <span>
                <span className="font-semibold">{m.title}.</span>{" "}
                <span style={{ color: "var(--fg-2)" }}>{m.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="small mt-5" style={{ color: "var(--fg-3)" }}>
        A score here measures how you played this round, not who you are.
        {storageOk ? " Progress is saved on this device only." : " Progress couldn't be saved on this device."}
      </p>

      <div className="mt-8 grid gap-3">
        {s.hardest && hardestRecord ? (
          <ShareButton
            scenarioId={s.hardest.id}
            choiceId={hardestRecord.choiceId as Choice["id"]}
            challengeType="scenario"
            label={`Challenge a friend with “${s.hardest.title}”`}
            className="btn btn-accent btn-block"
            shareText="This one got me. Want to see what you'd do?"
          />
        ) : null}
        <button type="button" className="btn btn-block" onClick={onPlayAgain}>
          Play another round
        </button>
        <Link href="/daily" className="btn btn-ghost btn-block">
          Today&rsquo;s situation
        </Link>
      </div>
    </section>
  );
}
