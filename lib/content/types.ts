/**
 * Content model for Real Life XP scenarios.
 *
 * Everything here is authored and deterministic. No runtime generation.
 */

export type Category =
  | "reading-the-room"
  | "under-pressure"
  | "awkward"
  | "boundaries"
  | "disagreement"
  | "bias"
  | "uncertainty"
  | "trade-offs"
  | "conflict";

export const CATEGORY_LABELS: Record<Category, string> = {
  "reading-the-room": "Reading the room",
  "under-pressure": "Under pressure",
  awkward: "Awkward moments",
  boundaries: "Boundaries",
  disagreement: "Disagreement",
  bias: "Biases",
  uncertainty: "Incomplete information",
  "trade-offs": "Trade-offs",
  conflict: "Conflict",
};

/** 0 = backfires, 1 = costly, 2 = defensible, 3 = strong read. */
export type Points = 0 | 1 | 2 | 3;

export const POINT_LABELS: Record<Points, string> = {
  3: "Strong read",
  2: "Defensible",
  1: "Costly",
  0: "Backfires",
};

export interface Choice {
  /** Stable within the scenario: "a" | "b" | "c" | "d". */
  id: "a" | "b" | "c" | "d";
  /** What the player says or does. Written in first person, present tense. */
  text: string;
  points: Points;
  /** What this response most likely achieves. One or two sentences. */
  outcome: string;
  /** The downside or missed opportunity. One sentence. Empty string if none worth naming. */
  cost: string;
}

export interface Scenario {
  /** Stable unique ID. Never reuse or renumber. */
  id: string;
  category: Category;
  /** 1 easy, 2 medium, 3 hard (nuance required). */
  difficulty: 1 | 2 | 3;
  /** Short editorial title. Used in share previews. */
  title: string;
  /** The situation, written to the player in second person. 2–4 short paragraphs max. */
  setup: string[];
  /** The question the player answers. Usually "What do you do?" but can be sharper. */
  prompt: string;
  choices: Choice[];
  /** The transferable idea. Title is 2–6 words; body is one or two sentences. */
  principle: { title: string; body: string };
  /** The perceptive-friend reveal. 2–4 sentences, specific to this situation. */
  insight: string;
  /** Optional: when another path is also reasonable, say so honestly. */
  alsoDefensible?: string;
  /** Optional: what we genuinely can't know in this situation. Keeps the game honest. */
  uncertain?: string;
}

export const MAX_POINTS: Points = 3;
