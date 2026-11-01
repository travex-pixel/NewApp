import type { Choice } from "@/lib/content";
import { getScenario } from "@/lib/content";
import { auraFor, type Archetype } from "@/lib/game/archetypes";

/**
 * Group mode: one link for a whole group chat. Everyone plays the same five
 * and lands on a shared board. Shared by the API (server) and the room (client).
 */

export interface GroupInfo {
  id: string;
  host: string;
  dateKey: string;
  roundIds: string[];
  createdAt: number;
}

export interface GroupMember {
  id: string;
  name: string;
  choices: Choice["id"][];
  at: number;
}

export const NAME_MAX = 20;
export const GROUP_MAX_MEMBERS = 40;
export const GROUP_TTL_SECONDS = 60 * 60 * 24 * 30;

export function cleanName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const name = raw.replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, NAME_MAX);
  return name.length ? name : null;
}

export function validChoices(raw: unknown): raw is Choice["id"][] {
  return Array.isArray(raw) && raw.length === 5 && raw.every((c) => c === "a" || c === "b" || c === "c" || c === "d");
}

export function validGroupId(id: string): boolean {
  return /^[a-z0-9]{8}$/.test(id);
}

export interface BoardMember extends GroupMember {
  archetype: Archetype;
}

export interface Board {
  members: BoardMember[];
  closest?: { a: BoardMember; b: BoardMember; matches: number };
  wildcard?: BoardMember;
  /** For each situation: the most picked answer and how many picked it. */
  splits: { title: string; top: Choice["id"]; count: number; of: number }[];
}

function matches(x: Choice["id"][], y: Choice["id"][]): number {
  return x.reduce((n, c, i) => n + (c === y[i] ? 1 : 0), 0);
}

/** Who's who: auras, the closest pair, the wildcard, and how the group split. */
export function buildBoard(group: GroupInfo, members: GroupMember[]): Board {
  const withAura: BoardMember[] = members.map((m) => ({
    ...m,
    archetype: auraFor(group.roundIds.map((id, i) => ({ scenarioId: id, choiceId: m.choices[i] }))).archetype,
  }));

  let closest: Board["closest"];
  for (let i = 0; i < withAura.length; i++) {
    for (let j = i + 1; j < withAura.length; j++) {
      const n = matches(withAura[i].choices, withAura[j].choices);
      if (!closest || n > closest.matches) closest = { a: withAura[i], b: withAura[j], matches: n };
    }
  }

  let wildcard: BoardMember | undefined;
  if (withAura.length >= 3) {
    let low = Infinity;
    for (const m of withAura) {
      const avg = withAura.filter((o) => o.id !== m.id).reduce((n, o) => n + matches(m.choices, o.choices), 0) / (withAura.length - 1);
      if (avg < low) {
        low = avg;
        wildcard = m;
      }
    }
  }

  const splits = group.roundIds.map((id, i) => {
    const tally: Record<string, number> = {};
    for (const m of withAura) tally[m.choices[i]] = (tally[m.choices[i]] ?? 0) + 1;
    const [top, count] = Object.entries(tally).sort((a, b) => b[1] - a[1])[0] ?? ["a", 0];
    return { title: getScenario(id)?.title ?? "", top: top as Choice["id"], count, of: withAura.length };
  });

  return { members: withAura, closest, wildcard, splits };
}
