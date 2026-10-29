import { DIMENSIONS, getScenario, type Choice, type Dimension } from "@/lib/content";

/**
 * The social aura: a behavioural archetype computed from five answers.
 *
 * Every answer nudges a few dimensions. Totals are mapped to an archetype
 * by explicit rules, in priority order. Many different answer patterns reach
 * the same archetype; genuinely different patterns reach different ones.
 * None of this measures a person. It describes a pattern of five choices.
 */

export type Totals = Record<Dimension, number>;

export interface AnswerLike {
  scenarioId: string;
  choiceId: Choice["id"];
}

export function totalsFor(answers: AnswerLike[]): Totals {
  const t = Object.fromEntries(DIMENSIONS.map((d) => [d, 0])) as Totals;
  for (const a of answers) {
    const choice = getScenario(a.scenarioId)?.choices.find((c) => c.id === a.choiceId);
    if (!choice) continue;
    for (const d of DIMENSIONS) t[d] += choice.scores[d] ?? 0;
  }
  return t;
}

export type ArchetypeId =
  | "velvet-hammer"
  | "truth-teller"
  | "table-diplomat"
  | "boundary-architect"
  | "escape-artist"
  | "people-pleaser"
  | "accidental-therapist"
  | "chaos-mediator"
  | "quiet-strategist"
  | "social-risk-taker"
  | "professional-overthinker";

export interface Archetype {
  id: ArchetypeId;
  name: string;
  /** The roast. One line, affectionate. */
  headline: string;
  /** Two or three sentences. */
  description: string;
  strengths: string[];
  watchOuts: string[];
  /** A short line for share text. */
  tagline: string;
  /** Which of the fork's branches lights up on the card: a small visual signature. */
  motif: "split" | "merge" | "straight" | "loop" | "pause" | "leap";
}

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  "velvet-hammer": {
    id: "velvet-hammer",
    name: "The Velvet Hammer",
    headline: "You say the hard thing so nicely people thank you for it.",
    description:
      "Direct and diplomatic at the same time, which most people think is a contradiction. You name the problem, keep the person, and somehow the meeting ends on time.",
    strengths: ["Honest without being harsh", "Keeps relationships through hard conversations", "Trusted to deliver news"],
    watchOuts: ["People may not notice they've been told", "You can over-engineer a simple 'no'"],
    tagline: "Honest, gently. Devastating, politely.",
    motif: "merge",
  },
  "truth-teller": {
    id: "truth-teller",
    name: "The Unfiltered Truth-Teller",
    headline: "You've never once let a moment be awkward in peace.",
    description:
      "You say it. In the room, out loud, while it's happening. People know exactly where they stand with you, which is a gift and occasionally a shock.",
    strengths: ["Nobody has to guess what you think", "You stop bad plans early", "Brave in rooms that need it"],
    watchOuts: ["Right message, wrong moment, sometimes", "The audience hears the delivery, not the point"],
    tagline: "Says the quiet part. Loudly. Correctly.",
    motif: "straight",
  },
  "table-diplomat": {
    id: "table-diplomat",
    name: "The Table Diplomat",
    headline: "You've defused more dinners than the fire brigade.",
    description:
      "You read the table before you read the menu. You find the phrasing that lets everyone keep their dignity, and you make it look like nothing happened.",
    strengths: ["Keeps groups together", "Finds the exit nobody else saw", "Rarely makes an enemy"],
    watchOuts: ["Your own point can go missing", "Peace now sometimes means the same problem later"],
    tagline: "Everyone leaves happy. Nobody knows how.",
    motif: "merge",
  },
  "boundary-architect": {
    id: "boundary-architect",
    name: "The Boundary Architect",
    headline: "Your 'no' has load-bearing walls.",
    description:
      "You know what you're prepared to do and you say so, early and without drama. People stop asking the third time. You're mostly fine with that.",
    strengths: ["Clear and consistent", "Can't be guilt-tripped", "Protects your own time and energy"],
    watchOuts: ["A no with no alternative can land cold", "Sometimes the request was actually fine"],
    tagline: "Clear lines. Calm voice. No exceptions.",
    motif: "straight",
  },
  "escape-artist": {
    id: "escape-artist",
    name: "The Social Escape Artist",
    headline: "You've never lost an argument you didn't turn up to.",
    description:
      "Why have the conversation when you can have the kitchen, the bread, or a sudden interest in the weather? You keep things calm. The things keep.",
    strengths: ["Never escalates", "Genuinely low drama", "Excellent at letting small things stay small"],
    watchOuts: ["Big things also stay", "Silence gets read as a maybe"],
    tagline: "Conflict can't find you. Neither can resolution.",
    motif: "loop",
  },
  "people-pleaser": {
    id: "people-pleaser",
    name: "The Certified People Pleaser",
    headline: "You've paid £62 for a £24 dinner and said thank you.",
    description:
      "You notice what everyone needs and quietly provide it, usually at your own expense. People love having you around. You'd like, occasionally, to be asked.",
    strengths: ["Kind by reflex", "Keeps the peace, every time", "Nobody feels left out near you"],
    watchOuts: ["Your yes is cheap because it's never no", "Resentment compounds quietly"],
    tagline: "Everyone's favourite. Including the people taking advantage.",
    motif: "merge",
  },
  "accidental-therapist": {
    id: "accidental-therapist",
    name: "The Accidental Therapist",
    headline: "Strangers tell you about their divorce before their name.",
    description:
      "You ask the question under the question. People open up to you in kitchens, queues and group chats, and you handle it well. You just didn't plan to.",
    strengths: ["Reads what people actually mean", "Makes room without pushing", "Trusted with the real stuff"],
    watchOuts: ["Your own needs are rarely on the agenda", "Not every moment needs understanding; some need a decision"],
    tagline: "Hears what wasn't said. Says what helps.",
    motif: "pause",
  },
  "chaos-mediator": {
    id: "chaos-mediator",
    name: "The Chaos Mediator",
    headline: "You improvise peace treaties at 7am with no coffee.",
    description:
      "When it all goes sideways, you're the one who says the funny, true thing that resets the room. Part diplomat, part gambler, all instinct.",
    strengths: ["Thinks fast under pressure", "Warm and bold in the same breath", "Turns tension into a story everyone tells later"],
    watchOuts: ["The gamble doesn't always land", "You can skip the quieter fix that would've worked"],
    tagline: "Reads the room. Then rearranges it.",
    motif: "leap",
  },
  "quiet-strategist": {
    id: "quiet-strategist",
    name: "The Quiet Strategist",
    headline: "You've already thought about what you'll say next Tuesday.",
    description:
      "You rarely react in the moment. You wait, choose the time, choose the words, and then you say exactly enough. People underestimate you. Once.",
    strengths: ["Picks the right moment", "Low drama, high effect", "Never says a thing you'll have to take back"],
    watchOuts: ["Waiting can look like not noticing", "Some moments are only available once"],
    tagline: "Says less. Lands more.",
    motif: "pause",
  },
  "social-risk-taker": {
    id: "social-risk-taker",
    name: "The Social Risk-Taker",
    headline: "You'd rather be the story than hear it second-hand.",
    description:
      "You go first. Into the circle, into the awkward silence, into the thing nobody else will say. It works more often than it should, and it's never boring.",
    strengths: ["Breaks the ice, every time", "Fearless in rooms of strangers", "Makes things happen"],
    watchOuts: ["Not everyone wanted the ice broken", "The bold move can cost the quiet person"],
    tagline: "Leaps first. Looks later. Usually fine.",
    motif: "leap",
  },
  "professional-overthinker": {
    id: "professional-overthinker",
    name: "The Professional Overthinker",
    headline: "You've considered every option, including the ones nobody offered.",
    description:
      "No single instinct runs your show. You weigh it, each time, from scratch: sometimes direct, sometimes diplomatic, sometimes the bread. Your friends call it balanced. You call it 2am.",
    strengths: ["Genuinely adaptable", "Sees every side (sometimes all at once)", "Hard to predict, hard to play"],
    watchOuts: ["Consistency is also a kindness", "Occasionally the first instinct was right"],
    tagline: "Balanced. Considered. Still thinking about it.",
    motif: "split",
  },
};

export const ARCHETYPE_IDS = Object.keys(ARCHETYPES) as ArchetypeId[];

export function isArchetypeId(x: string): x is ArchetypeId {
  return x in ARCHETYPES;
}

/**
 * The mapping works on the *shape* of the totals, not absolute numbers:
 * which dimension leads, whether a second one runs close to it, and a few
 * combinations that mean something specific together. Flat profiles get
 * the Overthinker; everything else is decided by the lead or the pair.
 */
export function archetypeFor(t: Totals): Archetype {
  const ranked = DIMENSIONS.map((d) => ({ d, v: t[d] })).sort((a, b) => b.v - a.v);
  const [p, q] = ranked;
  const pair = (a: Dimension, b: Dimension) => (p.d === a && q.d === b) || (p.d === b && q.d === a);

  let id: ArchetypeId;

  if (p.v <= 2) {
    id = "professional-overthinker";
  } else if (q.v >= 3 && p.v - q.v <= 2) {
    // Two instincts running together.
    if (pair("directness", "diplomacy")) id = "velvet-hammer";
    else if (pair("directness", "empathy")) id = "velvet-hammer";
    else if (pair("avoidance", "empathy")) id = "people-pleaser";
    else if (pair("avoidance", "diplomacy")) id = "table-diplomat";
    else if (pair("avoidance", "boundaries")) id = "quiet-strategist";
    else if (pair("risk", "directness")) id = "social-risk-taker";
    else if (pair("risk", "boundaries")) id = "social-risk-taker";
    else if (pair("risk", "diplomacy") || pair("risk", "empathy")) id = "chaos-mediator";
    else if (pair("empathy", "diplomacy")) id = t.risk >= 1 ? "chaos-mediator" : "accidental-therapist";
    else if (pair("boundaries", "directness")) id = "boundary-architect";
    else if (pair("boundaries", "diplomacy")) id = "boundary-architect";
    else if (pair("boundaries", "empathy")) id = "boundary-architect";
    else id = "professional-overthinker"; // avoidance with directness or risk: contradictory, considered
  } else {
    // One instinct clearly leads.
    switch (p.d) {
      case "avoidance":
        id = "escape-artist";
        break;
      case "directness":
        id = "truth-teller";
        break;
      case "diplomacy":
        id = "table-diplomat";
        break;
      case "boundaries":
        id = "boundary-architect";
        break;
      case "empathy":
        id = "accidental-therapist";
        break;
      default:
        id = "social-risk-taker";
    }
  }

  // The cautious, deliberate pattern: steers away from bold moves, doesn't
  // dodge, and holds a line or finds the phrasing.
  if (t.risk <= -2 && t.avoidance <= 1 && (p.d === "boundaries" || p.d === "diplomacy") && id !== "velvet-hammer") {
    id = "quiet-strategist";
  }

  return ARCHETYPES[id];
}

export function auraFor(answers: AnswerLike[]): { archetype: Archetype; totals: Totals } {
  const totals = totalsFor(answers);
  return { archetype: archetypeFor(totals), totals };
}

/** A short, honest read of the pattern for the result screen. */
export function patternSummary(t: Totals): string {
  const ranked = [...DIMENSIONS].sort((a, b) => t[b] - t[a]);
  const top = ranked[0];
  const bottom = ranked[ranked.length - 1];
  const labels: Record<Dimension, string> = {
    directness: "saying it straight",
    diplomacy: "finding the phrasing",
    risk: "taking the bold move",
    empathy: "reading what people need",
    boundaries: "holding your line",
    avoidance: "letting things lie",
  };
  if (t[top] <= 1) return "No single instinct ran the show this round. Five situations, five different reads.";
  if (t[bottom] >= 0) return `This round leaned on ${labels[top]}. Nothing you avoided, either.`;
  return `This round leaned on ${labels[top]}, and steered clear of ${labels[bottom]}.`;
}
