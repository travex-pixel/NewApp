import { getScenario } from "@/lib/content";
import { crowdEnabled, recordAndRead } from "@/lib/server/votes";

/**
 * POST { scenarioId, choiceId | null }
 * Records one anonymous answer (when choiceId is set) and returns the counts
 * for that situation. Returns { enabled: false } when no store is connected.
 */
export async function POST(req: Request) {
  if (!crowdEnabled()) return Response.json({ enabled: false });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }
  const { scenarioId, choiceId } = (body ?? {}) as { scenarioId?: unknown; choiceId?: unknown };
  if (typeof scenarioId !== "string" || !getScenario(scenarioId)) {
    return Response.json({ error: "unknown situation" }, { status: 400 });
  }
  if (choiceId !== null && choiceId !== "a" && choiceId !== "b" && choiceId !== "c" && choiceId !== "d") {
    return Response.json({ error: "bad answer" }, { status: 400 });
  }

  const who = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "anon";
  try {
    const counts = await recordAndRead(scenarioId, choiceId, who);
    return Response.json({ enabled: true, counts }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ enabled: false });
  }
}
