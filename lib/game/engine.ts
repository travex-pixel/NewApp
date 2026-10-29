import { ROUND_LENGTH, SCENARIOS, getScenario, type Category, type Choice, type Scenario } from "@/lib/content";
import type { ArchetypeId } from "./archetypes";

/** One answered scenario. */
export interface PlayRecord {
  scenarioId: string;
  choiceId: Choice["id"];
  /** ms since epoch. */
  at: number;
}

export interface ResultRecord {
  archetypeId: ArchetypeId;
  dateKey: string;
  at: number;
}

/** Device-local progress. Nothing personal; nothing synced. */
export interface Progress {
  plays: PlayRecord[];
  results: ResultRecord[];
}

export const EMPTY_PROGRESS: Progress = { plays: [], results: [] };

/* ------------------------------------------------------------------ */
/* Dates. Today's five changes at midnight Sydney time, for everyone, so a
   whole group chat gets the same five whatever phone or time zone they're on.
   Australia/Sydney follows daylight saving, so it's 12am AEST or AEDT. */

export const DAILY_TIME_ZONE = "Australia/Sydney";

/** Today's date in Sydney, YYYY-MM-DD. Safe on server and client. */
export function sydneyDateKey(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: DAILY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function utcDateKey(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function dayNumber(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  return Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(2024, 0, 1)) / 86_400_000);
}

export function formatDayLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

/* ------------------------------------------------------------------ */
/* Deterministic selection. */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const out = [...items];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Greedy pick with category variety from an ordered pool. */
function pickVaried(pool: Scenario[], n: number): Scenario[] {
  const picked: Scenario[] = [];
  const used = new Set<Category>();
  for (const s of pool) {
    if (picked.length >= n) break;
    if (!used.has(s.category)) {
      picked.push(s);
      used.add(s.category);
    }
  }
  for (const s of pool) {
    if (picked.length >= n) break;
    if (!picked.includes(s)) picked.push(s);
  }
  return picked;
}

/** The curated opener: broad, quick, funny. It leads today's five when it's in the pool. */
const OPENERS = ["joke-at-your-expense", "auntie-marriage-question", "the-dinner-bill", "mum-shares-your-news", "the-wallet-forgetter"];

/**
 * Today's five. Same for every player on the same calendar date. Category-varied,
 * and the first situation is always one of the quick, universal openers.
 */
export function todaysSet(dateKey: string): Scenario[] {
  const seed = hash(`day:${dateKey}`);
  const shuffled = seededShuffle(SCENARIOS, seed);
  const opener = OPENERS[dayNumber(dateKey) % OPENERS.length];
  const rest = shuffled.filter((s) => s.id !== opener);
  const first = getScenario(opener);
  const picked = pickVaried(first ? [first, ...rest] : rest, ROUND_LENGTH);
  return picked;
}

/**
 * Another five after today's: unplayed situations first, deterministic per
 * date and round number so a refresh doesn't reshuffle.
 */
export function nextSet(dateKey: string, roundIndex: number, playedIds: Iterable<string>): Scenario[] {
  const played = new Set(playedIds);
  const seed = hash(`day:${dateKey}:round:${roundIndex}`);
  const shuffled = seededShuffle(SCENARIOS, seed);
  const fresh = shuffled.filter((s) => !played.has(s.id));
  const pool = fresh.length >= ROUND_LENGTH ? fresh : [...fresh, ...shuffled.filter((s) => played.has(s.id))];
  return pickVaried(pool, ROUND_LENGTH);
}

export function setFromIds(ids: readonly string[]): Scenario[] | null {
  const out = ids.map((id) => getScenario(id)).filter((s): s is Scenario => Boolean(s));
  return out.length === ids.length && out.length > 0 ? out : null;
}
