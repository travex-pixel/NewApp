"use client";

import type { Choice, Scenario } from "@/lib/content";
import { verdictFor } from "@/lib/game/engine";
import type { ChallengeType } from "@/lib/analytics/events";
import { ShareButton } from "./ShareButton";

export function Reveal({
  scenario,
  choiceId,
  challengerChoice,
  challengeType,
  nextLabel,
  nextLine,
  onNext,
  shareable = true,
}: {
  scenario: Scenario;
  choiceId: Choice["id"];
  /** In challenge mode: what the person who sent the link chose. */
  challengerChoice?: Choice["id"];
  challengeType: ChallengeType;
  nextLabel: string;
  nextLine: string;
  onNext: () => void;
  shareable?: boolean;
}) {
  const chosen = scenario.choices.find((c) => c.id === choiceId)!;
  const theirs = challengerChoice
    ? scenario.choices.find((c) => c.id === challengerChoice)
    : undefined;
  const others = scenario.choices.filter((c) => c.id !== choiceId);
  const best = Math.max(...scenario.choices.map((c) => c.points));

  return (
    <article aria-labelledby="reveal-heading">
      {/* What you chose */}
      <p className="small" style={{ color: "var(--fg-2)" }}>
        You chose {chosen.id.toUpperCase()}
      </p>
      <h2
        id="reveal-heading"
        className="serif mt-2"
        style={{ fontSize: "1.5rem", lineHeight: 1.25, fontStyle: "italic", textWrap: "pretty" }}
      >
        {chosen.text}
      </h2>
      <p className="mt-3 font-semibold" style={{ color: chosen.points === best ? "var(--accent)" : "var(--fg)" }}>
        {verdictFor(chosen.points)}
        {chosen.points === best && chosen.points === 3 ? "" : chosen.points === best ? " — as good as it gets here" : ""}
      </p>

      {/* Comparison, in challenge mode */}
      {theirs ? (
        <div className="mt-6 artefact" style={{ padding: "1.1rem 1.15rem" }}>
          <p className="small" style={{ color: "var(--fg-2)" }}>
            {theirs.id === chosen.id ? "You picked the same thing." : "They went a different way."}
          </p>
          <p className="mt-1" style={{ fontWeight: 500 }}>
            They chose {theirs.id.toUpperCase()}: <span className="serif" style={{ fontStyle: "italic" }}>{theirs.text}</span>
          </p>
          <p className="small mt-1" style={{ color: "var(--fg-2)" }}>
            {verdictFor(theirs.points)}
          </p>
        </div>
      ) : null}

      {/* Consequence */}
      <div className="mt-8 grid gap-4" style={{ maxWidth: "62ch" }}>
        <p>
          <span className="runin">What it probably gets you. </span>
          <span style={{ color: "var(--fg-2)" }}>{chosen.outcome}</span>
        </p>
        {chosen.cost ? (
          <p>
            <span className="runin">What it costs. </span>
            <span style={{ color: "var(--fg-2)" }}>{chosen.cost}</span>
          </p>
        ) : null}
      </div>

      {/* The principle */}
      <figure className="mt-9 py-5" style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <blockquote>
          <p className="display" style={{ fontSize: "1.75rem", lineHeight: 1.12, fontWeight: 500 }}>
            {scenario.principle.title}
          </p>
          <p className="mt-3" style={{ color: "var(--fg-2)", maxWidth: "58ch" }}>
            {scenario.principle.body}
          </p>
        </blockquote>
      </figure>

      {/* The friend's read */}
      <p className="mt-7" style={{ maxWidth: "62ch", textWrap: "pretty" }}>
        {scenario.insight}
      </p>
      {scenario.alsoDefensible ? (
        <p className="mt-4" style={{ color: "var(--fg-2)", maxWidth: "62ch" }}>
          <span className="runin" style={{ color: "var(--fg)" }}>Also fair. </span>
          {scenario.alsoDefensible}
        </p>
      ) : null}
      {scenario.uncertain ? (
        <p className="mt-4" style={{ color: "var(--fg-2)", maxWidth: "62ch" }}>
          <span className="runin" style={{ color: "var(--fg)" }}>What we can&rsquo;t know. </span>
          {scenario.uncertain}
        </p>
      ) : null}

      {/* The other paths */}
      <section className="mt-9" aria-label="The other options">
        <h3 className="small font-semibold" style={{ color: "var(--fg-2)" }}>
          The other paths
        </h3>
        <ul className="mt-2">
          {others.map((c) => (
            <li key={c.id} className="row" style={{ display: "grid", gridTemplateColumns: "1.5rem 1fr", gap: "0.75rem" }}>
              <span className="font-semibold tabular" style={{ color: "var(--fg-2)" }}>{c.id.toUpperCase()}</span>
              <span>
                <span style={{ fontWeight: 500 }}>{c.text}</span>
                <span className="small block mt-1" style={{ color: "var(--fg-2)" }}>
                  <span style={{ color: c.points === best ? "var(--accent)" : "var(--fg-2)", fontWeight: 600 }}>{verdictFor(c.points)}.</span>{" "}
                  {c.outcome}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Next */}
      <div className="mt-10 grid gap-3">
        <p className="serif" style={{ fontSize: "1.125rem", color: "var(--fg-2)" }}>{nextLine}</p>
        <button type="button" className="btn btn-block" onClick={onNext}>
          {nextLabel}
        </button>
        {shareable ? (
          <ShareButton scenarioId={scenario.id} choiceId={choiceId} challengeType={challengeType} />
        ) : null}
      </div>
    </article>
  );
}
