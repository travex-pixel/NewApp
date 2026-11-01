import "server-only";

/**
 * A tiny Redis client over Upstash's REST API, used for the crowd counts and
 * group rooms. The Vercel Marketplace integration sets KV_REST_API_URL and
 * KV_REST_API_TOKEN (plain Upstash uses UPSTASH_REDIS_REST_URL and _TOKEN).
 *
 * CROWD_MEMORY=1 runs the same commands against an in-memory copy, for local
 * testing only. Never set it on Vercel: memory isn't shared between servers.
 */

const URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const MEMORY = process.env.CROWD_MEMORY === "1";

export function storeEnabled(): boolean {
  return Boolean(URL && TOKEN) || MEMORY;
}

export type Cmd = (string | number)[];

const strings = new Map<string, string>();
const hashes = new Map<string, Map<string, string>>();

function memExec(cmd: Cmd): unknown {
  const [op, key, ...args] = cmd.map(String);
  switch (op.toUpperCase()) {
    case "GET":
      return strings.get(key) ?? null;
    case "SET":
      strings.set(key, args[0]);
      return "OK";
    case "INCR": {
      const n = Number(strings.get(key) ?? 0) + 1;
      strings.set(key, String(n));
      return n;
    }
    case "EXPIRE":
      return 1;
    case "HSET": {
      const h = hashes.get(key) ?? new Map<string, string>();
      for (let i = 0; i + 1 < args.length; i += 2) h.set(args[i], args[i + 1]);
      hashes.set(key, h);
      return 1;
    }
    case "HINCRBY": {
      const h = hashes.get(key) ?? new Map<string, string>();
      const n = Number(h.get(args[0]) ?? 0) + Number(args[1]);
      h.set(args[0], String(n));
      hashes.set(key, h);
      return n;
    }
    case "HGETALL":
      return [...(hashes.get(key) ?? new Map()).entries()].flat();
    case "HLEN":
      return (hashes.get(key) ?? new Map()).size;
    default:
      throw new Error(`unsupported ${op}`);
  }
}

/** Run commands in one round trip. Throws if the store is off or errors. */
export async function run(cmds: Cmd[]): Promise<unknown[]> {
  if (URL && TOKEN) {
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
  if (MEMORY) return cmds.map(memExec);
  throw new Error("store off");
}

/** Redis HGETALL comes back as a flat [field, value, field, value] list (or an object from some clients). */
export function toPairs(flat: unknown): [string, string][] {
  if (Array.isArray(flat)) {
    const out: [string, string][] = [];
    for (let i = 0; i + 1 < flat.length; i += 2) out.push([String(flat[i]), String(flat[i + 1])]);
    return out;
  }
  if (flat && typeof flat === "object") return Object.entries(flat as Record<string, unknown>).map(([k, v]) => [k, String(v)]);
  return [];
}
