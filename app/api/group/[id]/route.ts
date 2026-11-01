import { connection } from "next/server";
import { cleanName, GROUP_MAX_MEMBERS, GROUP_TTL_SECONDS, validChoices, validGroupId, type GroupInfo, type GroupMember } from "@/lib/group";
import { run, storeEnabled, toPairs } from "@/lib/server/store";

type Ctx = { params: Promise<{ id: string }> };

async function load(id: string): Promise<{ group: GroupInfo; members: GroupMember[] } | null> {
  const [raw, flat] = await run([
    ["GET", `group:${id}`],
    ["HGETALL", `group:${id}:m`],
  ]);
  if (typeof raw !== "string") return null;
  const group = JSON.parse(raw) as GroupInfo;
  const members: GroupMember[] = [];
  for (const [, v] of toPairs(flat)) {
    try {
      const m = JSON.parse(v) as GroupMember;
      if (m && typeof m.name === "string" && validChoices(m.choices)) members.push(m);
    } catch {
      /* skip bad rows */
    }
  }
  members.sort((a, b) => a.at - b.at);
  return { group, members };
}

/** GET: the group and everyone who has played. */
export async function GET(_req: Request, { params }: Ctx) {
  await connection();
  const { id } = await params;
  if (!storeEnabled()) return Response.json({ enabled: false }, { status: 503 });
  if (!validGroupId(id)) return Response.json({ error: "not found" }, { status: 404 });
  try {
    const data = await load(id);
    if (!data) return Response.json({ error: "not found" }, { status: 404 });
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "store unavailable" }, { status: 503 });
  }
}

/** POST { memberId, name, choices }: add or update this phone's answers. */
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!storeEnabled()) return Response.json({ enabled: false }, { status: 503 });
  if (!validGroupId(id)) return Response.json({ error: "not found" }, { status: 404 });
  let body: { memberId?: unknown; name?: unknown; choices?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }
  const name = cleanName(body.name);
  const memberId = typeof body.memberId === "string" && /^[a-z0-9]{6,32}$/.test(body.memberId) ? body.memberId : null;
  if (!name || !memberId || !validChoices(body.choices)) return Response.json({ error: "bad request" }, { status: 400 });

  try {
    const data = await load(id);
    if (!data) return Response.json({ error: "not found" }, { status: 404 });
    const already = data.members.some((m) => m.id === memberId);
    if (!already && data.members.length >= GROUP_MAX_MEMBERS) return Response.json({ error: "group full" }, { status: 409 });
    const member: GroupMember = { id: memberId, name, choices: body.choices, at: Date.now() };
    await run([
      ["HSET", `group:${id}:m`, memberId, JSON.stringify(member)],
      ["EXPIRE", `group:${id}:m`, GROUP_TTL_SECONDS],
    ]);
    const after = await load(id);
    return Response.json(after, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "store unavailable" }, { status: 503 });
  }
}
