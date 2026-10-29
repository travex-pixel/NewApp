import { describe, expect, it } from "vitest";
import { FIRST_ROUND, ROUND_LENGTH, SCENARIOS } from "@/lib/content";
import {
  buildRound,
  EMPTY_PROGRESS,
  milestonesEarned,
  nextLine,
  summariseRound,
  totalXp,
  type PlayRecord,
  type Progress,
} from "@/lib/game/engine";

function rec(scenarioId: string, points: 0 | 1 | 2 | 3, at = 1): PlayRecord {
  return { scenarioId, choiceId: "a", points, at };
}

describe("buildRound", () => {
  it("gives new players the curated first round", () => {
    expect(buildRound(EMPTY_PROGRESS).map((s) => s.id)).toEqual(FIRST_ROUND);
  });

  it("gives returning players unplayed scenarios, difficulty rising, varied categories", () => {
    const progress: Progress = {
      plays: FIRST_ROUND.map((id) => rec(id, 2)),
      roundsCompleted: 1,
      dailiesDone: [],
    };
    const round = buildRound(progress);
    expect(round.length).toBe(ROUND_LENGTH);
    for (const s of round) expect(FIRST_ROUND).not.toContain(s.id);
    for (let i = 1; i < round.length; i++) {
      expect(round[i].difficulty).toBeGreaterThanOrEqual(round[i - 1].difficulty);
    }
    expect(new Set(round.map((s) => s.category)).size).toBeGreaterThanOrEqual(4);
  });

  it("is deterministic for the same progress (a refresh doesn't reshuffle)", () => {
    const progress: Progress = { plays: FIRST_ROUND.map((id) => rec(id, 1)), roundsCompleted: 1, dailiesDone: [] };
    expect(buildRound(progress).map((s) => s.id)).toEqual(buildRound(progress).map((s) => s.id));
  });

  it("recycles once the library is exhausted, least recent first", () => {
    const plays = SCENARIOS.map((s, i) => rec(s.id, 3, i + 1));
    const round = buildRound({ plays, roundsCompleted: 5, dailiesDone: [] });
    expect(round.length).toBe(ROUND_LENGTH);
    const ids = new Set(round.map((s) => s.id));
    expect(ids.size).toBe(ROUND_LENGTH);
  });
});

describe("summariseRound", () => {
  it("totals points, xp, strong reads and finds the hardest", () => {
    const ids = FIRST_ROUND;
    const s = summariseRound([rec(ids[0], 3), rec(ids[1], 1), rec(ids[2], 3), rec(ids[3], 2), rec(ids[4], 0)]);
    expect(s.points).toBe(9);
    expect(s.maxPoints).toBe(15);
    expect(s.xp).toBe(90);
    expect(s.strongReads).toBe(2);
    expect(s.hardest?.id).toBe(ids[4]);
  });

  it("names no hardest scenario on a perfect round", () => {
    const s = summariseRound(FIRST_ROUND.map((id) => rec(id, 3)));
    expect(s.hardest).toBeUndefined();
    expect(s.points).toBe(s.maxPoints);
  });
});

describe("milestones and xp", () => {
  it("earns only what was done", () => {
    expect(milestonesEarned(EMPTY_PROGRESS)).toEqual([]);
    const one: Progress = { plays: [rec(FIRST_ROUND[0], 2)], roundsCompleted: 0, dailiesDone: [] };
    expect(milestonesEarned(one).map((m) => m.id)).toEqual(["first"]);
    const cold: Progress = { plays: FIRST_ROUND.slice(0, 3).map((id) => rec(id, 3)), roundsCompleted: 0, dailiesDone: [] };
    expect(milestonesEarned(cold).map((m) => m.id)).toContain("cold");
    expect(totalXp(cold)).toBe(90);
  });
});

describe("nextLine", () => {
  it("only praises when earned", () => {
    expect(nextLine(3, false)).toMatch(/^Good instinct/);
    expect(nextLine(0, false)).not.toMatch(/Good/);
    expect(nextLine(2, true)).toBe("That's the round.");
  });
});
