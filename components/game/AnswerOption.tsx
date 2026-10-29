"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Choice } from "@/lib/content";

export function AnswerOption({
  choice,
  selected,
  dimmed,
  disabled,
  onSelect,
}: {
  choice: Choice;
  selected: boolean;
  dimmed: boolean;
  disabled: boolean;
  onSelect: (id: Choice["id"]) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      className="option"
      data-selected={selected}
      data-dimmed={dimmed}
      disabled={disabled}
      aria-pressed={selected}
      onClick={() => onSelect(choice.id)}
      whileTap={reduce || disabled ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.12 }}
    >
      <span className="option-key" aria-hidden="true">
        {choice.id.toUpperCase()}
      </span>
      <span className="option-text">{choice.text}</span>
    </motion.button>
  );
}
