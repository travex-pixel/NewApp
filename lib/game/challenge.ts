import { SCENARIOS, getScenario, type Choice, type Scenario } from "@/lib/content";

/**
 * Challenge codes carry the whole challenge in the URL: which scenario, and
 * what the challenger chose. No database. The choice is lightly obscured so
 * the recipient can't read it off the link before answering; this is
 * concealment, not security, and it's documented as such.
 *
 * Format: <scenarioIndex base36, 2 chars><rotated choice digit><check char>.
 * Scenario index is positional in SCENARIOS, which is append-only.
 */

const CHOICES: Choice["id"][] = ["a", "b", "c", "d"];
const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

export interface Challenge {
  scenario: Scenario;
  choiceId: Choice["id"];
}

function checksum(s: string): string {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 36;
  return ALPHABET[h];
}

export function encodeChallenge(scenarioId: string, choiceId: Choice["id"]): string | null {
  const index = SCENARIOS.findIndex((s) => s.id === scenarioId);
  const choiceIndex = CHOICES.indexOf(choiceId);
  if (index < 0 || choiceIndex < 0) return null;
  const rotated = (choiceIndex + index) % 4;
  const body = index.toString(36).padStart(2, "0") + rotated.toString();
  return body + checksum(body);
}

export function decodeChallenge(code: string | undefined | null): Challenge | null {
  if (!code || typeof code !== "string") return null;
  const clean = code.trim().toLowerCase();
  if (!/^[a-z0-9]{4}$/.test(clean)) return null;
  const body = clean.slice(0, 3);
  if (checksum(body) !== clean[3]) return null;
  const index = parseInt(body.slice(0, 2), 36);
  const rotated = parseInt(body[2], 10);
  if (!Number.isFinite(index) || !Number.isFinite(rotated) || rotated > 3) return null;
  const scenario = SCENARIOS[index];
  if (!scenario) return null;
  const choiceId = CHOICES[(((rotated - index) % 4) + 4) % 4];
  if (!scenario.choices.some((c) => c.id === choiceId)) return null;
  return { scenario: getScenario(scenario.id)!, choiceId };
}

export function challengePath(code: string): string {
  return `/c/${code}`;
}
