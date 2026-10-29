"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Choice, Scenario } from "@/lib/content";
import { nextSet, type PlayRecord } from "@/lib/game/engine";
import { auraFor } from "@/lib/game/archetypes";
import { commitProgress, readProgress } from "@/lib/game/progress-store";
import { saveSession, type RoundSession } from "@/lib/game/session-store";
import { track, trackOnce } from "@/lib/analytics";
import type { PlayMode } from "@/lib/analytics/events";
import { RevealScreen } from "./RevealScreen";
import { ResultScreen } from "./ResultScreen";
import { SituationScreen } from "./SituationScreen";

type Phase = "situation" | "reveal" | "result";

export interface GameProps {
  mode: PlayMode;
  dateKey: string;
  round: Scenario[];
  /** round mode: 0 = today's five, 1+ = another five. */
  roundIndex?: number;
  /** round mode: a round in progress in this tab, restored after a refresh. */
  resume?: RoundSession;
  /** challenge mode: what the sender chose, hidden until answered. */
  challengerChoice?: Choice["id"];
  /** challenge mode: something to put in the drawer (e.g. a send-back link). */
  drawerFooter?: React.ReactNode;
  headRight?: React.ReactNode;
}

const SELECT_DELAY_MS = 380;
const EASE = [0.16, 1, 0.3, 1] as const;

export function Game(props: GameProps) {
  const { mode, dateKey } = props;
  const router = useRouter();
  const reduce = useReducedMotion();

  const [round, setRound] = useState<Scenario[]>(props.round);
  const [roundIndex, setRoundIndex] = useState(props.resume?.roundIndex ?? props.roundIndex ?? 0);
  const [index, setIndex] = useState(props.resume?.index ?? 0);
  const [records, setRecords] = useState<PlayRecord[]>(props.resume?.records ?? []);
  const [selected, setSelected] = useState<Choice["id"] | null>(() => props.resume?.records[props.resume.index]?.choiceId ?? null);
  const [phase, setPhase] = useState<Phase>(() =>
    props.resume?.finished ? "result" : props.resume?.records[props.resume.index] ? "reveal" : "situation",
  );
  const [storageOk, setStorageOk] = useState(true);
  const timer = useRef<number | null>(null);
  const lock = useRef(false);

  const scenario = round[index];
  const total = round.length;
  const isLast = index + 1 >= total;
  const chosen = selected ? scenario?.choices.find((c) => c.id === selected) : undefined;

  // The page never scrolls while the game is up.
  useEffect(() => {
    document.body.dataset.game = "on";
    return () => {
      delete document.body.dataset.game;
    };
  }, []);

  // Persist the round in this tab so a refresh resumes it.
  useEffect(() => {
    if (mode !== "round") return;
    // An untouched first round has nothing to restore, and the pre-hydration
    // instance must not overwrite a session the resume logic is about to read.
    if (records.length === 0 && index === 0 && roundIndex === 0 && phase === "situation") return;
    saveSession({ dateKey, roundIndex, roundIds: round.map((s) => s.id), index, records, finished: phase === "result" });
  }, [mode, dateKey, roundIndex, round, index, records, phase]);

  useEffect(() => {
    if (!scenario || phase !== "situation") return;
    trackOnce(`viewed:${mode}:${roundIndex}:${scenario.id}`, "scenario_viewed", {
      scenario_id: scenario.id,
      category: scenario.category,
      mode,
      position: index + 1,
    });
  }, [scenario, phase, mode, index, roundIndex]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const select = useCallback(
    (choiceId: Choice["id"]) => {
      if (lock.current || selected || !scenario) return;
      const choice = scenario.choices.find((c) => c.id === choiceId);
      if (!choice) return;
      lock.current = true;
      setSelected(choiceId);

      const record: PlayRecord = { scenarioId: scenario.id, choiceId, at: Date.now() };
      const newRecords = [...records, record];
      setRecords(newRecords);

      const base = readProgress();
      setStorageOk(commitProgress({ ...base, plays: [...base.plays, record] }));

      track("answer_selected", { scenario_id: scenario.id, category: scenario.category, choice_id: choiceId, mode, position: index + 1 });
      if (mode === "challenge" && props.challengerChoice) {
        track("challenge_completed", { scenario_id: scenario.id, same_choice: props.challengerChoice === choiceId });
      }

      timer.current = window.setTimeout(
        () => {
          setPhase("reveal");
          lock.current = false;
        },
        reduce ? 120 : SELECT_DELAY_MS,
      );
    },
    [selected, scenario, records, mode, index, props.challengerChoice, reduce],
  );

  const aura = useMemo(() => (phase === "result" ? auraFor(records) : null), [phase, records]);

  const advance = useCallback(() => {
    if (mode === "challenge") {
      router.push("/play");
      return;
    }
    if (!isLast) {
      setIndex((i) => i + 1);
      setSelected(null);
      setPhase("situation");
      return;
    }
    const { archetype } = auraFor(records);
    const base = readProgress();
    setStorageOk(commitProgress({ ...base, results: [...base.results, { archetypeId: archetype.id, dateKey, at: Date.now() }] }));
    track("round_completed", { archetype_id: archetype.id, round_index: roundIndex, date: dateKey });
    setPhase("result");
  }, [mode, isLast, records, dateKey, roundIndex, router]);

  const playAgain = useCallback(() => {
    const played = new Set([...readProgress().plays.map((p) => p.scenarioId), ...round.map((s) => s.id)]);
    const nextIndex = roundIndex + 1;
    setRound(nextSet(dateKey, nextIndex, played));
    setRoundIndex(nextIndex);
    setIndex(0);
    setRecords([]);
    setSelected(null);
    setPhase("situation");
    track("play_again", { round_index: nextIndex });
  }, [round, roundIndex, dateKey]);

  if (!scenario) return null;

  const ctaLabel = mode === "challenge" ? "Play today's 5" : isLast ? "Reveal my social aura" : "Next situation";
  const headRight =
    props.headRight ??
    (mode === "challenge" ? <span className="small muted">A challenge</span> : undefined);

  const wipe = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }
    : {
        initial: { clipPath: "inset(100% 0 0 0)" },
        animate: { clipPath: "inset(0 0 0 0)" },
        exit: { opacity: 0 },
        transition: { duration: 0.55, ease: EASE },
      };
  const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0.25 } };

  return (
    <AnimatePresence mode="sync" initial={false}>
      {phase === "situation" ? (
        <motion.div key={`situation-${roundIndex}-${index}`} {...fade} style={{ position: "fixed", inset: 0, zIndex: 10 }}>
          <SituationScreen
            scenario={scenario}
            index={index}
            total={total}
            selected={selected}
            onSelect={select}
            note={mode === "challenge" ? "Someone sent you this. Their answer is hidden until you've given yours." : undefined}
            headRight={headRight}
          />
        </motion.div>
      ) : null}

      {phase === "reveal" && chosen ? (
        <motion.div key={`reveal-${roundIndex}-${index}`} {...wipe} style={{ position: "fixed", inset: 0, zIndex: 20 }}>
          <RevealScreen
            scenario={scenario}
            choice={chosen}
            index={index}
            total={total}
            ctaLabel={ctaLabel}
            onNext={advance}
            challengerChoice={mode === "challenge" && props.challengerChoice ? scenario.choices.find((c) => c.id === props.challengerChoice) : undefined}
            onDrawerOpen={() => track("drawer_opened", { scenario_id: scenario.id, mode })}
            drawerFooter={props.drawerFooter}
            headRight={headRight}
          />
        </motion.div>
      ) : null}

      {phase === "result" && aura ? (
        <motion.div key={`result-${roundIndex}`} {...wipe} style={{ position: "fixed", inset: 0, zIndex: 30 }}>
          <ResultScreen archetype={aura.archetype} totals={aura.totals} onPlayAgain={playAgain} roundIndex={roundIndex} storageOk={storageOk} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
