import { SCENARIOS, type Category, type Scenario } from "./index";

/** Themed packs: five situations from one corner of life. */
export interface Pack {
  id: string;
  name: string;
  blurb: string;
  categories: Category[];
}

export const PACKS: Pack[] = [
  { id: "family", name: "Family", blurb: "Aunties, in-laws, Christmas and the family group chat.", categories: ["Family"] },
  { id: "love", name: "Love", blurb: "Dates, partners, exes and the things you don't say.", categories: ["Dating"] },
  { id: "friends", name: "Friends", blurb: "Mates, group chats and the plans you didn't want.", categories: ["Friends", "Group chat"] },
  { id: "work", name: "Work", blurb: "Bosses, credit, meetings and the 6pm favour.", categories: ["Work"] },
  { id: "money", name: "Money", blurb: "Bills, loans, tradies and who pays.", categories: ["Money"] },
  { id: "home", name: "Home", blurb: "Housemates, neighbours, bins and 1am parties.", categories: ["Housemates", "Neighbours", "Strangers"] },
];

export function getPack(id: string): Pack | undefined {
  return PACKS.find((p) => p.id === id);
}

export function packScenarios(pack: Pack): Scenario[] {
  return SCENARIOS.filter((s) => pack.categories.includes(s.category));
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Five from a pack: ones you haven't played first, then the rest. Stable for
 * the same day and round, so a refresh doesn't reshuffle.
 */
export function packSet(pack: Pack, dateKey: string, roundIndex: number, played: Iterable<string>): Scenario[] {
  const seen = new Set(played);
  const all = packScenarios(pack);
  let s = hash(`${pack.id}:${dateKey}:${roundIndex}`) || 1;
  const shuffled = [...all];
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const fresh = shuffled.filter((x) => !seen.has(x.id));
  const rest = shuffled.filter((x) => seen.has(x.id));
  return [...fresh, ...rest].slice(0, 5);
}
