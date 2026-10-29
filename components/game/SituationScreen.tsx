"use client";

import { motion } from "motion/react";
import type { Choice, Scenario } from "@/lib/content";
import { Wordmark } from "@/components/Wordmark";
import { AnswerOption } from "./AnswerOption";
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
  /** Optional line above the situation (e.g. challenge framing). */
  note?: string;
  headRight?: React.ReactNode;
}) {
  return (
    <GameShell
      head={
        <>
          <Wordmark />
          {headRight ?? <Progress current={index} total={total} />}
        </>
      }
      aria-label={`Situation ${index + 1} of ${total}`}
    >
      <motion.div
        className="centred"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {note ? <p className="small muted mb-3">{note}</p> : null}
        <p className="small olive font-medium">{scenario.category}</p>
        <h1 className="display mt-1.5" style={{ fontSize: "clamp(1.5rem, 6.2vw, 1.9rem)" }}>
          {scenario.title}
        </h1>
        <div className="mt-3 grid gap-2" style={{ fontSize: "1.0625rem", lineHeight: 1.45, textWrap: "pretty" }}>
          {scenario.setup.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="mt-4 mb-2.5 font-semibold" style={{ fontSize: "1.0625rem" }}>
          {scenario.prompt}
        </p>
        <div className="grid gap-2" role="group" aria-label="Your options">
          {scenario.choices.map((c) => (
            <AnswerOption
              key={c.id}
              choice={c}
              selected={selected === c.id}
              dimmed={selected !== null && selected !== c.id}
              disabled={selected !== null}
              onSelect={onSelect}
            />
          ))}
        </div>
      </motion.div>
    </GameShell>
  );
}
