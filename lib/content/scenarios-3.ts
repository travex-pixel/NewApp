import type { Scenario } from "./types";

export const scenarios3: Scenario[] = [
  {
    id: "bad-news-timing",
    category: "reading-the-room",
    difficulty: 2,
    title: "The wrong moment for bad news",
    setup: [
      "Your colleague Sam has just found out she got the promotion. She's practically glowing, telling you about it by the kettle, planning what she'll do first.",
      "You're the only person who knows that the client she's been nursing for a year emailed an hour ago to say they're leaving. It's not Sam's fault. She'll need to know today; there's a call at four.",
      "She asks, beaming: \"So, what's new with you?\"",
    ],
    prompt: "What do you do?",
    choices: [
      {
        id: "a",
        text: "Tell her now. She'd want to know, and it's better from you than from the call.",
        points: 1,
        outcome:
          "You've just put a client loss on top of a promotion, by the kettle, with people around. She needed to know today; she didn't need to know in the first ninety seconds of the best day she's had in a year.",
        cost: "Information delivered at the wrong time gets remembered as the moment, not the message.",
      },
      {
        id: "b",
        text: "\"Nothing that can't wait. Tell me about the job.\" Then, back at the desk: \"Have you got five minutes before the four o'clock? There's something you'll want to hear from me first.\"",
        points: 3,
        outcome:
          "Sam gets her moment. The bad news arrives in private, with a heads-up that it's coming and before the call where it matters. You've managed timing without hiding anything.",
        cost: "Twenty minutes of carrying it yourself, which is a small thing to carry.",
      },
      {
        id: "c",
        text: "Say nothing. Let her find out on the call like everyone else.",
        points: 0,
        outcome:
          "She hears it at four, blindsided, in front of people, and later learns you knew at eleven. That's the part she'll hold onto.",
        cost: "Avoiding the conversation isn't discretion. She needed to know today and you had it.",
      },
      {
        id: "d",
        text: "Hint. \"Congrats! Though, hmm, you might want to check your inbox before four.\"",
        points: 1,
        outcome:
          "You've ruined the moment and still not told her. Now she's anxious, reading every email, and whatever it is seems worse for being hinted at.",
        cost: "A hint delivers all the dread and none of the information.",
      },
    ],
    principle: {
      title: "Timing is part of the message",
      body: "The same fact, delivered an hour later in private, is a different experience. Choose the hour.",
    },
    insight:
      "Honesty people tend to think delay is a form of hiding. It isn't, as long as the delay is short and the person still gets what they need, when they need it. Sam needs the news before four, privately, from someone who's on her side. She doesn't need it by the kettle. Holding it for twenty minutes isn't dishonest; it's the difference between information and an ambush.",
    uncertain:
      "Whether Sam would actually prefer to know instantly. Some people would. Asking \"have you got five minutes\" with a warning attached lets her choose the pace from there.",
  },
  {
    id: "sunk-cost-holiday",
    category: "bias",
    difficulty: 2,
    title: "The holiday that isn't working",
    setup: [
      "Day three of a week away with two friends. The place is nice. The plan isn't. Everyone spent months planning a packed itinerary and nobody's enjoying it: 7am starts, four sites a day, a spreadsheet.",
      "Last night Priya said, half joking, \"I'd kill for a day doing nothing.\" Jamie said, \"We've paid for the tickets, though.\" Everyone went to bed.",
      "It's 6:50am. The alarm's gone off. Nobody has moved.",
    ],
    prompt: "What do you say?",
    choices: [
      {
        id: "a",
        text: "\"Come on, up. We've paid for today.\"",
        points: 0,
        outcome:
          "You go. You see four sites you don't remember. The money was already spent either way; what you've bought with it is another miserable day.",
        cost: "The tickets are gone whether you go or not. The day isn't.",
      },
      {
        id: "b",
        text: "\"I'm going to skip today. You two go if you want.\"",
        points: 1,
        outcome:
          "Honest, but it splits the group on day three and leaves the other two to decide whether they're the keen ones or the quitters. It fixes your morning and complicates everyone's.",
        cost: "Opting out alone turns a shared problem into a personal choice, which makes it harder for the others to say what they want.",
      },
      {
        id: "c",
        text: "\"Honest question. If we hadn't bought the tickets, would any of us choose to do today?\"",
        points: 3,
        outcome:
          "Silence, then probably laughter, then a day on the beach. You've taken the money out of the question, which is the only thing holding the plan together. If someone genuinely wants the sites, that's fine too; now they'll say so for real reasons.",
        cost: "A few seconds of being the one who said the quiet part. Then relief.",
      },
      {
        id: "d",
        text: "\"Let's do the first two and see how we feel.\"",
        points: 2,
        outcome:
          "A reasonable compromise that mostly means doing the first two. By lunchtime the momentum of the spreadsheet usually wins and you do the other two as well.",
        cost: "Halving the plan without changing the logic behind it tends to produce the whole plan, slower.",
      },
    ],
    principle: {
      title: "Spent money isn't a reason",
      body: "Ask what you'd choose if the cost were already gone. It is already gone. That's the whole test.",
    },
    insight:
      "Everyone in this room knows the plan is bad and nobody can say so, because saying so feels like wasting money. But the money is gone either way. The only thing still to decide is how to spend the day, and the question in option C makes that visible. It's a trick, in a sense, but the honest kind: it just removes the thing that was never really an argument.",
    uncertain:
      "Whether someone actually wants the itinerary. Possibly. The question gives them a way to say so that isn't about the cost.",
  },
  {
    id: "the-ultimatum",
    category: "conflict",
    difficulty: 3,
    title: "The ultimatum",
    setup: [
      "You share a flat with Mo. It's been mostly fine for two years. Lately his partner has been staying over four or five nights a week: extra shower, extra washing-up, the living room occupied most evenings.",
      "You raised it once, lightly. He said \"yeah, fair.\" Nothing changed.",
      "Tonight you came home to find them both on the sofa, again, and something in you snapped. You said: \"Either she's on the lease and paying, or this stops. I mean it.\" Mo's gone very still. His partner has gone to the bedroom.",
      "You meant some of it. You didn't mean to say it like that.",
    ],
    prompt: "What do you do now?",
    choices: [
      {
        id: "a",
        text: "Stand by it. You've been patient; it needed saying.",
        points: 1,
        outcome:
          "It did need saying, and now you've said it as a threat, so Mo's choices are to back down publicly or fight. Neither gets you a quieter flat. Most people pick fight.",
        cost: "An ultimatum you didn't plan to give puts you in a position you have to defend rather than one you chose.",
      },
      {
        id: "b",
        text: "\"Sorry. That came out as a threat and I didn't mean it as one. But the thing itself is real and I need us to actually sort it, not just say 'fair'.\"",
        points: 3,
        outcome:
          "You've taken back the delivery, kept the substance, and named the actual problem: not his partner, but the fact that \"fair\" went nowhere. Mo can come down from the wall now. The conversation that follows is the one you should have had weeks ago.",
        cost: "It means apologising while still angry, which is genuinely hard to do.",
      },
      {
        id: "c",
        text: "Apologise fully. \"Forget I said that. Long day.\" Retreat.",
        points: 1,
        outcome:
          "The evening de-escalates and the sofa situation continues indefinitely. You've traded the real complaint for peace, and you'll be back here in a fortnight, angrier.",
        cost: "Withdrawing the whole thing teaches you both that your limits appear and vanish with your mood.",
      },
      {
        id: "d",
        text: "Leave the flat for an hour. Let everyone cool down before anything else is said.",
        points: 2,
        outcome:
          "Sensible for your blood pressure. But you've left an ultimatum hanging in the living room for an hour, and Mo and his partner will spend it deciding what it means. It'll be harder to reframe when you get back.",
        cost: "Cooling off works best after you've said what the thing was. Before, it just leaves the worst version in the room.",
      },
    ],
    principle: {
      title: "Take back the delivery, keep the point",
      body: "You can withdraw how you said something without withdrawing what you said. Most people do neither or both.",
    },
    insight:
      "You've got two things in the room: a real, unresolved grievance, and a threat you reached for because the grievance had been ignored. The instinct is to treat them as one package: defend both or drop both. Separate them. Apologise for the shape and keep the content, and be specific that the content is \"saying 'fair' and changing nothing,\" because that's what actually pushed you here. It gives Mo a way to respond that isn't surrender, and it tells him this isn't going away.",
  },
  {
    id: "the-plus-one",
    category: "boundaries",
    difficulty: 2,
    title: "The plus-one you didn't invite",
    setup: [
      "You and your partner have had Saturday blocked out for weeks: just the two of you, a long walk, that place with the pies. It was your idea and they were into it.",
      "This morning: \"Oh, I said Kat could come on Saturday, she's having a rough time, hope that's okay? She's really looking forward to it.\"",
      "Kat is lovely. Kat is also now coming on your day, and it's been presented as decided.",
    ],
    prompt: "What do you say?",
    choices: [
      {
        id: "a",
        text: "\"Sure, that's fine.\" Be slightly quiet for the rest of the day.",
        points: 0,
        outcome:
          "Saturday happens with Kat. You're a bit off, your partner notices, and they can't work out why, because you said it was fine. Now it's a thing with no name.",
        cost: "Agreeing and then sulking makes you the problem, even though you weren't.",
      },
      {
        id: "b",
        text: "\"You said yes without asking me? It was meant to be our day.\"",
        points: 2,
        outcome:
          "Fair point, fairly made, and it starts a row. Your partner now has to choose between defending the decision and uninviting a friend who's \"having a rough time,\" and both feel bad.",
        cost: "Leading with the breach makes the conversation about the process, not about Saturday.",
      },
      {
        id: "c",
        text: "\"I'd rather it was just us on Saturday, that was sort of the point. Could we see Kat Sunday instead, or do something with her next week?\"",
        points: 3,
        outcome:
          "You've said what you want, plainly, without making it an accusation, and offered Kat something real. Your partner has an easy way to fix it. Kat gets a plan. Saturday stays yours.",
        cost: "Your partner has to go back to Kat, which is a bit awkward, and that's the right person to carry it.",
      },
      {
        id: "d",
        text: "\"Okay, but next time can you check with me first?\"",
        points: 1,
        outcome:
          "You've conceded Saturday and asked for better admin. Fair, but it treats the day as already lost, and it wasn't.",
        cost: "Negotiating for next time gives up this time without anyone having asked you to.",
      },
    ],
    principle: {
      title: "Lead with the want, not the wrong",
      body: "\"I'd rather\" is easier to answer than \"you should have.\" Lead with the want; the process lesson can wait.",
    },
    insight:
      "The real problem is twofold: the day you wanted, and the fact it was decided without you. Both matter, but only one of them can be fixed this week. Start with the day. Say what you'd prefer, give your partner an alternative to offer Kat, and let the \"ask me first\" conversation happen later, when it isn't attached to uninviting someone. Said in that order, you usually get both.",
    alsoDefensible:
      "If this keeps happening, the process conversation has to come first at some point. But not the first time, and not on the morning it's just been announced.",
  },
  {
    id: "the-rumour",
    category: "uncertainty",
    difficulty: 2,
    title: "Something you heard",
    setup: [
      "At a party, someone you half-know tells you, with relish, that your friend Dev has been \"saying things\" about you. Nothing specific. \"Just, like, that you've changed since the new job.\"",
      "Dev is one of your oldest friends. You haven't seen much of him lately, which is true. You feel a bit sick.",
      "The person who told you has already moved on to another story.",
    ],
    prompt: "What do you do?",
    choices: [
      {
        id: "a",
        text: "Message Dev tonight: \"Heard you've been saying I've changed. Nice.\"",
        points: 0,
        outcome:
          "Dev gets an accusation, at midnight, based on a thing you didn't hear him say. Whatever he actually said, the conversation now starts with him defending himself against a second-hand quote.",
        cost: "You've acted on the rumour as if it were the fact, and made the rumour-teller the most important person in your friendship.",
      },
      {
        id: "b",
        text: "Ask the person who told you exactly what Dev said, and when.",
        points: 2,
        outcome:
          "Reasonable, and you might get something specific. More likely you get a shrug, because \"saying things\" was always vague. You've also signalled that you'll chase gossip, which is a thing people remember.",
        cost: "Going back to the source gives the source more power than they've earned.",
      },
      {
        id: "c",
        text: "Let it go. Dev's allowed to think things, and you have been busy.",
        points: 1,
        outcome:
          "Mature on paper. In practice you'll replay the sentence for a week and be slightly off with Dev next time you see him, for a reason he doesn't know about.",
        cost: "Dropping it only works if you've actually dropped it. Carrying it silently is worse than asking.",
      },
      {
        id: "d",
        text: "Call Dev this week. \"I've been rubbish since the new job started. Fancy a pint? I miss you.\"",
        points: 3,
        outcome:
          "If Dev did say you've changed, he's probably right that he misses you, and you've just answered that directly. If he didn't, you've reconnected with an old friend for no reason at all. The rumour becomes irrelevant either way.",
        cost: "You have to swallow the sting without getting to confront anyone about it, which is less satisfying than it should be.",
      },
    ],
    principle: {
      title: "Answer the need, not the rumour",
      body: "Second-hand hurt usually points at something real. Respond to the real thing and let the gossip starve.",
    },
    insight:
      "Rumours are powerful because they arrive without context and your brain fills the gap. What you actually know is: an old friend may feel you've drifted, and you have, a bit. That's a thing you can fix directly, without ever mentioning the party. Confronting Dev makes the gossip the subject. Reconnecting with him makes the friendship the subject. Only one of those is worth your evening.",
    uncertain:
      "What Dev actually said, if anything. You may never know, and option D makes it not matter.",
  },
  {
    id: "exploding-offer",
    category: "under-pressure",
    difficulty: 3,
    title: "\"We need an answer by five\"",
    setup: [
      "A job offer, a good one. The recruiter's just called: \"Really pleased, they loved you. They do need an answer by five today, there's another candidate they're holding off.\"",
      "It's 2pm. You'd expected a week. You haven't seen the full contract, haven't talked to your partner, and have a second interview elsewhere on Thursday that you were quietly more excited about.",
      "\"So, can I tell them yes?\"",
    ],
    prompt: "What do you say?",
    choices: [
      {
        id: "a",
        text: "\"Yes.\" Good offers don't wait, and Thursday is a maybe.",
        points: 1,
        outcome:
          "You've accepted a job in three hours under a deadline someone else set, without the contract. It might be the right job. You made the decision in the worst conditions available.",
        cost: "Deciding to end the pressure is not the same as deciding on the job.",
      },
      {
        id: "b",
        text: "\"I'm really pleased. I'll need the full contract and until Friday to give you a proper answer. If five today is a hard line, I'd want to understand why.\"",
        points: 3,
        outcome:
          "Warm, firm, and it asks the key question. Most deadlines like this are soft, and the recruiter knows it. If it's real, you'll hear a reason. If it isn't, you've just bought the week you needed without sounding uncertain about the role.",
        cost: "A small risk that the deadline is genuine and they walk. Companies that walk over three days were going to be difficult anyway.",
      },
      {
        id: "c",
        text: "\"Can I have until tomorrow morning?\"",
        points: 2,
        outcome:
          "They'll probably say yes. You've gained eighteen hours, not the contract or Thursday. You've also accepted the premise that the deadline is reasonable and just haggled the hours.",
        cost: "Negotiating inside their frame gets you a slightly bigger version of the same squeeze.",
      },
      {
        id: "d",
        text: "\"No, sorry. If they need it by five, it's not the right fit.\"",
        points: 1,
        outcome:
          "Principled, and possibly a relief. But you've turned down a good job over a recruiter's tactic without finding out whether the company even set it. The deadline may have been invented on the call.",
        cost: "Walking away from the pressure is still letting the pressure decide.",
      },
    ],
    principle: {
      title: "Ask what the deadline is for",
      body: "A real deadline has a reason. A manufactured one has a tone. The question tells you which you've got.",
    },
    insight:
      "The pressure is the point of the call. Every option you'd choose under it, yes to end it, no to escape it, a few hours to soften it, is a reaction to the deadline rather than to the job. The move is to step outside the deadline and ask what it's for, politely, while making your own requirements clear. Recruiters hear this all the time from people they end up placing. The ones worth working for will give you the contract and the week.",
    uncertain:
      "Whether the other candidate exists. You can't know, which is why the question asks about the deadline's reason rather than its truth.",
  },
  {
    id: "two-friends-fighting",
    category: "disagreement",
    difficulty: 3,
    title: "Pick a side",
    setup: [
      "Two of your closest friends, Zara and Ben, have fallen out. Badly. Something about a wedding, a speech, a thing that was said. You've heard both versions and they don't match.",
      "Zara has just messaged: \"I need to know you're with me on this. Ben was completely out of order and I can't be around people who think otherwise.\"",
      "You think they were both out of order. You'd like to still have both friends in a year.",
    ],
    prompt: "What do you reply?",
    choices: [
      {
        id: "a",
        text: "\"Of course I'm with you. He was bang out of order.\"",
        points: 0,
        outcome:
          "Zara feels supported tonight. You've said something you don't believe, which Ben will eventually hear about, and you've made yourself a participant in a fight you weren't in.",
        cost: "Agreeing to keep one friend is how you end up with a side instead of two friends.",
      },
      {
        id: "b",
        text: "\"Honestly, I think you both handled it badly, and I'm not taking sides.\"",
        points: 1,
        outcome:
          "True, and it will land as a betrayal, because Zara asked for support and got a verdict. \"Not taking sides\" sounds neutral to you. To someone who's hurt, it sounds like \"you're half wrong.\"",
        cost: "Being fair in the exact moment someone asked for loyalty satisfies nobody, including you.",
      },
      {
        id: "c",
        text: "\"I'm with you, in the sense that I'm on your side as a person and I'm here. I'm not going to cut Ben off, and I don't think you really want me to. Can I come over?\"",
        points: 3,
        outcome:
          "You've given her the thing she actually needs, which is to not be alone with it, and declined the thing she asked for, which is a recruit. Said warmly, with an offer attached, most people accept it. The friendship with Ben survives without you having to defend it.",
        cost: "There's a real chance she's angry anyway tonight. The version of you she's angry at is the one worth being.",
      },
      {
        id: "d",
        text: "Don't reply yet. Talk to Ben first and get the full picture.",
        points: 1,
        outcome:
          "Zara sees the message was read and not answered, and draws her own conclusion. By the time you've got Ben's version you've got a third problem.",
        cost: "Fact-finding is for a dispute you're judging. You're not the judge here; you're the friend.",
      },
    ],
    principle: {
      title: "Give support, not agreement",
      body: "\"I'm here\" and \"you're right\" are different sentences. People asking for the second usually need the first.",
    },
    insight:
      "Zara's message is a loyalty test, and loyalty tests are designed so that honesty fails them. The trap is accepting that framing: agree or betray. Refuse it. Separate being on her side, which you are, from agreeing with her account, which you don't. Then make the support concrete so it isn't just words. Friends who are hurt rarely need you to confirm their version. They need to know you're not leaving.",
    uncertain:
      "Whether Zara will accept this tonight. Some people need a few days to hear it. You can't control that; you can only avoid saying the thing you'd have to take back.",
  },
  {
    id: "the-overshare",
    category: "awkward",
    difficulty: 2,
    title: "More than you expected",
    setup: [
      "You asked a colleague, Ellie, how her weekend was. Normal Monday thing. Ellie has just told you, in the kitchen, that her marriage is ending, that she found out on Saturday, and that she hasn't told anyone yet.",
      "You've worked with Ellie for a year. You're friendly. You are not, until about forty seconds ago, close.",
      "She's stopped talking and is looking at you.",
    ],
    prompt: "What do you say?",
    choices: [
      {
        id: "a",
        text: "\"Oh my god, I'm so sorry. What happened?\"",
        points: 1,
        outcome:
          "Kind, and it invites the whole story in the office kitchen at 9am. Ellie may want that or may deeply regret it by lunchtime, and you can't tell which from here.",
        cost: "Asking for details is natural and it turns a moment of trust into an interview.",
      },
      {
        id: "b",
        text: "\"That's a lot. I'm really sorry. Do you want to grab a coffee out of here, or would you rather I just pretend this was about your weekend?\"",
        points: 3,
        outcome:
          "You've taken it seriously, offered to go somewhere she can actually talk, and given her an exit if she's already wishing she hadn't said it. Both options are kind. She gets to choose how much this becomes.",
        cost: "You might end up spending an hour you hadn't planned. That's what the moment asks.",
      },
      {
        id: "c",
        text: "\"I'm so sorry. Let me know if there's anything I can do.\" Then let her get on with her day.",
        points: 2,
        outcome:
          "Decent and discreet. It also closes the door she just opened, and \"let me know\" is an offer almost nobody takes up. She told you because she needed to tell someone, and now she's told someone who's gone back to their desk.",
        cost: "Polite sympathy is the response for small news. This wasn't small.",
      },
      {
        id: "d",
        text: "Share something hard from your own life to show you understand.",
        points: 0,
        outcome:
          "Well meant, and it moves the conversation to you within a minute of her telling you her marriage is over. She'll nod, and feel unheard.",
        cost: "Matching someone's disclosure with your own feels like connection and works like interruption.",
      },
    ],
    principle: {
      title: "Offer the choice of depth",
      body: "When someone tells you more than they meant to, don't decide how big it is. Let them.",
    },
    insight:
      "Ellie has handed you something heavy without planning to, and she may be feeling exposed already. The two instincts, dig in or back off, both make the decision for her. Instead, give her a real choice: somewhere to talk properly, or an easy way to put the moment back in the box. Either answer is fine. What she'll remember is that you asked, and that you didn't make it about the gossip, or about you.",
  },
];
