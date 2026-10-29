"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FIRST_ROUND, getScenario, type Choice, type Scenario } from "@/lib/content";
import {
  buildRound,
  milestonesEarned,
  nextLine as nextLineFor,
  type Milestone,
  type PlayRecord,
  type Progress,
} from "@/lib/game/engine";
import { commitProgress, readProgress, useHydrated, useProgress } from "@/lib/game/progress-store";
import { clearSession, saveSession, type RoundSession } from "@/lib/game/session-store";
import { track, trackOnce } from "@/lib/analytics";
import type { PlayMode } from "@/lib/analytics/events";
import { ChoiceList } from "./ChoiceList";
import { Meter } from "./Meter";
import { Reveal } from "./Reveal";
import { RoundResult } from "./RoundResult";
import { Wordmark } from "./Wordmark";
import { ShareButton } from "./ShareButton";

type Phase = "answer" | "reveal" | "result";

export interface GameProps {
  mode: PlayMode;
  /** challenge / daily: the single scenario to play. */
  scenario?: Scenario;
  /** challenge: what the sender chose. Hidden until the player has answered. */
  challengerChoice?: Choice["id"];
  /** daily: the UTC date key this scenario belongs to. */
  dateKey?: string;
  /** daily: a human date for the header. */
  dateLabel?: string;
  /** daily: if today was already answered on this device, the record to show. */
  priorRecord?: PlayRecord;
  /** round: a round in progress in this tab, restored after a refresh. */
  resume?: RoundSession;
}

const SELECT_DELAY_MS = 420;

function firstRound(): Scenario[] {
  return FIRST_ROUND.map((id) => getScenario(id)).filter((s): s is Scenario => Boolean(s));
}

export function Game(props: GameProps) {
  const { mode } = props;
  const router = useRouter();
  const hydrated = useHydrated();
  const progress = useProgress();

  // A resumed round may have already answered the current scenario.
  const resumedCurrent = props.resume ? props.resume.records[props.resume.index] : undefined;
  const initialRecord = props.priorRecord ?? resumedCurrent;

  const [roundKey, setRoundKey] = useState(0);
  const [index, setIndex] = useState(() => props.resume?.index ?? 0);
  const [records, setRecords] = useState<PlayRecord[]>(() =>
    props.resume ? props.resume.records : props.priorRecord ? [props.priorRecord] : [],
  );
  const [selected, setSelected] = useState<Choice["id"] | null>(() => initialRecord?.choiceId ?? null);
  const [phase, setPhase] = useState<Phase>(() => (initialRecord ? "reveal" : "answer"));
  const [newMilestones, setNewMilestones] = useState<Milestone[]>([]);
  const [storageOk, setStorageOk] = useState(true);
  const timer = useRef<number | null>(null);

  // The round is fixed when it starts. For a returning player it's built from
  // their history once the client has hydrated; it must not change as they
  // answer, so progress is deliberately not a dependency here.
  const singleId = props.scenario?.id;
  const round = useMemo<Scenario[]>(() => {
    if (props.scenario) return [props.scenario];
    if (props.resume && roundKey === 0) {
      const restored = props.resume.roundIds.map((id) => getScenario(id)).filter((s): s is Scenario => Boolean(s));
      if (restored.length === props.resume.roundIds.length) return restored;
    }
    const p = readProgress();
    return hydrated && p.plays.length > 0 ? buildRound(p) : firstRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleId, roundKey, hydrated]);

  const roundNumber = useMemo(
    () => (hydrated ? readProgress().roundsCompleted + 1 : 1),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roundKey, hydrated],
  );

  const scenario = round[index];

  // Funnel: scenario viewed.
  useEffect(() => {
    if (!scenario || phase !== "answer" || !hydrated) return;
    trackOnce(`viewed:${mode}:${scenario.id}`, "scenario_viewed", {
      scenario_id: scenario.id,
      category: scenario.category,
      mode,
      position: index + 1,
    });
    if (progress.plays.length === 0) {
      trackOnce("first_scenario_viewed", "first_scenario_viewed", {
        scenario_id: scenario.id,
        category: scenario.category,
        mode,
      });
    }
  }, [scenario, phase, mode, index, hydrated, progress.plays.length]);

  // Keep the in-progress round in this tab so a refresh resumes it.
  useEffect(() => {
    if (mode !== "round" || !hydrated) return;
    if (phase === "result") {
      clearSession();
      return;
    }
    saveSession({ roundIds: round.map((s) => s.id), index, records });
  }, [mode, hydrated, phase, round, index, records]);

  // Lock the page behind the ink sheet.
  useEffect(() => {
    document.body.dataset.sheet = phase === "answer" ? "" : "open";
    return () => {
      delete document.body.dataset.sheet;
    };
  }, [phase]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  // Move focus into the ink sheet when it opens, without scrolling it.
  const sheetRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (phase === "reveal" && sheetRef.current) {
      sheetRef.current.focus({ preventScroll: true });
    }
  }, [phase]);

  const select = useCallback(
    (choiceId: Choice["id"]) => {
      if (selected || !scenario) return;
      const choice = scenario.choices.find((c) => c.id === choiceId);
      if (!choice) return;
      setSelected(choiceId);

      const record: PlayRecord = { scenarioId: scenario.id, choiceId, points: choice.points, at: Date.now() };
      const base = readProgress();
      const wasFirstEver = base.plays.length === 0;
      const next: Progress = {
        ...base,
        plays: [...base.plays, record],
        dailiesDone:
          mode === "daily" && props.dateKey && !base.dailiesDone.includes(props.dateKey)
            ? [...base.dailiesDone, props.dateKey]
            : base.dailiesDone,
      };
      const before = new Set(milestonesEarned(base).map((m) => m.id));
      const earned = milestonesEarned(next).filter((m) => !before.has(m.id));
      if (earned.length) setNewMilestones((prev) => [...prev, ...earned]);
      setStorageOk(commitProgress(next));
      const newRecords = [...records, record];
      setRecords(newRecords);

      track("answer_selected", {
        scenario_id: scenario.id,
        category: scenario.category,
        choice_id: choiceId,
        points: choice.points,
        mode,
      });
      if (wasFirstEver) {
        trackOnce("first_scenario_completed", "first_scenario_completed", { scenario_id: scenario.id, mode });
      }
      if (newRecords.length === 3) trackOnce("three", "three_scenarios_completed", { mode });
      if (newRecords.length === 5) trackOnce("five", "five_scenarios_completed", { mode });
      if (mode === "challenge" && props.challengerChoice) {
        track("challenge_completed", { scenario_id: scenario.id, same_choice: props.challengerChoice === choiceId });
      }
      if (mode === "daily" && props.dateKey) {
        track("daily_challenge_completed", { scenario_id: scenario.id, date: props.dateKey, points: choice.points });
      }

      timer.current = window.setTimeout(() => setPhase("reveal"), SELECT_DELAY_MS);
    },
    [selected, scenario, records, mode, props.dateKey, props.challengerChoice],
  );

  const advance = useCallback(() => {
    if (index + 1 < round.length) {
      setIndex(index + 1);
      setSelected(null);
      setPhase("answer");
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    if (mode === "round") {
      const base = readProgress();
      const next = { ...base, roundsCompleted: base.roundsCompleted + 1 };
      commitProgress(next);
      const points = records.reduce((s, r) => s + r.points, 0);
      track("session_completed", { points, max_points: records.length * 3, round_number: next.roundsCompleted });
    }
    setPhase("result");
  }, [index, round.length, mode, records]);

  const playAgain = useCallback(() => {
    setRoundKey((k) => k + 1);
    setIndex(0);
    setRecords([]);
    setSelected(null);
    setNewMilestones([]);
    setPhase("answer");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const goToRound = useCallback(() => router.push("/play"), [router]);

  if (!scenario) return null;

  const isLast = index + 1 >= round.length;
  const chosen = selected ? scenario.choices.find((c) => c.id === selected) : undefined;
  const nextScenario = round[index + 1];

  const headerRight =
    mode === "round" ? (
      <Meter total={round.length} current={phase === "result" ? round.length : index} />
    ) : mode === "daily" ? (
      <span className="small" style={{ color: "var(--fg-2)" }}>{props.dateLabel ?? "Today"}</span>
    ) : (
      <span className="small" style={{ color: "var(--fg-2)" }}>A challenge</span>
    );

  const nextLabel = mode === "round" ? (isLast ? "See the round" : "Next situation") : "Play a full round";

  const nextLine =
    mode === "round"
      ? chosen
        ? nextLineFor(chosen.points, isLast, nextScenario?.difficulty)
        : ""
      : mode === "challenge"
        ? "Send one back, or keep going."
        : "Come back tomorrow for the next one.";

  return (
    <>
      {/* Paper: the situation and the decision */}
      <div className="page flex-1 flex flex-col" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
        <header className="flex items-center justify-between py-3">
          <Wordmark />
          {headerRight}
        </header>

        <main className="pt-6 pb-16 enter" key={`${scenario.id}:${index}`}>
          {mode === "challenge" ? (
            <p className="small mb-4" style={{ color: "var(--fg-2)" }}>
              Someone sent you this. Their answer is hidden until you&rsquo;ve given yours.
            </p>
          ) : null}
          {mode === "daily" ? (
            <p className="small mb-4" style={{ color: "var(--fg-2)" }}>
              Today&rsquo;s situation. Everyone gets the same one; it changes at midnight UTC.
            </p>
          ) : null}

          <div className="narrative grid gap-4" style={{ maxWidth: "34rem" }}>
            {scenario.setup.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <p className="mt-7 mb-3 font-semibold" style={{ fontSize: "1.0625rem" }}>
            {scenario.prompt}
          </p>
          <ChoiceList choices={scenario.choices} selected={selected} onSelect={select} />

          {mode === "challenge" ? (
            <p className="small mt-6" style={{ color: "var(--fg-3)" }}>
              Or <Link href="/play">start a round of your own</Link>.
            </p>
          ) : null}
        </main>
      </div>

      {/* Ink: the reveal and the result */}
      {phase !== "answer" && chosen ? (
        <div className="ink ink-sheet" role="region" aria-label="What happens" tabIndex={-1} ref={sheetRef} style={{ outline: "none" }}>
          <div
            className="page"
            style={{
              paddingTop: "max(env(safe-area-inset-top), 14px)",
              paddingBottom: "max(env(safe-area-inset-bottom), 48px)",
            }}
          >
            <header className="flex items-center justify-between py-3">
              <Wordmark />
              {headerRight}
            </header>
            <div className="pt-6">
              {phase === "reveal" ? (
                <>
                  <Reveal
                    key={scenario.id}
                    scenario={scenario}
                    choiceId={chosen.id}
                    challengerChoice={mode === "challenge" ? props.challengerChoice : undefined}
                    challengeType={mode === "daily" ? "daily" : "scenario"}
                    nextLabel={nextLabel}
                    nextLine={nextLine}
                    onNext={mode === "round" ? advance : goToRound}
                    shareable={mode !== "daily"}
                  />
                  {mode === "daily" ? (
                    <div className="mt-3">
                      <ShareButton
                        scenarioId={scenario.id}
                        choiceId={chosen.id}
                        challengeType="daily"
                        label="Send today's to a friend"
                        shareText="Today's situation on Instinct. I've answered; what would you do?"
                      />
                    </div>
                  ) : null}
                </>
              ) : (
                <RoundResult
                  records={records}
                  progress={progress}
                  newMilestones={newMilestones}
                  roundNumber={roundNumber}
                  onPlayAgain={playAgain}
                  storageOk={storageOk}
                />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
