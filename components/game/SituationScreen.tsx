"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Choice, Scenario } from "@/lib/content";
import { AnswerOption } from "./AnswerOption";
import { GameHeader } from "./GameHeader";
import { GameShell } from "./GameShell";
import { Progress } from "./Progress";

export function SituationScreen({
  scenario,
  index,
  total,
  selected,
  onSelect,
  note,
  headRight,
}: {
  scenario: Scenario;
  index: number;
  total: number;
  selected: Choice["id"] | null;
  onSelect: (id: Choice["id"]) => void;
  note?: string;
  headRight?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <GameShell
      head={<GameHeader right={headRight ?? <Progress current={index} total={total} />} />}
      foot={
        <div className="tray" role="group" aria-label={scenario.prompt}>
          <p className="tray-prompt">{scenario.prompt}</p>
          {scenario.choices.map((c, i) => (
            <AnswerOption
              key={c.id}
              index={i}
              choice={c}
              selected={selected === c.id}
              dimmed={selected !== null && selected !== c.id}
              disabled={selected !== null}
              onSelect={onSelect}
            />
          ))}
        </div>
      }
      aria-label={`Situation ${index + 1} of ${total}`}
    >
      <motion.div
        className="centred"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {note ? <p className="small muted mb-2">{note}</p> : null}
        <p className="small olive font-semibold">{scenario.category}</p>
        <h1 className="display fit-title mt-1">{scenario.title}</h1>
        <div className="fit-body mt-2.5 grid gap-2" style={{ textWrap: "pretty" }}>
          {scenario.setup.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </motion.div>
    </GameShell>
  );
}
