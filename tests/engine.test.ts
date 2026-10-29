import { describe, expect, it } from "vitest";
import { ROUND_LENGTH, SCENARIOS } from "@/lib/content";
import { dayNumber, formatDayLabel, nextSet, setFromIds, sydneyDateKey, todaysSet, utcDateKey } from "@/lib/game/engine";

describe("today's five", () => {
  it("is deterministic for a date and category-varied", () => {
    const a = todaysSet("2026-10-29").map((s) => s.id);
    const b = todaysSet("2026-10-29").map((s) => s.id);
    expect(a).toEqual(b);
    expect(a.length).toBe(ROUND_LENGTH);
    expect(new Set(a).size).toBe(ROUND_LENGTH);
    const cats = new Set(todaysSet("2026-10-29").map((s) => s.category));
    expect(cats.size).toBeGreaterThanOrEqual(4);
  });

  it("changes from day to day", () => {
    const days = ["2026-10-29", "2026-10-30", "2026-10-31", "2026-11-01"];
    const sets = days.map((d) => todaysSet(d).map((s) => s.id).join(","));
    expect(new Set(sets).size).toBe(days.length);
  });

  it("opens with a quick, universal situation", () => {
    const openers = ["joke-at-your-expense", "auntie-marriage-question", "the-dinner-bill", "mum-shares-your-news", "the-wallet-forgetter"];
    for (const d of ["2026-10-29", "2026-11-11", "2027-01-05"]) {
      expect(openers).toContain(todaysSet(d)[0].id);
    }
  });

  it("uses UTC for the day key", () => {
    expect(utcDateKey(new Date("2026-10-29T23:30:00Z"))).toBe("2026-10-29");
    expect(utcDateKey(new Date("2026-10-30T00:10:00Z"))).toBe("2026-10-30");
    expect(dayNumber("2024-01-02")).toBe(1);
    expect(formatDayLabel("2026-10-29")).toBe("Thursday 29 October");
  });
});

describe("another five", () => {
  it("prefers unplayed situations and is stable per round number", () => {
    const today = todaysSet("2026-10-29").map((s) => s.id);
    const next = nextSet("2026-10-29", 1, today);
    expect(next.length).toBe(ROUND_LENGTH);
    for (const s of next) expect(today).not.toContain(s.id);
    expect(nextSet("2026-10-29", 1, today).map((s) => s.id)).toEqual(next.map((s) => s.id));
    expect(nextSet("2026-10-29", 2, today).map((s) => s.id)).not.toEqual(next.map((s) => s.id));
  });

  it("recycles once everything has been played", () => {
    const all = SCENARIOS.map((s) => s.id);
    const set = nextSet("2026-10-29", 9, all);
    expect(set.length).toBe(ROUND_LENGTH);
    expect(new Set(set.map((s) => s.id)).size).toBe(ROUND_LENGTH);
  });
});

describe("setFromIds", () => {
  it("restores a round from ids and rejects unknown ones", () => {
    const ids = todaysSet("2026-10-29").map((s) => s.id);
    expect(setFromIds(ids)?.map((s) => s.id)).toEqual(ids);
    expect(setFromIds([...ids, "nope"])).toBeNull();
    expect(setFromIds([])).toBeNull();
  });
});

describe("the daily reset is midnight Sydney time", () => {
  it("rolls over at 12am in Sydney, not UTC", () => {
    // 29 Oct 2026, daylight saving (AEDT, UTC+11). 12:59pm UTC is 11:59pm Sydney.
    expect(sydneyDateKey(new Date("2026-10-29T12:59:00Z"))).toBe("2026-10-29");
    // One minute later it's midnight in Sydney: a new day, though UTC is still the 29th.
    expect(sydneyDateKey(new Date("2026-10-29T13:00:00Z"))).toBe("2026-10-30");
    expect(utcDateKey(new Date("2026-10-29T13:00:00Z"))).toBe("2026-10-29");
  });

  it("follows daylight saving: in winter midnight Sydney is 2pm UTC", () => {
    // 15 June 2026, standard time (AEST, UTC+10).
    expect(sydneyDateKey(new Date("2026-06-15T13:59:00Z"))).toBe("2026-06-15");
    expect(sydneyDateKey(new Date("2026-06-15T14:00:00Z"))).toBe("2026-06-16");
  });

  it("is the same for everyone at the same instant", () => {
    const instant = new Date("2026-10-30T02:00:00Z");
    expect(sydneyDateKey(instant)).toBe("2026-10-30");
    expect(todaysSet(sydneyDateKey(instant)).map((s) => s.id)).toEqual(todaysSet("2026-10-30").map((s) => s.id));
  });
});
