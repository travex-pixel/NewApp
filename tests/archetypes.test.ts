import { describe, expect, it } from "vitest";
import { SCENARIOS, type Choice, type Dimension } from "@/lib/content";
import { ARCHETYPES, ARCHETYPE_IDS, archetypeFor, auraFor, patternSummary, totalsFor, type Totals } from "@/lib/game/archetypes";
import { todaysSet } from "@/lib/game/engine";

const IDS: Choice["id"][] = ["a", "b", "c", "d"];

/** Pick, in each scenario, the answer that most favours one dimension. */
function leanAnswers(dim: Dimension, scenarios = todaysSet("2026-10-29")) {
  return scenarios.map((s) => {
    const best = [...s.choices].sort((x, y) => (y.scores[dim] ?? 0) - (x.scores[dim] ?? 0))[0];
    return { scenarioId: s.id, choiceId: best.id };
  });
}

describe("archetypes", () => {
  it("every archetype has complete, distinct copy", () => {
    const names = new Set<string>();
    for (const id of ARCHETYPE_IDS) {
      const a = ARCHETYPES[id];
      expect(a.id).toBe(id);
      expect(a.name.length).toBeGreaterThan(5);
      expect(a.headline.length).toBeGreaterThan(20);
      expect(a.description.length).toBeGreaterThan(80);
      expect(a.strengths.length).toBeGreaterThanOrEqual(2);
      expect(a.watchOuts.length).toBeGreaterThanOrEqual(2);
      names.add(a.name);
    }
    expect(names.size).toBe(ARCHETYPE_IDS.length);
  });

  it("is deterministic", () => {
    const answers = leanAnswers("diplomacy");
    expect(auraFor(answers).archetype.id).toBe(auraFor(answers).archetype.id);
  });

  it("maps consistent leans to the archetype you'd expect", () => {
    expect(auraFor(leanAnswers("avoidance")).archetype.id).toMatch(/escape-artist|people-pleaser|table-diplomat/);
    expect(auraFor(leanAnswers("directness")).archetype.id).toMatch(/truth-teller|velvet-hammer|social-risk-taker/);
    expect(auraFor(leanAnswers("boundaries")).archetype.id).toMatch(/boundary-architect|velvet-hammer/);
    expect(auraFor(leanAnswers("empathy")).archetype.id).toMatch(/accidental-therapist|chaos-mediator|velvet-hammer|people-pleaser/);
  });

  it("every archetype is reachable from real daily sets", () => {
    const seen = new Set<string>();
    const days = ["2026-10-29", "2026-10-30", "2026-10-31", "2026-11-01", "2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05"];
    for (const d of days) {
      const set = todaysSet(d);
      for (let n = 0; n < 1024; n++) {
        const answers = set.map((s, i) => ({ scenarioId: s.id, choiceId: IDS[Math.floor(n / 4 ** i) % 4] }));
        seen.add(auraFor(answers).archetype.id);
      }
    }
    for (const id of ARCHETYPE_IDS) expect(seen.has(id), `${id} reachable`).toBe(true);
  });

  it("no archetype dominates random play and different patterns differ", () => {
    const set = todaysSet("2026-10-31");
    const counts: Record<string, number> = {};
    for (let n = 0; n < 1024; n++) {
      const answers = set.map((s, i) => ({ scenarioId: s.id, choiceId: IDS[Math.floor(n / 4 ** i) % 4] }));
      const id = auraFor(answers).archetype.id;
      counts[id] = (counts[id] ?? 0) + 1;
    }
    expect(Math.max(...Object.values(counts))).toBeLessThan(1024 * 0.4);
    expect(Object.keys(counts).length).toBeGreaterThanOrEqual(6);
  });

  it("flat profiles are the Overthinker; unknown answers are ignored", () => {
    const flat: Totals = { directness: 1, diplomacy: 1, risk: 0, empathy: 1, boundaries: 0, avoidance: 1 };
    expect(archetypeFor(flat).id).toBe("professional-overthinker");
    const t = totalsFor([{ scenarioId: "not-a-scenario", choiceId: "a" }]);
    expect(Object.values(t).every((v) => v === 0)).toBe(true);
    expect(patternSummary(flat)).toMatch(/No single instinct/);
  });

  it("every scenario's choices can be scored", () => {
    for (const s of SCENARIOS) {
      for (const c of s.choices) {
        const t = totalsFor([{ scenarioId: s.id, choiceId: c.id }]);
        expect(Object.values(t).some((v) => v !== 0)).toBe(true);
      }
    }
  });
});
