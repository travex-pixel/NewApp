/**
 * "What everyone picked". Real, anonymous counts per situation, stored in
 * Redis (Upstash, via Vercel) when it's connected. Nothing is shown until a
 * situation has enough answers to mean something, and nothing is ever made up.
 */

export type Counts = Partial<Record<"a" | "b" | "c" | "d", number>>;

/** Below this, percentages are noise, so we show nothing. */
export const MIN_VOTES = 25;

export function totalVotes(counts: Counts): number {
  return (["a", "b", "c", "d"] as const).reduce((n, k) => n + (counts[k] ?? 0), 0);
}

/** Whole-number percentage for one answer, or null if there aren't enough answers yet. */
export function shareOf(counts: Counts | null | undefined, choiceId: string): number | null {
  if (!counts) return null;
  const total = totalVotes(counts);
  if (total < MIN_VOTES) return null;
  return Math.round((100 * (counts[choiceId as keyof Counts] ?? 0)) / total);
}

/* ------------------------------------------------------------------ */
/* Browser side: vote once per situation per device, then read counts. */

const VOTED_KEY = "instinct:voted:v1";

function votedSet(): Set<string> {
  try {
    const raw = window.localStorage.getItem(VOTED_KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return new Set(Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

function markVoted(id: string) {
  try {
    const s = votedSet();
    s.add(id);
    window.localStorage.setItem(VOTED_KEY, JSON.stringify([...s]));
  } catch {
    /* unavailable */
  }
}

/**
 * Records this device's first answer to a situation and returns the counts.
 * Returns null when the crowd isn't connected or anything goes wrong; the
 * game simply doesn't show percentages then.
 */
export async function voteAndRead(scenarioId: string, choiceId: string): Promise<Counts | null> {
  const already = votedSet().has(scenarioId);
  try {
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenarioId, choiceId: already ? null : choiceId }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { enabled?: boolean; counts?: Counts };
    if (!data.enabled || !data.counts) return null;
    if (!already) markVoted(scenarioId);
    return data.counts;
  } catch {
    return null;
  }
}
