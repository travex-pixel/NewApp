import { SCENARIOS, type Scenario } from "@/lib/content";

/**
 * Daily challenge.
 *
 * Timezone strategy: the day boundary is UTC midnight, everywhere. It's the
 * only choice that gives every player the same scenario on the same calendar
 * date without a server, and it's simple to explain: "resets at midnight UTC".
 * The UI shows the date it's using.
 */

export function utcDateKey(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** Days since 2024-01-01 UTC. Stable across machines. */
export function dayNumber(dateKey: string): number {
  const epoch = Date.UTC(2024, 0, 1);
  const [y, m, d] = dateKey.split("-").map(Number);
  return Math.floor((Date.UTC(y, m - 1, d) - epoch) / 86_400_000);
}

/**
 * Walks the library with a step coprime to its length, so every scenario
 * appears exactly once per cycle and consecutive days never repeat.
 */
function coprimeStep(n: number): number {
  const candidates = [7, 11, 13, 17, 19, 23];
  for (const c of candidates) if (gcd(c, n) === 1 && c < n) return c;
  return 1;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function dailyScenario(dateKey: string = utcDateKey()): Scenario {
  const n = SCENARIOS.length;
  const step = coprimeStep(n);
  const idx = (((dayNumber(dateKey) * step) % n) + n) % n;
  return SCENARIOS[idx];
}

/** Human date for the UI, e.g. "Wednesday 29 October". */
export function formatDailyDate(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}
