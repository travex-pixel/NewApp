import { DIMENSIONS, getScenario, type Choice, type Dimension } from "@/lib/content";

/**
 * The social aura: an archetype computed from five answers.
 *
 * Every answer nudges a few of six dimensions. The shape of the totals picks
 * the archetype: a clear single lead gets one of six, two leads running close
 * together get one of fifteen pair archetypes, and a flat spread gets the
 * Overthinker. Twenty-two in all. It describes five choices, not a person.
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

export type Motif = "split" | "merge" | "straight" | "loop" | "pause" | "leap";

export interface Archetype {
  id: string;
  name: string;
  /** The roast. One line, affectionate. */
  headline: string;
  /** Two or three sentences. */
  description: string;
  strengths: string[];
  watchOuts: string[];
  motif: Motif;
}

const LIST: Archetype[] = [
  // One instinct leads
  {
    id: "truth-teller",
    name: "The Unfiltered Truth-Teller",
    headline: "You've never let an awkward moment just sit there.",
    description: "You say it out loud, in the room, while it's happening. Everyone knows where they stand with you. Mostly they're grateful. Occasionally they need a minute.",
    strengths: ["Nobody has to guess what you think", "You stop bad plans early", "Brave when the room needs it"],
    watchOuts: ["Right point, wrong moment, sometimes", "People hear the delivery before the point"],
    motif: "straight",
  },
  {
    id: "table-diplomat",
    name: "The Table Diplomat",
    headline: "You've talked more dinners down than a hostage negotiator.",
    description: "You read the table before you read the menu. You find the line that lets everyone save face, and you make it look like nothing happened at all.",
    strengths: ["Keeps groups together", "Finds the exit nobody else saw", "Rarely makes an enemy"],
    watchOuts: ["Your own point can go missing", "Peace now can mean the same fight later"],
    motif: "merge",
  },
  {
    id: "social-risk-taker",
    name: "The Social Risk-Taker",
    headline: "You'd rather be the story than hear it second-hand.",
    description: "You go first. Into the circle, into the silence, into the thing nobody else will say. It works more often than it should, and it's never boring.",
    strengths: ["Breaks the ice every time", "Fearless with strangers", "Makes things happen"],
    watchOuts: ["Not everyone wanted the ice broken", "Your bold move can cost the quiet person"],
    motif: "leap",
  },
  {
    id: "accidental-therapist",
    name: "The Accidental Therapist",
    headline: "Strangers tell you about their divorce before their name.",
    description: "You ask the question under the question. People open up to you in kitchens, queues and group chats, and you handle it well. You just didn't sign up for it.",
    strengths: ["Hears what people actually mean", "Makes room without pushing", "Trusted with the big stuff"],
    watchOuts: ["Your own needs rarely make the agenda", "Some moments need a decision, not understanding"],
    motif: "pause",
  },
  {
    id: "boundary-architect",
    name: "The Boundary Architect",
    headline: "Your 'no' has load-bearing walls.",
    description: "You know what you'll do and what you won't, and you say so early, without drama. People stop asking the third time. You're fine with that.",
    strengths: ["Clear and consistent", "Can't be guilt-tripped", "Protects your time and energy"],
    watchOuts: ["A no with no alternative can land cold", "Sometimes the ask was actually fine"],
    motif: "straight",
  },
  {
    id: "escape-artist",
    name: "The Social Escape Artist",
    headline: "You've never lost an argument you didn't turn up to.",
    description: "Why have the conversation when you can have the kitchen, the bread, or a sudden interest in the weather? You keep things calm. The things stay, though.",
    strengths: ["Never escalates", "Low drama, always", "Lets small things stay small"],
    watchOuts: ["Big things stay too", "Silence gets read as a maybe"],
    motif: "loop",
  },

  // Two instincts together
  {
    id: "velvet-hammer",
    name: "The Velvet Hammer",
    headline: "You say the hard thing so nicely people thank you for it.",
    description: "Honest and tactful at the same time, which most people think can't be done. You name the problem, keep the person, and the meeting still finishes on time.",
    strengths: ["Honest without being harsh", "Keeps relationships through hard chats", "Trusted to deliver bad news"],
    watchOuts: ["People may not realise they've been told", "You can overthink a simple no"],
    motif: "merge",
  },
  {
    id: "live-wire",
    name: "The Live Wire",
    headline: "You say it first, loudest, and usually in front of everyone.",
    description: "Bold and blunt is a powerful combo. You cut through waffle and get things moving. Every group needs one of you. Most groups can handle one of you.",
    strengths: ["Gets to the point fast", "Unafraid of a scene", "Makes the room honest"],
    watchOuts: ["Collateral damage happens", "Not every fight needed starting"],
    motif: "leap",
  },
  {
    id: "honest-hugger",
    name: "The Honest Hugger",
    headline: "You'll tell them the truth, then make them a cuppa.",
    description: "You care too much to lie to people. So you tell them straight, and stick around for what happens next. It's the rarest kind of friend.",
    strengths: ["Honest because you care", "Stays for the fallout", "People trust your feedback"],
    watchOuts: ["Not everyone asked for the truth", "You can carry other people's feelings home"],
    motif: "merge",
  },
  {
    id: "plain-speaker",
    name: "The Plain Speaker",
    headline: "No means no. Yes means yes. Maybe doesn't exist.",
    description: "You say what you mean and you mean what you say. People find you refreshing, slightly scary, and very easy to plan a weekend with.",
    strengths: ["Totally reliable", "Zero mixed messages", "Impossible to walk over"],
    watchOuts: ["Soft edges help sometimes", "The first answer isn't always the final one"],
    motif: "straight",
  },
  {
    id: "note-writer",
    name: "The Polite Note Writer",
    headline: "You'll say exactly how you feel. In writing. Later.",
    description: "You've got opinions and you'd rather not have the scene. So it comes out sideways: a text after, a note on the windscreen, a pointed emoji. Honest, eventually.",
    strengths: ["You do say it, eventually", "Rarely loses your temper", "Excellent at the written word"],
    watchOuts: ["Notes read colder than you meant", "Face to face saves a lot of guessing"],
    motif: "pause",
  },
  {
    id: "chaos-mediator",
    name: "The Chaos Mediator",
    headline: "You negotiate peace treaties at 7am with no coffee.",
    description: "When it all goes sideways, you're the one who says the funny, true thing that resets the room. Part diplomat, part gambler, all instinct.",
    strengths: ["Quick under pressure", "Bold and warm at once", "Turns tension into a story"],
    watchOuts: ["The gamble doesn't always land", "Sometimes the quiet fix was right there"],
    motif: "leap",
  },
  {
    id: "room-reader",
    name: "The Room Reader",
    headline: "You knew who was upset before they did.",
    description: "You clock the mood, find the right words, and make sure nobody gets left out. Groups run smoother with you in them, even if nobody can say why.",
    strengths: ["Spots tension early", "Includes everyone", "Knows exactly what to say"],
    watchOuts: ["You manage everyone's mood but yours", "Smoothing over isn't always fixing"],
    motif: "merge",
  },
  {
    id: "velvet-rope",
    name: "The Velvet Rope",
    headline: "Gracious, charming, and absolutely not doing that.",
    description: "You hold your line with such good manners that people barely notice they've been turned down. The ask gets a polite no and a nice alternative.",
    strengths: ["Firm without fallout", "Offers a way forward", "Respected and liked"],
    watchOuts: ["Too smooth can feel like a brush-off", "Sometimes people need the blunt version"],
    motif: "split",
  },
  {
    id: "smooth-operator",
    name: "The Smooth Operator",
    headline: "Auntie asked about marriage. You left with a compliment and a plate.",
    description: "You deflect with charm. Awkward questions bounce off you and somehow everyone feels great about it. The question just never quite gets answered.",
    strengths: ["Unflappable in public", "Everyone leaves happy", "A master of the subject change"],
    watchOuts: ["The question comes back next time", "Charm can stand in for honesty"],
    motif: "loop",
  },
  {
    id: "big-hearted-gambler",
    name: "The Big-Hearted Gambler",
    headline: "You bet on people. Mostly you win.",
    description: "You back your friends, take the risk on the awkward conversation, and lead with heart. When it works it's magic. When it doesn't, you'll do it again anyway.",
    strengths: ["Generous and brave", "Gives people a chance", "Shows up when it counts"],
    watchOuts: ["Not every bet is worth it", "Heart first, plan second"],
    motif: "leap",
  },
  {
    id: "maverick",
    name: "The Maverick",
    headline: "Rules are suggestions. Your rules are law.",
    description: "Bold about doing things your way and firm about not budging. You'll walk away from the deal, skip the trip, and leave early, all with total confidence.",
    strengths: ["Knows your own mind", "Not pressured by crowds", "Makes clean decisions"],
    watchOuts: ["Walking away is still a choice with costs", "Teams need some give"],
    motif: "split",
  },
  {
    id: "plot-twist",
    name: "The Plot Twist",
    headline: "Nobody saw your exit coming. Including you.",
    description: "You'll take a bold swing, then vanish before the fallout. Unpredictable, entertaining, occasionally hard to pin down for brunch.",
    strengths: ["Never boring", "Willing to try anything", "Hard to read in a good way"],
    watchOuts: ["Friends like knowing where you stand", "The disappearing act can sting"],
    motif: "loop",
  },
  {
    id: "kind-no",
    name: "The Kind No",
    headline: "You turn people down and they feel looked after.",
    description: "You've worked out the trick most people never do: you can say no and still care. People feel respected when you hold your line, because you hold it gently.",
    strengths: ["Boundaries with warmth", "Honest about limits", "People feel safe with you"],
    watchOuts: ["You can over-explain the no", "Guilt can creep in after"],
    motif: "split",
  },
  {
    id: "people-pleaser",
    name: "The Certified People Pleaser",
    headline: "You've paid $62 for a $24 dinner and said thank you.",
    description: "You notice what everyone needs and give it to them, usually at your own expense. People love having you around. You'd like, now and then, to be asked.",
    strengths: ["Kind by reflex", "Keeps the peace every time", "Nobody feels left out near you"],
    watchOuts: ["Your yes is cheap when it's never no", "Resentment builds up quietly"],
    motif: "merge",
  },
  {
    id: "quiet-strategist",
    name: "The Quiet Strategist",
    headline: "You've already planned what you'll say next Tuesday.",
    description: "You rarely react in the moment. You wait, choose the time, choose the words, and then say exactly enough. People underestimate you. Once.",
    strengths: ["Picks the right moment", "Low drama, high impact", "Never says something you'll regret"],
    watchOuts: ["Waiting can look like not noticing", "Some moments only happen once"],
    motif: "pause",
  },

  // No single instinct
  {
    id: "professional-overthinker",
    name: "The Professional Overthinker",
    headline: "You've considered every option, including ones nobody offered.",
    description: "No single instinct runs your show. You weigh it up from scratch every time: sometimes blunt, sometimes diplomatic, sometimes the bread. Your friends call it balanced. You call it 2am.",
    strengths: ["Adaptable to anything", "Sees every side", "Hard to predict"],
    watchOuts: ["Consistency is also a kindness", "Sometimes the first instinct was right"],
    motif: "split",
  },
];

export const ARCHETYPES: Record<string, Archetype> = Object.fromEntries(LIST.map((a) => [a.id, a]));
export const ARCHETYPE_IDS: string[] = LIST.map((a) => a.id);
export type ArchetypeId = string;

export function isArchetypeId(x: string): boolean {
  return Object.prototype.hasOwnProperty.call(ARCHETYPES, x);
}

const LEAD: Record<Dimension, string> = {
  directness: "truth-teller",
  diplomacy: "table-diplomat",
  risk: "social-risk-taker",
  empathy: "accidental-therapist",
  boundaries: "boundary-architect",
  avoidance: "escape-artist",
};

const PAIRS: Record<string, string> = {
  "directness+diplomacy": "velvet-hammer",
  "directness+risk": "live-wire",
  "directness+empathy": "honest-hugger",
  "directness+boundaries": "plain-speaker",
  "directness+avoidance": "note-writer",
  "diplomacy+risk": "chaos-mediator",
  "diplomacy+empathy": "room-reader",
  "diplomacy+boundaries": "velvet-rope",
  "diplomacy+avoidance": "smooth-operator",
  "risk+empathy": "big-hearted-gambler",
  "risk+boundaries": "maverick",
  "risk+avoidance": "plot-twist",
  "empathy+boundaries": "kind-no",
  "empathy+avoidance": "people-pleaser",
  "boundaries+avoidance": "quiet-strategist",
};

function pairKey(a: Dimension, b: Dimension): string {
  const [x, y] = [a, b].sort((p, q) => DIMENSIONS.indexOf(p) - DIMENSIONS.indexOf(q));
  return `${x}+${y}`;
}

/**
 * Picks the archetype from standardised scores: how far each dimension sits
 * above what these particular situations would give on average. Without this,
 * dimensions that many answers touch (dodging, say) would win too often.
 */
export function archetypeFromStandardised(z: Totals): Archetype {
  const ranked = DIMENSIONS.map((d) => ({ d, v: z[d] })).sort((a, b) => b.v - a.v || DIMENSIONS.indexOf(a.d) - DIMENSIONS.indexOf(b.d));
  const [p, q] = ranked;
  let id: string;
  if (p.v < FLAT) id = "professional-overthinker";
  else if (q.v >= PAIR_MIN && p.v - q.v <= PAIR_GAP) id = PAIRS[pairKey(p.d, q.d)];
  else id = LEAD[p.d];
  return ARCHETYPES[id];
}

const FLAT = 0.55;
const PAIR_MIN = 0.45;
const PAIR_GAP = 0.6;

/** Mean and spread of each dimension if the five answers were picked at random. */
function baseline(answers: AnswerLike[]): { mean: Totals; sd: Totals } {
  const mean = Object.fromEntries(DIMENSIONS.map((d) => [d, 0])) as Totals;
  const variance = Object.fromEntries(DIMENSIONS.map((d) => [d, 0])) as Totals;
  for (const a of answers) {
    const s = getScenario(a.scenarioId);
    if (!s) continue;
    for (const d of DIMENSIONS) {
      const vals: number[] = s.choices.map((c) => c.scores[d] ?? 0);
      const m = vals.reduce((x, y) => x + y, 0) / vals.length;
      mean[d] += m;
      variance[d] += vals.reduce((x, y) => x + (y - m) ** 2, 0) / vals.length;
    }
  }
  const sd = Object.fromEntries(DIMENSIONS.map((d) => [d, Math.sqrt(variance[d]) || 1])) as Totals;
  return { mean, sd };
}

export function standardise(answers: AnswerLike[], totals: Totals): Totals {
  const { mean, sd } = baseline(answers);
  return Object.fromEntries(DIMENSIONS.map((d) => [d, (totals[d] - mean[d]) / sd[d]])) as Totals;
}

/** For callers that only have raw totals (tests, previews). */
export function archetypeFor(t: Totals): Archetype {
  const z = Object.fromEntries(DIMENSIONS.map((d) => [d, t[d] / 3])) as Totals;
  return archetypeFromStandardised(z);
}

export function auraFor(answers: AnswerLike[]): { archetype: Archetype; totals: Totals } {
  const totals = totalsFor(answers);
  return { archetype: archetypeFromStandardised(standardise(answers, totals)), totals };
}

export const DIMENSION_LABELS: Record<Dimension, string> = {
  directness: "Directness",
  diplomacy: "Diplomacy",
  risk: "Boldness",
  empathy: "Empathy",
  boundaries: "Boundaries",
  avoidance: "Dodging",
};

/** A short, honest read of the pattern for the result screen. */
export function patternSummary(t: Totals): string {
  const ranked = [...DIMENSIONS].sort((a, b) => t[b] - t[a]);
  const top = ranked[0];
  const labels: Record<Dimension, string> = {
    directness: "saying it straight",
    diplomacy: "finding the right words",
    risk: "the bold move",
    empathy: "reading what people need",
    boundaries: "holding your line",
    avoidance: "letting things slide",
  };
  if (t[top] <= 1) return "No single instinct ran the show. Five situations, five different calls.";
  return `This round you leaned on ${labels[top]}.`;
}

/** The dimension you used least, and something concrete to try next round. */
export function nextRoundTip(t: Totals): { dimension: Dimension; tip: string } {
  const lowest = [...DIMENSIONS].filter((d) => d !== "avoidance").sort((a, b) => t[a] - t[b])[0];
  const tips: Record<Dimension, string> = {
    directness: "Next round, pick the answer that says the thing out loud. See what changes.",
    diplomacy: "Next round, go for the answer that finds the words that let everyone save face.",
    risk: "Next round, take the bold option at least once. Go first.",
    empathy: "Next round, choose the answer that asks how they're going before deciding what it means.",
    boundaries: "Next round, try the clear no. Notice how it feels.",
    avoidance: "Next round, let one thing slide on purpose.",
  };
  if (t.avoidance >= 4) return { dimension: "avoidance", tip: "Next round, face one of them head on instead of stepping round it." };
  return { dimension: lowest, tip: tips[lowest] };
}
