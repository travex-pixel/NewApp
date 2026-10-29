import { EMPTY_PROGRESS, type PlayRecord, type Progress, type ResultRecord } from "./engine";
import { isArchetypeId } from "./archetypes";

/**
 * Device-local persistence. localStorage only; nothing syncs. Every read and
 * write is wrapped, because storage can be missing or throw in private
 * windows and some in-app browsers. Malformed data is dropped, not trusted.
 */

const KEY = "instinct:progress:v2";

export function loadProgress(): Progress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      plays: Array.isArray(parsed.plays) ? parsed.plays.filter(isPlayRecord) : [],
      results: Array.isArray(parsed.results) ? parsed.results.filter(isResultRecord) : [],
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(progress: Progress): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

function isPlayRecord(x: unknown): x is PlayRecord {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return typeof r.scenarioId === "string" && typeof r.choiceId === "string" && typeof r.at === "number";
}

function isResultRecord(x: unknown): x is ResultRecord {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return typeof r.archetypeId === "string" && isArchetypeId(r.archetypeId) && typeof r.dateKey === "string" && typeof r.at === "number";
}
