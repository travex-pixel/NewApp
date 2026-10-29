import { describe, expect, it } from "vitest";
import { FIRST_ROUND, ROUND_LENGTH, SCENARIOS, getScenario } from "@/lib/content";

describe("scenario library", () => {
  it("has at least 20 scenarios with unique, stable ids", () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(20);
    const ids = SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it("every scenario has well-formed choices, one strongest, and no contradictions", () => {
    for (const s of SCENARIOS) {
      expect(s.choices.length).toBeGreaterThanOrEqual(3);
      expect(s.choices.length).toBeLessThanOrEqual(4);
      const ids = s.choices.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(s.choices.filter((c) => c.points === 3).length).toBe(1);
      for (const c of s.choices) {
        expect(c.text.length).toBeGreaterThan(10);
        expect(c.outcome.length).toBeGreaterThan(20);
        expect([0, 1, 2, 3]).toContain(c.points);
      }
      expect(s.setup.length).toBeGreaterThanOrEqual(1);
      expect(s.setup.length).toBeLessThanOrEqual(4);
      expect(s.principle.title.split(" ").length).toBeLessThanOrEqual(7);
      expect(s.insight.length).toBeGreaterThan(80);
      expect([1, 2, 3]).toContain(s.difficulty);
    }
  });

  it("never claims scientific authority", () => {
    const banned = /\b(scientifically|neuroscience|studies show|research proves|clinically)\b/i;
    for (const s of SCENARIOS) {
      const text = [s.insight, s.principle.body, ...s.choices.map((c) => c.outcome + c.cost)].join(" ");
      expect(text).not.toMatch(banned);
    }
  });

  it("first round is curated, valid, and the right length", () => {
    expect(FIRST_ROUND.length).toBe(ROUND_LENGTH);
    for (const id of FIRST_ROUND) expect(getScenario(id)).toBeDefined();
    const cats = new Set(FIRST_ROUND.map((id) => getScenario(id)!.category));
    expect(cats.size).toBeGreaterThanOrEqual(4);
    expect(getScenario(FIRST_ROUND[0])!.difficulty).toBe(1);
  });
});
