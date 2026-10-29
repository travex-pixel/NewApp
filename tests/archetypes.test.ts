import { describe, expect, it } from "vitest";
import { SCENARIOS, type Choice, type Dimension } from "@/lib/content";
import { ARCHETYPES, ARCHETYPE_IDS, archetypeFor, auraFor, nextRoundTip, patternSummary, totalsFor, type Totals } from "@/lib/game/archetypes";
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
  it("there are at least 20 archetypes, each with complete, distinct copy", () => {
    expect(ARCHETYPE_IDS.length).toBeGreaterThanOrEqual(20);
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
    expect(auraFor(leanAnswers("avoidance")).archetype.id).toMatch(/escape-artist|people-pleaser|smooth-operator|quiet-strategist|note-writer|plot-twist/);
    expect(auraFor(leanAnswers("directness")).archetype.id).toMatch(/truth-teller|velvet-hammer|live-wire|plain-speaker|honest-hugger/);
    expect(auraFor(leanAnswers("boundaries")).archetype.id).toMatch(/boundary-architect|plain-speaker|velvet-rope|kind-no|maverick|quiet-strategist/);
    expect(auraFor(leanAnswers("empathy")).archetype.id).toMatch(/accidental-therapist|honest-hugger|room-reader|kind-no|people-pleaser|big-hearted-gambler/);
  });

  it("every archetype is reachable from real daily sets", () => {
    const seen = new Set<string>();
    const days = Array.from({ length: 30 }, (_, i) => new Date(Date.UTC(2026, 9, 29 + i)).toISOString().slice(0, 10));
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
    expect(Math.max(...Object.values(counts))).toBeLessThan(1024 * 0.3);
    expect(Object.keys(counts).length).toBeGreaterThanOrEqual(12);
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

describe("next round tip", () => {
  it("always gives a tip and names a dimension", () => {
    const set = todaysSet("2026-10-29");
    for (let n = 0; n < 1024; n += 37) {
      const answers = set.map((s, i) => ({ scenarioId: s.id, choiceId: IDS[Math.floor(n / 4 ** i) % 4] }));
      const tip = nextRoundTip(totalsFor(answers));
      expect(tip.tip.length).toBeGreaterThan(20);
    }
  });
});
