import {
  CATEGORY_LABELS,
  FIRST_ROUND,
  MAX_POINTS,
  ROUND_LENGTH,
  SCENARIOS,
  getScenario,
  type Category,
  type Choice,
  type Points,
  type Scenario,
} from "@/lib/content";

/** One answered scenario. Stored on the device. */
export interface PlayRecord {
  scenarioId: string;
  choiceId: Choice["id"];
  points: Points;
  /** ms since epoch. */
  at: number;
}

export interface Progress {
  /** Every scenario the player has answered, newest last. */
  plays: PlayRecord[];
  /** Completed rounds of ROUND_LENGTH. */
  roundsCompleted: number;
  /** YYYY-MM-DD (UTC) of daily challenges completed. */
  dailiesDone: string[];
}

export const EMPTY_PROGRESS: Progress = {
  plays: [],
  roundsCompleted: 0,
  dailiesDone: [],
};

/** XP is just points × 10. Honest and legible; nothing hidden. */
export const XP_PER_POINT = 10;

export function xpFor(points: Points): number {
  return points * XP_PER_POINT;
}

export function totalXp(progress: Progress): number {
  return progress.plays.reduce((sum, p) => sum + xpFor(p.points), 0);
}

export function playedIds(progress: Progress): Set<string> {
  return new Set(progress.plays.map((p) => p.scenarioId));
}

/** Deterministic small hash, so round composition is stable per round number. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Builds the next round. First-time players get the curated opener.
 * After that: unplayed scenarios, spread across categories, easier first,
 * shuffled deterministically by round number so a refresh doesn't reshuffle.
 * When everything has been played, rounds recycle the least-recently played.
 */
export function buildRound(progress: Progress): Scenario[] {
  if (progress.plays.length === 0) {
    return FIRST_ROUND.map((id) => getScenario(id)).filter(
      (s): s is Scenario => Boolean(s),
    );
  }

  const played = playedIds(progress);
  let pool = SCENARIOS.filter((s) => !played.has(s.id));

  if (pool.length < ROUND_LENGTH) {
    // Recycle: least-recently played first, excluding anything in the pool.
    const lastPlayed = new Map<string, number>();
    for (const p of progress.plays) lastPlayed.set(p.scenarioId, p.at);
    const recycled = SCENARIOS.filter((s) => played.has(s.id)).sort(
      (a, b) => (lastPlayed.get(a.id) ?? 0) - (lastPlayed.get(b.id) ?? 0),
    );
    pool = [...pool, ...recycled];
  }

  const seed = hash(`round:${progress.roundsCompleted}:${progress.plays.length}`);
  const shuffled = seededShuffle(pool, seed);

  // Greedy pick: prefer a category not yet in the round, lower difficulty first.
  const picked: Scenario[] = [];
  const usedCategories = new Set<Category>();
  const byDifficulty = [...shuffled].sort((a, b) => a.difficulty - b.difficulty);
  for (const s of byDifficulty) {
    if (picked.length >= ROUND_LENGTH) break;
    if (!usedCategories.has(s.category)) {
      picked.push(s);
      usedCategories.add(s.category);
    }
  }
  for (const s of byDifficulty) {
    if (picked.length >= ROUND_LENGTH) break;
    if (!picked.includes(s)) picked.push(s);
  }
  // Within the round, easier first so difficulty rises.
  return picked.sort((a, b) => a.difficulty - b.difficulty).slice(0, ROUND_LENGTH);
}

export interface RoundSummary {
  points: number;
  maxPoints: number;
  xp: number;
  strongReads: number;
  /** Category the player did best in this round, if any had a clear lead. */
  strongest?: string;
  /** Category with the lowest average, if clearly behind. */
  blindSpot?: string;
  /** The scenario where the player lost the most points: the natural one to challenge a friend with. */
  hardest?: Scenario;
}

export function summariseRound(records: PlayRecord[]): RoundSummary {
  const points = records.reduce((s, r) => s + r.points, 0);
  const maxPoints = records.length * MAX_POINTS;
  const xp = records.reduce((s, r) => s + xpFor(r.points), 0);
  const strongReads = records.filter((r) => r.points === MAX_POINTS).length;

  const byCat = new Map<Category, { sum: number; n: number }>();
  let hardest: Scenario | undefined;
  let hardestLoss = -1;
  for (const r of records) {
    const s = getScenario(r.scenarioId);
    if (!s) continue;
    const entry = byCat.get(s.category) ?? { sum: 0, n: 0 };
    entry.sum += r.points;
    entry.n += 1;
    byCat.set(s.category, entry);
    const loss = MAX_POINTS - r.points;
    if (loss > hardestLoss) {
      hardestLoss = loss;
      hardest = s;
    }
  }

  let strongest: string | undefined;
  let blindSpot: string | undefined;
  if (byCat.size >= 2) {
    const ranked = [...byCat.entries()]
      .map(([cat, { sum, n }]) => ({ cat, avg: sum / n }))
      .sort((a, b) => b.avg - a.avg);
    const top = ranked[0];
    const bottom = ranked[ranked.length - 1];
    if (top.avg >= 2.5 && top.avg - bottom.avg >= 1) strongest = CATEGORY_LABELS[top.cat];
    if (bottom.avg <= 1.5 && top.avg - bottom.avg >= 1) blindSpot = CATEGORY_LABELS[bottom.cat];
  }

  // Only call something "hardest" if the player actually dropped points on it.
  if (hardestLoss <= 0) hardest = undefined;

  return { points, maxPoints, xp, strongReads, strongest, blindSpot, hardest };
}

export interface Milestone {
  id: string;
  title: string;
  /** What the player actually did. */
  detail: string;
}

/**
 * Milestones describe real accomplishments. There are deliberately few.
 */
export function milestonesEarned(progress: Progress): Milestone[] {
  const out: Milestone[] = [];
  const n = progress.plays.length;
  const strong = progress.plays.filter((p) => p.points === MAX_POINTS).length;
  const cats = new Set(
    progress.plays
      .map((p) => getScenario(p.scenarioId)?.category)
      .filter((c): c is Category => Boolean(c)),
  );

  if (n >= 1) out.push({ id: "first", title: "First read", detail: "Answered your first situation." });
  if (n >= 5) out.push({ id: "five", title: "Five situations", detail: "Finished a full round." });
  if (n >= 15) out.push({ id: "fifteen", title: "Fifteen situations", detail: "Three rounds in." });
  if (strong >= 5) out.push({ id: "strong5", title: "Five strong reads", detail: "Picked the strongest response five times." });
  if (cats.size >= 6) out.push({ id: "range", title: "Range", detail: "Played across six kinds of situation." });
  if (n >= SCENARIOS.length) out.push({ id: "all", title: "The whole library", detail: "Every situation, at least once." });

  // Three strong reads in a row, anywhere in history.
  let run = 0;
  for (const p of progress.plays) {
    run = p.points === MAX_POINTS ? run + 1 : 0;
    if (run >= 3) {
      out.push({ id: "cold", title: "Cold read", detail: "Three strong reads in a row." });
      break;
    }
  }
  return out;
}

/** Reusable: the label for how a choice did. */
export function verdictFor(points: Points): string {
  switch (points) {
    case 3:
      return "Strong read";
    case 2:
      return "Defensible";
    case 1:
      return "Costly";
    default:
      return "Backfires";
  }
}

/** Short, honest next-step copy after a reveal. Praise only when earned. */
export function nextLine(points: Points, isLast: boolean, nextDifficulty?: number): string {
  if (isLast) return "That's the round.";
  const harder = nextDifficulty && nextDifficulty >= 3 ? "The next one is harder." : "Next one.";
  switch (points) {
    case 3:
      return `Good instinct. ${harder}`;
    case 2:
      return `Reasonable. ${harder}`;
    case 1:
      return `Worth a second look. ${harder}`;
    default:
      return `That one bit. ${harder}`;
  }
}
