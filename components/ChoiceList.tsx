"use client";

import type { Choice } from "@/lib/content";

export function ChoiceList({
  choices,
  selected,
  onSelect,
  disabled,
}: {
  choices: Choice[];
  selected: Choice["id"] | null;
  onSelect: (id: Choice["id"]) => void;
  disabled?: boolean;
}) {
  return (
    <div role="group" aria-label="Your options">
      {choices.map((c) => {
        const isSelected = selected === c.id;
        const dimmed = selected !== null && !isSelected;
        return (
          <button
            key={c.id}
            type="button"
            className="choice"
            data-selected={isSelected}
            data-dimmed={dimmed}
            disabled={disabled || selected !== null}
            aria-pressed={isSelected}
            onClick={() => onSelect(c.id)}
          >
            <span className={`choice-marker ${isSelected ? "pulse-marker" : ""}`} aria-hidden="true">
              {c.id.toUpperCase()}
            </span>
            <span className="choice-text">{c.text}</span>
          </button>
        );
      })}
    </div>
  );
}
