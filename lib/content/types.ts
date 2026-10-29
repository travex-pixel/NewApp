/**
 * Content model for Instinct.
 *
 * Everything is authored and deterministic. No runtime generation. Every
 * scenario must fit one phone screen (390×844) in both the situation and the
 * reveal, so the limits below are enforced by tests.
 */

export type Category =
  | "Friends"
  | "Family"
  | "Work"
  | "Group chat"
  | "Dating"
  | "Neighbours"
  | "Flatmates"
  | "Strangers"
  | "Money";

/** The behavioural dimensions every answer nudges. */
export type Dimension =
  | "directness"
  | "diplomacy"
  | "risk"
  | "empathy"
  | "boundaries"
  | "avoidance";

export const DIMENSIONS: readonly Dimension[] = [
  "directness",
  "diplomacy",
  "risk",
  "empathy",
  "boundaries",
  "avoidance",
];

/** -2 … 2 per dimension. Only the dimensions an answer actually moves. */
export type Scores = Partial<Record<Dimension, -2 | -1 | 1 | 2>>;

export interface Choice {
  id: "a" | "b" | "c" | "d";
  /** What the player does. First person, present tense. ≤ 85 chars. */
  text: string;
  /** The verdict headline. Second person, memorable. ≤ 52 chars. */
  verdict: string;
  /** Optional archetype-style tag, e.g. "Diplomatic instinct". ≤ 26 chars. */
  tag?: string;
  /** What it gets you. One or two specific lines, ≤ 95 chars each. */
  gets: string[];
  /** What it costs. One or two specific lines, ≤ 95 chars each. */
  costs: string[];
  /** Optional deeper read, shown inside the drawer. ≤ 220 chars. */
  why?: string;
  scores: Scores;
}

export interface Scenario {
  /** Stable unique ID. Append-only; never renumber. */
  id: string;
  category: Category;
  /** Headline. ≤ 48 chars. */
  title: string;
  /** One or two short paragraphs; ≤ 250 chars in total. */
  setup: string[];
  /** Usually "What do you do?" */
  prompt: string;
  choices: [Choice, Choice, Choice, Choice];
}

export const LIMITS = {
  title: 48,
  setupTotal: 270,
  choiceText: 100,
  verdict: 60,
  tag: 26,
  line: 100,
  why: 220,
} as const;
