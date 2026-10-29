import { EMPTY_PROGRESS, type PlayRecord, type Progress } from "./engine";

/**
 * Device-local persistence. localStorage only; nothing syncs. Every read and
 * write is wrapped, because storage can be missing or throw in private
 * windows and some in-app browsers.
 */

const KEY = "instinct:progress:v1";

export function loadProgress(): Progress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      plays: Array.isArray(parsed.plays) ? parsed.plays.filter(isPlayRecord) : [],
      roundsCompleted: typeof parsed.roundsCompleted === "number" ? parsed.roundsCompleted : 0,
      dailiesDone: Array.isArray(parsed.dailiesDone)
        ? parsed.dailiesDone.filter((d): d is string => typeof d === "string")
        : [],
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

export function storageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const probe = "instinct:probe";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function isPlayRecord(x: unknown): x is PlayRecord {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.scenarioId === "string" &&
    typeof r.choiceId === "string" &&
    typeof r.points === "number" &&
    typeof r.at === "number"
  );
}
