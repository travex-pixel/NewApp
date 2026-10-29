"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Choice, Scenario } from "@/lib/content";
import { localDateKey, nextSet, type PlayRecord } from "@/lib/game/engine";
import { auraFor } from "@/lib/game/archetypes";
import { commitProgress, readProgress } from "@/lib/game/progress-store";
import { saveSession, type RoundSession } from "@/lib/game/session-store";
import { track, trackOnce } from "@/lib/analytics";
import type { PlayMode } from "@/lib/analytics/events";
import { buzz, play } from "@/lib/sound";
import { RevealScreen } from "./RevealScreen";
import { ResultScreen, type Pick } from "./ResultScreen";
import { SituationScreen } from "./SituationScreen";

type Phase = "situation" | "reveal" | "result";

export interface GameProps {
  mode: PlayMode;
  round: Scenario[];
  /** round mode: the local date today's five belongs to. */
  dateKey?: string;
  /** round mode: 0 = today's five, 1+ = another five. */
  roundIndex?: number;
  /** round mode: a round in progress in this tab, restored after a refresh. */
  resume?: RoundSession;
  /** challenge mode: what the sender chose, hidden until answered. */
  challengerChoice?: Choice["id"];
  /** challenge mode: extra content for the "other answers" sheet. */
  pathsFooter?: React.ReactNode;
  headRight?: React.ReactNode;
}

const SELECT_DELAY_MS = 420;
const EASE = [0.16, 1, 0.3, 1] as const;

export function Game(props: GameProps) {
  const { mode } = props;
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
  const [foundBefore, setFoundBefore] = useState<Set<string> | null>(null);
  const timer = useRef<number | null>(null);
  const lock = useRef(false);

  const scenario = round[index];
  const total = round.length;
  const isLast = index + 1 >= total;
  const chosen = selected ? scenario?.choices.find((c) => c.id === selected) : undefined;
  const dateKey = props.dateKey ?? "";

  useEffect(() => {
    document.body.dataset.game = "on";
    return () => {
      delete document.body.dataset.game;
    };
  }, []);

  useEffect(() => {
    if (mode !== "round" || !dateKey) return;
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
      play.select();
      buzz(8);

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
          play.reveal();
          lock.current = false;
        },
        reduce ? 120 : SELECT_DELAY_MS,
      );
    },
    [selected, scenario, records, mode, index, props.challengerChoice, reduce],
  );

  const aura = useMemo(() => (phase === "result" ? auraFor(records) : null), [phase, records]);
  const picks = useMemo<Pick[]>(
    () =>
      records.map((r) => {
        const s = round.find((x) => x.id === r.scenarioId);
        const c = s?.choices.find((x) => x.id === r.choiceId);
        return { title: s?.title ?? "", tag: c?.tag ?? c?.id.toUpperCase() ?? "" };
      }),
    [records, round],
  );

  const advance = useCallback(() => {
    if (mode === "challenge") {
      router.push("/play");
      return;
    }
    if (!isLast) {
      play.next();
      setIndex((i) => i + 1);
      setSelected(null);
      setPhase("situation");
      return;
    }
    const { archetype } = auraFor(records);
    const base = readProgress();
    setFoundBefore(new Set(base.results.map((r) => r.archetypeId)));
    setStorageOk(
      commitProgress({ ...base, results: [...base.results, { archetypeId: archetype.id, dateKey: dateKey || localDateKey(), at: Date.now() }] }),
    );
    track("round_completed", { archetype_id: archetype.id, round_index: roundIndex, date: dateKey || localDateKey() });
    setPhase("result");
  }, [mode, isLast, records, dateKey, roundIndex, router]);

  const playAgain = useCallback(() => {
    const played = new Set([...readProgress().plays.map((p) => p.scenarioId), ...round.map((s) => s.id)]);
    const nextIndex = roundIndex + 1;
    play.next();
    setRound(nextSet(dateKey || localDateKey(), nextIndex, played));
    setRoundIndex(nextIndex);
    setIndex(0);
    setRecords([]);
    setSelected(null);
    setPhase("situation");
    track("play_again", { round_index: nextIndex });
  }, [round, roundIndex, dateKey]);

  if (!scenario) return null;

  const ctaLabel = mode === "challenge" ? "Play today's 5" : isLast ? "Reveal my social aura" : "Next situation";
  const headRight = props.headRight ?? (mode === "challenge" ? <span className="small muted">A challenge</span> : undefined);

  const wipe = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }
    : {
        initial: { clipPath: "inset(100% 0 0 0 round 28px 28px 0 0)" },
        animate: { clipPath: "inset(0% 0 0 0 round 0px 0px 0 0)" },
        exit: { opacity: 0 },
        transition: { duration: 0.6, ease: EASE },
      };
  const deal = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0.2 } }
    : { initial: { opacity: 0, x: 36 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 1 }, transition: { duration: 0.45, ease: EASE } };

  const found = new Set([...(foundBefore ?? []), ...(aura ? [aura.archetype.id] : [])]);
  const isNew = Boolean(aura && foundBefore && !foundBefore.has(aura.archetype.id));

  return (
    <AnimatePresence mode="sync" initial={false}>
      {phase === "situation" ? (
        <motion.div key={`situation-${roundIndex}-${index}`} {...deal} style={{ position: "fixed", inset: 0, zIndex: 10 }}>
          <SituationScreen
            scenario={scenario}
            index={index}
            total={total}
            selected={selected}
            onSelect={select}
            note={mode === "challenge" ? "Sent by a friend. Their pick stays hidden." : undefined}
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
            onPathsOpen={() => track("drawer_opened", { scenario_id: scenario.id, mode })}
            pathsFooter={props.pathsFooter}
            headRight={headRight}
          />
        </motion.div>
      ) : null}

      {phase === "result" && aura ? (
        <motion.div key={`result-${roundIndex}`} {...wipe} style={{ position: "fixed", inset: 0, zIndex: 30 }}>
          <ResultScreen
            archetype={aura.archetype}
            totals={aura.totals}
            picks={picks}
            found={found}
            isNew={isNew}
            onPlayAgain={playAgain}
            roundIndex={roundIndex}
            storageOk={storageOk}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
