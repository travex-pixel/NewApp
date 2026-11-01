import "server-only";
import type { Counts } from "@/lib/crowd";

/**
 * Vote storage. Uses Upstash Redis over its REST API when connected (the
 * Vercel Marketplace integration sets KV_REST_API_URL and KV_REST_API_TOKEN;
 * plain Upstash uses UPSTASH_REDIS_REST_URL and _TOKEN). For local testing
 * only, CROWD_MEMORY=1 keeps counts in memory. Otherwise the crowd is off.
 */

const URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
/** Local testing only. Never set this on Vercel: memory isn't shared between servers. */
const MEMORY = process.env.CROWD_MEMORY === "1";

const mem = new Map<string, Counts>();
const memRate = new Map<string, number>();

export function crowdEnabled(): boolean {
  return Boolean(URL && TOKEN) || MEMORY;
}

/** Per-address limit on votes, per minute. Reads are not limited. */
const VOTES_PER_MINUTE = 40;

type Cmd = (string | number)[];

async function pipeline(cmds: Cmd[]): Promise<unknown[]> {
  const res = await fetch(`${URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const out = (await res.json()) as { result?: unknown; error?: string }[];
  return out.map((r) => {
    if (r.error) throw new Error(r.error);
    return r.result;
  });
}

function toCounts(flat: unknown): Counts {
  const counts: Counts = {};
  if (Array.isArray(flat)) {
    for (let i = 0; i + 1 < flat.length; i += 2) {
      const k = String(flat[i]);
      if (k === "a" || k === "b" || k === "c" || k === "d") counts[k] = Number(flat[i + 1]) || 0;
    }
  } else if (flat && typeof flat === "object") {
    for (const [k, v] of Object.entries(flat as Record<string, unknown>)) {
      if (k === "a" || k === "b" || k === "c" || k === "d") counts[k] = Number(v) || 0;
    }
  }
  return counts;
}

export async function recordAndRead(scenarioId: string, choiceId: "a" | "b" | "c" | "d" | null, who: string): Promise<Counts> {
  const key = `votes:${scenarioId}`;
  const minute = Math.floor(Date.now() / 60_000);
  const rateKey = `rl:${who}:${minute}`;

  if (!(URL && TOKEN)) {
    let allowed = true;
    if (choiceId) {
      const n = (memRate.get(rateKey) ?? 0) + 1;
      memRate.set(rateKey, n);
      allowed = n <= VOTES_PER_MINUTE;
    }
    const c = { ...(mem.get(key) ?? {}) };
    if (choiceId && allowed) c[choiceId] = (c[choiceId] ?? 0) + 1;
    mem.set(key, c);
    return c;
  }

  if (choiceId) {
    const [n] = await pipeline([
      ["INCR", rateKey],
      ["EXPIRE", rateKey, 120],
    ]);
    if (Number(n) <= VOTES_PER_MINUTE) {
      const [, flat] = await pipeline([
        ["HINCRBY", key, choiceId, 1],
        ["HGETALL", key],
      ]);
      return toCounts(flat);
    }
  }
  const [flat] = await pipeline([["HGETALL", key]]);
  return toCounts(flat);
}
