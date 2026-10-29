import { scenarios1 } from "./scenarios-1";
import { scenarios2 } from "./scenarios-2";
import { scenarios3 } from "./scenarios-3";
import type { Scenario } from "./types";

export * from "./types";

/** The full authored library, in authoring order. Append-only. */
export const SCENARIOS: readonly Scenario[] = [...scenarios1, ...scenarios2, ...scenarios3];

const byId = new Map(SCENARIOS.map((s) => [s.id, s]));

export function getScenario(id: string): Scenario | undefined {
  return byId.get(id);
}

export const ROUND_LENGTH = 5;
