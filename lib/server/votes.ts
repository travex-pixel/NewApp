import "server-only";
import type { Counts } from "@/lib/crowd";
import { run, storeEnabled, toPairs } from "./store";

/** Anonymous answer counts per situation, for "what everyone picked". */

export const crowdEnabled = storeEnabled;

/** Per-address limit on votes, per minute. Reads are not limited. */
const VOTES_PER_MINUTE = 40;

function toCounts(flat: unknown): Counts {
  const counts: Counts = {};
  for (const [k, v] of toPairs(flat)) {
    if (k === "a" || k === "b" || k === "c" || k === "d") counts[k] = Number(v) || 0;
  }
  return counts;
}

export async function recordAndRead(scenarioId: string, choiceId: "a" | "b" | "c" | "d" | null, who: string): Promise<Counts> {
  const key = `votes:${scenarioId}`;
  if (choiceId) {
    const rateKey = `rl:${who}:${Math.floor(Date.now() / 60_000)}`;
    const [n] = await run([
      ["INCR", rateKey],
      ["EXPIRE", rateKey, 120],
    ]);
    if (Number(n) <= VOTES_PER_MINUTE) {
      const [, flat] = await run([
        ["HINCRBY", key, choiceId, 1],
        ["HGETALL", key],
      ]);
      return toCounts(flat);
    }
  }
  const [flat] = await run([["HGETALL", key]]);
  return toCounts(flat);
}
