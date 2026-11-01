import { describe, expect, it } from "vitest";
import { SCENARIOS, type Choice } from "@/lib/content";
import { decodeDuel, encodeDuel, matchFor } from "@/lib/game/duel";
import { todaysSet } from "@/lib/game/engine";
import { MIN_VOTES, shareOf, totalVotes } from "@/lib/crowd";
import { daysPlayed, playedTodaysFive, roundsToday, type ResultRecord } from "@/lib/game/engine";

const IDS: Choice["id"][] = ["a", "b", "c", "d"];

describe("compare-with-a-friend links", () => {
  it("round-trip every day's five with every answer pattern", () => {
    for (let d = 0; d < 20; d++) {
      const set = todaysSet(new Date(Date.UTC(2026, 10, 1 + d)).toISOString().slice(0, 10)).map((s) => s.id);
      for (let n = 0; n < 1024; n += 17) {
        const choices = set.map((_, i) => IDS[Math.floor(n / 4 ** i) % 4]);
        const code = encodeDuel(set, choices)!;
        expect(code).toMatch(/^[a-z0-9]{16}$/);
        const back = decodeDuel(code)!;
        expect(back.round.map((s) => s.id)).toEqual(set);
        expect(back.choices).toEqual(choices);
      }
    }
  });

  it("works for the last scenarios in the library too", () => {
    const ids = SCENARIOS.slice(-5).map((s) => s.id);
    const code = encodeDuel(ids, ["d", "c", "b", "a", "d"])!;
    expect(decodeDuel(code)?.choices).toEqual(["d", "c", "b", "a", "d"]);
  });

  it("doesn't show the answers as plain letters", () => {
    const set = todaysSet("2026-11-01").map((s) => s.id);
    const code = encodeDuel(set, ["a", "a", "a", "a", "a"])!;
    expect(code).not.toMatch(/[a-d]{5}/);
  });

  it("rejects broken, tampered and duplicate links", () => {
    expect(decodeDuel("")).toBeNull();
    expect(decodeDuel("short")).toBeNull();
    expect(decodeDuel("zzzzzzzzzzzzzzzz")).toBeNull();
    const set = todaysSet("2026-11-01").map((s) => s.id);
    const code = encodeDuel(set, ["a", "b", "c", "d", "a"])!;
    const tampered = code.slice(0, 15) + (code[15] === "a" ? "b" : "a");
    expect(decodeDuel(tampered)).toBeNull();
    expect(encodeDuel([set[0], set[0], set[1], set[2], set[3]], ["a", "a", "a", "a", "a"]) && decodeDuel(encodeDuel([set[0], set[0], set[1], set[2], set[3]], ["a", "a", "a", "a", "a"]))).toBeNull();
    expect(encodeDuel(set.slice(0, 4), ["a", "a", "a", "a"])).toBeNull();
  });

  it("counts matches and names them kindly", () => {
    expect(matchFor(["a", "b", "c", "d", "a"], ["a", "b", "c", "d", "a"]).count).toBe(5);
    expect(matchFor(["a", "b", "c", "d", "a"], ["a", "c", "c", "a", "b"]).count).toBe(2);
    for (let k = 0; k <= 5; k++) {
      const m = matchFor(["a", "a", "a", "a", "a"], IDS.slice(0, 1).flatMap(() => Array.from({ length: 5 }, (_, i) => (i < k ? "a" : "b"))) as Choice["id"][]);
      expect(m.count).toBe(k);
      expect(m.title.length).toBeGreaterThan(3);
      expect(m.line).not.toMatch(/[;—–]/);
    }
  });
});

describe("what everyone picked", () => {
  it("shows nothing until there are enough answers", () => {
    expect(shareOf(null, "a")).toBeNull();
    expect(shareOf({ a: MIN_VOTES - 1 }, "a")).toBeNull();
    expect(shareOf({ a: 10, b: 15 }, "a")).toBe(40);
    expect(totalVotes({ a: 1, c: 2 })).toBe(3);
  });

  it("percentages are whole numbers that roughly add to 100", () => {
    const counts = { a: 13, b: 7, c: 29, d: 1 };
    const sum = IDS.reduce((n, id) => n + (shareOf(counts, id) ?? 0), 0);
    expect(sum).toBeGreaterThanOrEqual(98);
    expect(sum).toBeLessThanOrEqual(102);
  });
});

describe("coming back the same day", () => {
  const r = (dateKey: string, kind?: ResultRecord["kind"]): ResultRecord => ({ archetypeId: "table-diplomat", dateKey, at: 1, kind });
  it("knows when today's five is done, ignoring friend rounds", () => {
    expect(playedTodaysFive([], "2026-11-01")).toBe(false);
    expect(playedTodaysFive([r("2026-11-01", "duel")], "2026-11-01")).toBe(false);
    expect(playedTodaysFive([r("2026-11-01", "today")], "2026-11-01")).toBe(true);
    expect(playedTodaysFive([r("2026-11-01")], "2026-11-01")).toBe(true);
    expect(playedTodaysFive([r("2026-10-31", "today")], "2026-11-01")).toBe(false);
  });
  it("counts rounds and days", () => {
    const results = [r("2026-10-30", "today"), r("2026-11-01", "today"), r("2026-11-01", "more"), r("2026-11-01", "duel")];
    expect(roundsToday(results, "2026-11-01")).toBe(2);
    expect(daysPlayed(results)).toBe(2);
  });
});
