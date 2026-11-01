import { SCENARIOS, getScenario, type Choice, type Scenario } from "@/lib/content";

/**
 * "Compare with a friend" links carry a whole round in the URL: the five
 * situations and the sender's five answers. No database. The answers are
 * lightly scrambled so they can't be read off the link at a glance. It's
 * concealment, not security.
 *
 * Format: five 3-character blocks (scenario index in base 36, then a rotated
 * answer digit) and one check character. 16 characters.
 */

const CHOICES: Choice["id"][] = ["a", "b", "c", "d"];
const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

export interface Duel {
  round: Scenario[];
  choices: Choice["id"][];
}

function checksum(s: string): string {
  let h = 11;
  for (let i = 0; i < s.length; i++) h = (h * 37 + s.charCodeAt(i)) % 36;
  return ALPHABET[h];
}

export function encodeDuel(scenarioIds: string[], choices: Choice["id"][]): string | null {
  if (scenarioIds.length !== 5 || choices.length !== 5) return null;
  let body = "";
  for (let i = 0; i < 5; i++) {
    const index = SCENARIOS.findIndex((s) => s.id === scenarioIds[i]);
    const c = CHOICES.indexOf(choices[i]);
    if (index < 0 || c < 0 || index >= 36 * 36) return null;
    body += index.toString(36).padStart(2, "0") + String((c + index + i) % 4);
  }
  return body + checksum(body);
}

export function decodeDuel(code: string | null | undefined): Duel | null {
  if (!code || typeof code !== "string") return null;
  const clean = code.trim().toLowerCase();
  if (!/^[a-z0-9]{16}$/.test(clean)) return null;
  const body = clean.slice(0, 15);
  if (checksum(body) !== clean[15]) return null;
  const round: Scenario[] = [];
  const choices: Choice["id"][] = [];
  for (let i = 0; i < 5; i++) {
    const block = body.slice(i * 3, i * 3 + 3);
    const index = parseInt(block.slice(0, 2), 36);
    const rotated = parseInt(block[2], 10);
    if (!Number.isFinite(index) || !Number.isFinite(rotated) || rotated > 3) return null;
    const meta = SCENARIOS[index];
    if (!meta) return null;
    const scenario = getScenario(meta.id)!;
    if (round.some((s) => s.id === scenario.id)) return null;
    round.push(scenario);
    choices.push(CHOICES[(((rotated - index - i) % 4) + 4) % 4]);
  }
  return { round, choices };
}

export function duelPath(code: string): string {
  return `/d/${code}`;
}

export interface Match {
  count: number;
  title: string;
  line: string;
}

/** How alike two sets of five answers are, said kindly. */
export function matchFor(mine: Choice["id"][], theirs: Choice["id"][]): Match {
  const count = mine.reduce((n, c, i) => n + (c === theirs[i] ? 1 : 0), 0);
  const copy: Record<number, [string, string]> = {
    5: ["Same brain", "Five for five. You'd handle almost anything the same way. Possibly a problem."],
    4: ["Practically twins", "You think alike on nearly everything. The one you split on is worth a chat."],
    3: ["Good balance", "Mostly on the same page, with just enough difference to cover each other's blind spots."],
    2: ["Different instincts", "You'd get to the same place by different roads. Handy in a crisis."],
    1: ["Opposites", "You'd rarely do the same thing. Which makes you very useful to each other."],
    0: ["Chalk and cheese", "Not one match. Every awkward moment, you'd go opposite ways. Iconic."],
  };
  const [title, line] = copy[count];
  return { count, title, line };
}
