import { describe, expect, it } from "vitest";
import { DIMENSIONS, LIMITS, SCENARIOS } from "@/lib/content";
import { ARCHETYPES } from "@/lib/game/archetypes";
import { SCIENCE } from "@/lib/content/science";

describe("scenario library", () => {
  it("has at least 20 scenarios with unique, stable ids", () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(20);
    const ids = SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it("every scenario fits one phone screen: the limits that keep it from scrolling", () => {
    for (const s of SCENARIOS) {
      expect(s.title.length, `${s.id} title`).toBeLessThanOrEqual(LIMITS.title);
      expect(s.setup.length).toBeGreaterThanOrEqual(1);
      expect(s.setup.length).toBeLessThanOrEqual(2);
      expect(s.setup.join(" ").length, `${s.id} setup`).toBeLessThanOrEqual(LIMITS.setupTotal);
      expect(s.choices.length).toBe(4);
      expect(new Set(s.choices.map((c) => c.id)).size).toBe(4);
      for (const c of s.choices) {
        const where = `${s.id}/${c.id}`;
        expect(c.text.length, `${where} text`).toBeLessThanOrEqual(LIMITS.choiceText);
        expect(c.verdict.length, `${where} verdict`).toBeLessThanOrEqual(LIMITS.verdict);
        if (c.tag) expect(c.tag.length, `${where} tag`).toBeLessThanOrEqual(LIMITS.tag);
        expect(c.gets.length).toBeGreaterThanOrEqual(1);
        expect(c.gets.length).toBeLessThanOrEqual(2);
        expect(c.costs.length).toBeGreaterThanOrEqual(1);
        expect(c.costs.length).toBeLessThanOrEqual(2);
        for (const line of [...c.gets, ...c.costs]) expect(line.length, `${where} line`).toBeLessThanOrEqual(LIMITS.line);
        if (c.why) expect(c.why.length, `${where} why`).toBeLessThanOrEqual(LIMITS.why);
      }
    }
  });

  it("every answer moves at least one dimension, within range, and the four answers differ in direction", () => {
    for (const s of SCENARIOS) {
      const signatures = new Set<string>();
      for (const c of s.choices) {
        const entries = Object.entries(c.scores);
        expect(entries.length, `${s.id}/${c.id} scores`).toBeGreaterThanOrEqual(1);
        for (const [d, v] of entries) {
          expect(DIMENSIONS).toContain(d);
          expect([-2, -1, 1, 2]).toContain(v);
        }
        signatures.add(
          DIMENSIONS.map((d) => Math.sign(c.scores[d] ?? 0)).join(""),
        );
      }
      expect(signatures.size, `${s.id} answers should not all score alike`).toBeGreaterThanOrEqual(3);
    }
  });

  it("never claims scientific authority", () => {
    const banned = /\b(scientifically|neuroscience|studies show|research proves|clinically|psychologists say)\b/i;
    for (const s of SCENARIOS) {
      const text = s.choices.map((c) => [c.verdict, c.why ?? "", ...c.gets, ...c.costs].join(" ")).join(" ");
      expect(text).not.toMatch(banned);
    }
  });

  it("every category appears at least once", () => {
    const cats = new Set(SCENARIOS.map((s) => s.category));
    expect(cats.size).toBeGreaterThanOrEqual(7);
  });

  it("reads like a person wrote it: no semicolons, no dashes, Australian dollars", () => {
    const strings: string[] = [];
    for (const s of SCENARIOS) {
      strings.push(s.title, s.prompt, ...s.setup);
      for (const c of s.choices) strings.push(c.text, c.verdict, c.tag ?? "", c.why ?? "", ...c.gets, ...c.costs);
    }
    for (const a of Object.values(ARCHETYPES)) strings.push(a.name, a.headline, a.description, ...a.strengths, ...a.watchOuts);
    for (const sc of Object.values(SCIENCE)) strings.push(sc.name, sc.line, sc.source);
    for (const text of strings) {
      expect(text, text).not.toMatch(/[;\u2014\u2013£€]/);
      expect(text, text).not.toMatch(/\b(genuinely|delve|tapestry|testament|navigate|journey|unlock|level up)\b/i);
    }
  });

  it("psychology notes are attached to real scenarios, short, and sourced", () => {
    for (const [id, sc] of Object.entries(SCIENCE)) {
      expect(SCENARIOS.some((s) => s.id === id), `${id} exists`).toBe(true);
      expect(sc.name.length, `${id} name`).toBeLessThanOrEqual(LIMITS.scienceName);
      expect(sc.line.length, `${id} line`).toBeLessThanOrEqual(LIMITS.scienceLine);
      expect(sc.source.length, `${id} source`).toBeLessThanOrEqual(LIMITS.scienceSource);
      expect(sc.source.length, `${id} has a source`).toBeGreaterThan(10);
    }
    expect(SCENARIOS.filter((s) => s.science).length).toBe(Object.keys(SCIENCE).length);
  });
});
