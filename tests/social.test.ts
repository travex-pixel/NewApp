import { describe, expect, it } from "vitest";
import { PACKS, packScenarios, packSet } from "@/lib/content/packs";
import { buildBoard, cleanName, validChoices, validGroupId, type GroupInfo, type GroupMember } from "@/lib/group";
import { dailyNumber, todaysSet } from "@/lib/game/engine";
import { crowdDots, topChoice } from "@/lib/crowd";

describe("packs", () => {
  it("every pack has enough situations for at least one fresh round", () => {
    for (const p of PACKS) expect(packScenarios(p).length, p.id).toBeGreaterThanOrEqual(8);
  });

  it("a pack round is five different situations from that pack, stable for the day", () => {
    for (const p of PACKS) {
      const a = packSet(p, "2026-11-01", 0, []);
      expect(a.length).toBe(5);
      expect(new Set(a.map((s) => s.id)).size).toBe(5);
      for (const s of a) expect(p.categories).toContain(s.category);
      expect(packSet(p, "2026-11-01", 0, []).map((s) => s.id)).toEqual(a.map((s) => s.id));
    }
  });

  it("puts unplayed situations first", () => {
    const p = PACKS[0];
    const first = packSet(p, "2026-11-01", 0, []);
    const next = packSet(p, "2026-11-01", 1, first.map((s) => s.id));
    const fresh = packScenarios(p).length - 5;
    const overlap = next.filter((s) => first.some((f) => f.id === s.id)).length;
    expect(overlap).toBe(Math.max(0, 5 - fresh));
  });
});

describe("daily number", () => {
  it("counts from launch day like Wordle", () => {
    expect(dailyNumber("2026-10-29")).toBe(1);
    expect(dailyNumber("2026-11-01")).toBe(4);
  });
});

describe("crowd helpers", () => {
  it("finds the most picked answer only with enough answers", () => {
    expect(topChoice({ a: 3, b: 30 })).toBe("b");
    expect(topChoice({ a: 3, b: 4 })).toBeNull();
    expect(crowdDots([true, false, true, true, false])).toBe("●○●●○");
  });
});

describe("groups", () => {
  const ids = todaysSet("2026-11-01").map((s) => s.id);
  const group: GroupInfo = { id: "abcd1234", host: "Sam", dateKey: "2026-11-01", roundIds: ids, createdAt: 1 };
  const m = (id: string, name: string, choices: GroupMember["choices"]): GroupMember => ({ id, name, choices, at: 1 });

  it("cleans names and validates answers", () => {
    expect(cleanName("  Sam  ")).toBe("Sam");
    expect(cleanName("<b>Jo</b>")).toBe("bJo/b");
    expect(cleanName("   ")).toBeNull();
    expect(cleanName("x".repeat(50))?.length).toBe(20);
    expect(validChoices(["a", "b", "c", "d", "a"])).toBe(true);
    expect(validChoices(["a", "b", "c", "d"])).toBe(false);
    expect(validChoices(["a", "b", "c", "d", "e"])).toBe(false);
    expect(validGroupId("abcd1234")).toBe(true);
    expect(validGroupId("../etc")).toBe(false);
  });

  it("finds the closest pair, the wildcard and how the group split", () => {
    const board = buildBoard(group, [
      m("1", "Sam", ["a", "b", "c", "d", "a"]),
      m("2", "Alex", ["a", "b", "c", "d", "b"]),
      m("3", "Jo", ["d", "d", "d", "a", "c"]),
      m("4", "Priya", ["a", "b", "a", "d", "a"]),
    ]);
    expect(board.members.length).toBe(4);
    expect(board.members.every((x) => x.archetype && x.archetype.name)).toBe(true);
    expect(board.closest?.matches).toBe(4);
    expect(board.wildcard?.name).toBe("Jo");
    expect(board.splits[0]).toMatchObject({ top: "a", count: 3, of: 4 });
  });

  it("works with one person and shows no wildcard under three", () => {
    const one = buildBoard(group, [m("1", "Sam", ["a", "a", "a", "a", "a"])]);
    expect(one.closest).toBeUndefined();
    expect(one.wildcard).toBeUndefined();
    const two = buildBoard(group, [m("1", "Sam", ["a", "a", "a", "a", "a"]), m("2", "Jo", ["a", "a", "b", "b", "b"])]);
    expect(two.closest?.matches).toBe(2);
    expect(two.wildcard).toBeUndefined();
  });
});
