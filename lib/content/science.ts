import type { Science } from "./types";

/**
 * The psychology behind a situation, keyed by scenario id.
 *
 * Rules for adding one:
 * - Only findings with solid evidence: replicated, meta-analysed, or a classic
 *   that has held up. If it's shaky or famous for not replicating, leave it out.
 * - Say what was actually found, not a stretched version of it.
 * - Plain English, no semicolons or dashes, one or two sentences.
 * - Most situations don't need one. That's fine.
 */
export const SCIENCE: Record<string, Science> = {
  "joke-at-your-expense": {
    name: "Saving face",
    line: "Sociologist Erving Goffman showed people work hard to protect how they look in front of others. A correction with an audience threatens Dan's face, so he defends it. Alone, he can just hear you.",
    source: "Goffman, On Face-Work, 1955",
  },
  "everyone-knows-each-other": {
    name: "The liking gap",
    line: "After chatting with strangers, people consistently underestimate how much the other person liked them. The group is probably warmer to you than it feels from the edge of the circle.",
    source: "Boothby, Cooney, Sandstrom & Clark, Psychological Science, 2018",
  },
  "credit-for-your-idea": {
    name: "Cryptomnesia",
    line: "In experiments, people sometimes present other people's ideas as their own without realising. Marcus might not be stealing. He might have honestly forgotten where it came from.",
    source: "Brown & Murphy, Journal of Experimental Psychology, 1989",
  },
  "gone-quiet": {
    name: "The spotlight effect",
    line: "People reliably overestimate how much others are noticing or thinking about them. Ana's quiet week might have nothing to do with you at all.",
    source: "Gilovich, Medvec & Savitsky, JPSP, 2000",
  },
  "boundary-pushback": {
    name: "Intermittent reinforcement",
    line: "Behaviour that pays off some of the time is harder to stop than behaviour that pays off every time. One 'just this once' teaches that asking again works.",
    source: "The partial reinforcement extinction effect, a classic in learning research",
  },
  "group-chat-plan": {
    name: "Future time slack",
    line: "People expect to have more spare time in the future than they do now, so they say yes to things they'd say no to today. Saturday you will be just as tired as you are tonight.",
    source: "Zauberman & Lynch, Journal of Experimental Psychology: General, 2005",
  },
  "the-price": {
    name: "First offer anchoring",
    line: "In negotiations, the first number on the table pulls the final deal towards it. This shows up across cultures and in a large 2025 review of 90 studies. His $250 is doing exactly that.",
    source: "Galinsky & Mussweiler, 2001. Petrowsky et al., meta-analysis, 2025",
  },
  "the-confident-colleague": {
    name: "The confidence heuristic",
    line: "People judge confident advisers as more knowledgeable, even when they are no more accurate. The effect fades when people can see who has actually been right.",
    source: "Price & Stone, 2004. Sah, Moore & MacCoun, 2013",
  },
  "the-apology-that-isnt": {
    name: "What makes an apology work",
    line: "In a study of the parts of an apology, owning responsibility mattered most, and an offer to repair came second. 'Sorry you feel that way' leaves out both.",
    source: "Lewicki, Polin & Lount, Negotiation and Conflict Management Research, 2016",
  },
  "the-last-minute-favour": {
    name: "We overestimate the cost of no",
    line: "Across five studies, people expected far more upset from turning down an invite than the other person actually felt. The researchers saw the same pattern with requests for favours.",
    source: "Givi & Kirk, Journal of Personality and Social Psychology, 2023",
  },
  "friends-bad-idea": {
    name: "The IKEA effect",
    line: "People value things they've built themselves more than others do. Leo's $900 logo makes the idea feel more real to him than it does to you.",
    source: "Norton, Mochon & Ariely, Journal of Consumer Psychology, 2012",
  },
  "the-dinner-bill": {
    name: "Splitting the bill",
    line: "In a restaurant experiment, diners ordered noticeably more when the bill was split evenly than when everyone paid for their own. Most also said they'd rather pay for their own.",
    source: "Gneezy, Haruvy & Yafe, The Economic Journal, 2004",
  },
  "the-forward-from-uncle": {
    name: "The backfire myth",
    line: "Correcting a false claim rarely makes people believe it more. In tests of 52 claims with over 10,000 people, corrections mostly worked. The risk with uncle isn't the fact. It's the audience.",
    source: "Wood & Porter, Political Behavior, 2019",
  },
  "the-excluded-friend": {
    name: "Ostracism hurts",
    line: "Being left out stings even when it's strangers in a computer game. A review of 120 studies found the effect was large and showed up across ages, genders and countries.",
    source: "Hartgerink, van Beest, Wicherts & Williams, PLOS ONE, 2015",
  },
  "sunk-cost-holiday": {
    name: "The sunk cost effect",
    line: "People stick with plans they've already paid for, even when they'd enjoy something else more. The money is spent either way. Only the day is still up for grabs.",
    source: "Arkes & Blumer, Organizational Behavior and Human Decision Processes, 1985",
  },
  "the-ultimatum": {
    name: "Reactance",
    line: "When people feel their freedom is being taken away, they push back to get it back, sometimes against their own interests. An ultimatum invites exactly that.",
    source: "Brehm, A Theory of Psychological Reactance, 1966",
  },
  "exploding-offer": {
    name: "Exploding offers",
    line: "Research on job offers with tight deadlines found they leave bad feelings that last after you start, and they lead to worse matches between people and jobs.",
    source: "Lau, Bearden & Tsetlin, INSEAD research on job offer deadlines",
  },
  "the-unflattering-photo": {
    name: "The spotlight effect",
    line: "People overestimate how much others notice their appearance. In one study, people guessed about twice as many others noticed their embarrassing T-shirt as actually did.",
    source: "Gilovich, Medvec & Savitsky, JPSP, 2000",
  },
};
