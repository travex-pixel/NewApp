import type { PlayRecord } from "./engine";

/**
 * The in-progress round, kept in sessionStorage so a refresh (common in
 * in-app browsers) resumes where the player was instead of restarting.
 * Cleared when the round's result is shown.
 */

const KEY = "instinct:round:v1";

export interface RoundSession {
  roundIds: string[];
  index: number;
  records: PlayRecord[];
}

export function loadSession(): RoundSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<RoundSession>;
    if (!Array.isArray(s.roundIds) || typeof s.index !== "number" || !Array.isArray(s.records)) return null;
    if (s.index < 0 || s.index >= s.roundIds.length) return null;
    return { roundIds: s.roundIds, index: s.index, records: s.records };
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
