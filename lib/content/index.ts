import { scenarios1 } from "./scenarios-1";
import { scenarios2 } from "./scenarios-2";
import { scenarios3 } from "./scenarios-3";
import type { Scenario } from "./types";

export * from "./types";

/** The full authored library, in authoring order. */
export const SCENARIOS: readonly Scenario[] = [
  ...scenarios1,
  ...scenarios2,
  ...scenarios3,
];

const byId = new Map(SCENARIOS.map((s) => [s.id, s]));

export function getScenario(id: string): Scenario | undefined {
  return byId.get(id);
}

/**
 * The curated order for a player's first round. Chosen for: an opener that
 * needs no backstory, then variety of tension (joining a group, pressure at
 * work, a boundary, a bias), rising difficulty.
 */
export const FIRST_ROUND: readonly string[] = [
  "joke-at-your-expense",
  "everyone-knows-each-other",
  "credit-for-your-idea",
  "boundary-pushback",
  "sunk-cost-holiday",
];

export const ROUND_LENGTH = 5;
