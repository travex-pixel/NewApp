"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Choice } from "@/lib/content";

export function AnswerOption({
  choice,
  index,
  selected,
  dimmed,
  disabled,
  onSelect,
}: {
  choice: Choice;
  index: number;
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
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={selected && !reduce ? { opacity: 1, y: 0, scale: [1, 1.025, 1] } : { opacity: 1, y: 0, scale: 1 }}
      transition={
        selected
          ? { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
          : { duration: 0.4, delay: reduce ? 0 : 0.12 + index * 0.06, ease: [0.16, 1, 0.3, 1] }
      }
      whileTap={reduce || disabled ? undefined : { scale: 0.975 }}
    >
      <span className="option-key" aria-hidden="true">
        {choice.id.toUpperCase()}
      </span>
      <span className="option-text">{choice.text}</span>
    </motion.button>
  );
}
