import { todaysSet, sydneyDateKey } from "@/lib/game/engine";
import { cleanName, GROUP_TTL_SECONDS, type GroupInfo } from "@/lib/group";
import { run, storeEnabled } from "@/lib/server/store";

/** POST { name } creates a group for today's five and returns its id. */
export async function POST(req: Request) {
  if (!storeEnabled()) return Response.json({ enabled: false }, { status: 503 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }
  const host = cleanName((body as { name?: unknown })?.name);
  if (!host) return Response.json({ error: "name needed" }, { status: 400 });

  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const dateKey = sydneyDateKey();
  const group: GroupInfo = { id, host, dateKey, roundIds: todaysSet(dateKey).map((s) => s.id), createdAt: Date.now() };
  try {
    await run([["SET", `group:${id}`, JSON.stringify(group), "EX", GROUP_TTL_SECONDS]]);
  } catch {
    return Response.json({ error: "store unavailable" }, { status: 503 });
  }
  return Response.json({ id });
}
