import { ArrowDown, ArrowUp } from "lucide-react";
import type { Choice, Dimension } from "@/lib/content";
import { DIMENSION_LABELS } from "@/lib/game/archetypes";

/** Which instincts this answer leaned on. Small, so it teaches without shouting. */
export function DialChips({ choice }: { choice: Choice }) {
  const entries = (Object.entries(choice.scores) as [Dimension, number][])
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]) || b[1] - a[1])
    .slice(0, 3);
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Instincts this answer used">
      {entries.map(([d, v]) => (
        <li key={d} className="chip" data-dir={v > 0 ? "up" : "down"}>
          {v > 0 ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" />}
          <span className="sr-only">{v > 0 ? "More" : "Less"} </span>
          {DIMENSION_LABELS[d]}
        </li>
      ))}
    </ul>
  );
}
