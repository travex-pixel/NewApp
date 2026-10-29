import type { PlayRecord } from "./engine";

/**
 * The round in progress, kept in sessionStorage so a refresh (common in
 * in-app browsers) resumes where the player was instead of restarting.
 *
 * Three states are explicit:
 *   - no session            → start a new round
 *   - session, index < 5    → resume (the reveal re-shows if already answered)
 *   - session, finished     → show the result again
 */

const KEY = "instinct:round:v2";

export interface RoundSession {
  dateKey: string;
  roundIndex: number;
  roundIds: string[];
  index: number;
  records: PlayRecord[];
  finished: boolean;
}

export function loadSession(): RoundSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<RoundSession>;
    if (
      typeof s.dateKey !== "string" ||
      typeof s.roundIndex !== "number" ||
      !Array.isArray(s.roundIds) ||
      typeof s.index !== "number" ||
      !Array.isArray(s.records)
    )
      return null;
    if (s.roundIds.length === 0 || s.index < 0 || s.index >= s.roundIds.length) return null;
    return {
      dateKey: s.dateKey,
      roundIndex: s.roundIndex,
      roundIds: s.roundIds,
      index: s.index,
      records: s.records,
      finished: Boolean(s.finished),
    };
  } catch {
    return null;
  }
}

export function saveSession(s: RoundSession): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* unavailable */
  }
}

export function clearSession(): void {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* unavailable */
  }
}
