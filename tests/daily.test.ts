import { describe, expect, it } from "vitest";
import { SCENARIOS } from "@/lib/content";
import { dailyScenario, dayNumber, formatDailyDate, utcDateKey } from "@/lib/game/daily";

describe("daily challenge", () => {
  it("is stable for a given UTC date", () => {
    expect(dailyScenario("2026-10-29").id).toBe(dailyScenario("2026-10-29").id);
  });

  it("changes day to day and cycles through the whole library without repeats", () => {
    const seen = new Set<string>();
    const start = dayNumber("2026-01-01");
    for (let i = 0; i < SCENARIOS.length; i++) {
      const d = new Date(Date.UTC(2026, 0, 1 + i));
      const key = d.toISOString().slice(0, 10);
      expect(dayNumber(key)).toBe(start + i);
      seen.add(dailyScenario(key).id);
    }
    expect(seen.size).toBe(SCENARIOS.length);
  });

  it("uses UTC, not local time, for the date key", () => {
    const lateEvening = new Date("2026-10-29T23:30:00Z");
    expect(utcDateKey(lateEvening)).toBe("2026-10-29");
    const justAfterMidnight = new Date("2026-10-30T00:10:00Z");
    expect(utcDateKey(justAfterMidnight)).toBe("2026-10-30");
  });

  it("formats a readable date", () => {
    expect(formatDailyDate("2026-10-29")).toBe("Thursday 29 October");
  });
});
