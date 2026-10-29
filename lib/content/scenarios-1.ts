import type { Scenario } from "./types";

export const scenarios1: Scenario[] = [
  {
    id: "joke-at-your-expense",
    category: "reading-the-room",
    difficulty: 1,
    title: "The joke at your expense",
    setup: [
      "Six of you around a pub table. Your friend Dan is on good form, and the group is laughing.",
      "Then he turns to you. \"Remember when you got dumped by text and said you were 'fine' for three weeks?\" The table laughs. A couple of people you've just met look at you to see what you'll do.",
      "You were not fine, and Dan knows it.",
    ],
    prompt: "What do you do?",
    choices: [
      {
        id: "a",
        text: "Laugh along. \"Honestly, I'm still not over it.\"",
        points: 2,
        outcome:
          "The laugh stays with you rather than at you. The moment passes in two seconds and nobody at the table remembers it by the end of the night.",
        cost: "Dan learns the story is fair game. If it bothered you, it will come up again.",
      },
      {
        id: "b",
        text: "\"That's a bit much, mate.\" Said flat, straight at him.",
        points: 1,
        outcome:
          "The table goes quiet. Dan says \"I was only joking,\" and now everyone is uncomfortable, and the story about you has been replaced by a story about the moment you made it awkward.",
        cost: "You were entitled to it, but a public correction costs more than a private one and buys you less.",
      },
      {
        id: "c",
        text: "Laugh it off now. Later, when it's just the two of you: \"That one actually stung.\"",
        points: 3,
        outcome:
          "The table gets a normal evening. Dan gets an honest signal with no audience to perform for, so he's far more likely to hear it. Most people apologise properly in that setting.",
        cost: "It takes a bit of nerve to bring it up afterwards, and it's easy to let the moment slide instead.",
      },
      {
        id: "d",
        text: "Fire one back. \"Says the man who cried at the Toy Story 3 trailer.\"",
        points: 1,
        outcome:
          "Big laugh. It feels like a win. But you've just agreed to the rules of a game where the funniest thing anyone can do is expose the other person.",
        cost: "Escalation is fun right up until it isn't, and you've trained the table that you'll play.",
      },
    ],
    principle: {
      title: "Correct in private, not in public",
      body: "A correction with an audience becomes a performance for both of you. Without one, it's just information.",
    },
    insight:
      "Dan isn't the problem in this moment; the audience is. Anything you say now, he has to respond to in front of five people, which means he'll defend himself rather than hear you. Taking the laugh costs you almost nothing and keeps the group comfortable. The private word afterwards is the part most people skip, and it's the only part that changes what Dan does next time.",
    alsoDefensible:
      "Laughing along and leaving it there is fine if it genuinely didn't bother you. The mistake is pretending it didn't when it did.",
  },
  {
    id: "everyone-knows-each-other",
    category: "awkward",
    difficulty: 1,
    title: "Everyone here knows each other",
    setup: [
      "A housewarming. You know the host and no one else. She's in the kitchen dealing with something, so you've drifted towards the only group in the living room.",
      "Four people, mid-conversation, laughing about someone called Priya who apparently did something at a wedding. They're standing in a loose circle. Nobody has looked up.",
    ],
    prompt: "How do you get in?",
    choices: [
      {
        id: "a",
        text: "Wait at the edge of the circle, smiling, until there's a gap to introduce yourself.",
        points: 1,
        outcome:
          "There is no gap. Groups mid-story don't produce them. After a minute you're the person hovering with a drink, which is more conspicuous than anything you could have said.",
        cost: "Waiting to be invited puts the whole job on people who haven't noticed you yet.",
      },
      {
        id: "b",
        text: "Step in at the next laugh. \"Sorry, I have to know what Priya did.\"",
        points: 3,
        outcome:
          "You've joined on their terms, about their topic, at a moment where interrupting costs nothing. Someone will happily retell it, and the retelling introduces you to the group without a formal round of names.",
        cost: "Almost none. The only risk is a group that genuinely doesn't want new people, and you'd learn that in ten seconds rather than ten minutes.",
      },
      {
        id: "c",
        text: "Wait for a pause and do it properly: \"Hi, I'm Sam, I know Jess from work.\"",
        points: 2,
        outcome:
          "Perfectly fine. The group reshuffles to include you and someone asks how you know Jess. The conversation restarts from zero, which is a little flat after the story they were enjoying.",
        cost: "A formal intro stops the thing they were doing. A joining-in asks to be part of it.",
      },
      {
        id: "d",
        text: "Go and help in the kitchen until the host is free to introduce you.",
        points: 1,
        outcome:
          "Comfortable and useful, and the host will appreciate it. But you've spent the easy part of the evening, when groups are still forming, hiding in the one room where there's no one to meet.",
        cost: "It only postpones the problem, and later circles are harder to break into than early ones.",
      },
    ],
    principle: {
      title: "Join the topic, not the group",
      body: "People let you into a conversation far more readily than they let you into a circle. Ask about the thing they're already enjoying.",
    },
    insight:
      "A circle of people mid-story looks closed, but it's running on momentum, not exclusion. The move that works is to treat the story as the door: show interest in exactly what they're talking about, and the group does the introducing for you. Standing at the edge waiting for a gap feels polite, but from inside the circle it reads as someone wanting something, which is a harder thing to respond to than a question.",
  },
  {
    id: "credit-for-your-idea",
    category: "under-pressure",
    difficulty: 2,
    title: "Your idea, his credit",
    setup: [
      "Monday planning meeting, eight people, your manager's manager on the call.",
      "Last week you told Marcus, over coffee, that the onboarding emails should go out in a different order. Marcus has just presented that exact change, slide and all, as \"something I've been thinking about.\" People are nodding. The senior person says \"Great, let's do it.\"",
      "Marcus hasn't mentioned you. He may not even remember where it came from.",
    ],
    prompt: "What do you do?",
    choices: [
      {
        id: "a",
        text: "Say nothing. Raise it with Marcus afterwards.",
        points: 2,
        outcome:
          "Marcus is likely to apologise and may even correct it later, though the senior person has already filed the idea under his name. A private conversation fixes the relationship; it doesn't fix the record.",
        cost: "You keep the peace at the cost of the moment. Credit is easiest to claim when the idea is still on the screen.",
      },
      {
        id: "b",
        text: "\"Just to flag, that was actually my suggestion to Marcus last week.\"",
        points: 1,
        outcome:
          "True, and everyone heard it. It also sounds like a complaint, puts Marcus on the spot, and makes the senior person referee a dispute about an email sequence. People remember the friction more than the fact.",
        cost: "You've claimed the credit and spent some goodwill doing it, which was avoidable.",
      },
      {
        id: "c",
        text: "Build on it, out loud. \"Yes. When Marcus and I talked this through, the thing that convinced me was the drop-off after email two, so I'd suggest we start there.\"",
        points: 3,
        outcome:
          "You've put yourself inside the idea in front of the people who matter, added something useful, and given Marcus no reason to fight you. The senior person now associates both of you with it, and you with the detail.",
        cost: "It needs a real contribution ready, not just a claim. If you have nothing to add, this is harder to pull off.",
      },
      {
        id: "d",
        text: "Message a colleague on the call: \"lol that was my idea.\"",
        points: 0,
        outcome:
          "Your colleague now knows you're annoyed and can do nothing about it. The message exists forever. Marcus still has the credit.",
        cost: "Venting sideways relieves the feeling and changes nothing, except your reputation if it's ever forwarded.",
      },
    ],
    principle: {
      title: "Claim by contributing",
      body: "The strongest way to attach your name to an idea is to be the person who can say what happens next.",
    },
    insight:
      "Most people see two options here: swallow it or confront it. There's a third. Rather than disputing ownership, demonstrate it, in the room, by adding the detail only the person who thought it through would know. It works because it's useful to everyone present, including Marcus. The private word afterwards is still worth having, but you'll be having it from a stronger position.",
    uncertain:
      "Whether Marcus took the idea deliberately or genuinely forgot where it came from. Your response works either way, which is the point.",
  },
  {
    id: "gone-quiet",
    category: "reading-the-room",
    difficulty: 2,
    title: "Gone quiet",
    setup: [
      "You and your flatmate Ana had a short, sharp disagreement on Tuesday about the thermostat. Nothing dramatic. You both said your piece.",
      "It's now Thursday. Ana has been polite, brief, and in her room a lot. \"Fine, thanks.\" \"No, go ahead.\" She's not sulking exactly. She's just not there.",
      "You're not sure whether this is about Tuesday at all.",
    ],
    prompt: "What do you do?",
    choices: [
      {
        id: "a",
        text: "Give her space. If something's wrong, she'll say.",
        points: 1,
        outcome:
          "Maybe. But people who go quiet after a disagreement often go quiet precisely because they don't want to be the one to raise it. Two more days of \"fine, thanks\" and the thermostat has become a thing.",
        cost: "Space is a kindness when someone has asked for it. Assumed space can look like indifference.",
      },
      {
        id: "b",
        text: "\"Are we okay? You've seemed a bit off since Tuesday.\"",
        points: 3,
        outcome:
          "You've named what you noticed without deciding what it means. If it is about Tuesday, you've opened the door. If it isn't, Ana can tell you what's actually going on, and the question still lands as care rather than accusation.",
        cost: "There's a small chance you're reading too much into normal tiredness. The cost of that is a thirty-second conversation.",
      },
      {
        id: "c",
        text: "Apologise properly for Tuesday, to clear the air.",
        points: 2,
        outcome:
          "Kind, and if Tuesday is the problem, it helps. But you're apologising for something you're not sure needs apologising for, and if her quietness is about her job or her mum, you've made it about you.",
        cost: "An apology for the wrong thing can feel like being managed rather than heard.",
      },
      {
        id: "d",
        text: "Be extra warm and chatty to show there are no hard feelings.",
        points: 1,
        outcome:
          "Ana notices you're performing normal and wonders why. Nothing is said, nothing is resolved, and now you're both acting.",
        cost: "Cheerfulness as a repair strategy asks the other person to match it before anything has been addressed.",
      },
    ],
    principle: {
      title: "Name the observation, not the cause",
      body: "\"You've seemed off\" is something you know. \"You're upset about Tuesday\" is something you're guessing. Lead with the one you know.",
    },
    insight:
      "The trap is assuming you already know what the silence means and acting on it: apologising, giving space, over-correcting. All three are responses to a story you've written yourself. Saying what you've noticed and asking is the only option that works whatever the real cause is. It also gives Ana the easiest possible way in, which matters, because the person who's gone quiet is usually waiting for one.",
    uncertain:
      "Whether the quietness is about you at all. That's exactly why you ask instead of assume.",
  },
  {
    id: "boundary-pushback",
    category: "boundaries",
    difficulty: 2,
    title: "The boundary that didn't take",
    setup: [
      "Your brother asked to borrow £400 last month. You said no, and you were clear about why: the last two loans never came back and it made Christmas weird. He took it well, or seemed to.",
      "Tonight he's messaged: \"I know you said no but this is different, it's for the car and I literally can't get to work without it. I'll pay you back on the 28th, I promise. Please.\"",
      "He probably does need the car. He's also said \"I promise\" before.",
    ],
    prompt: "What do you reply?",
    choices: [
      {
        id: "a",
        text: "\"I said no last month and I meant it. I'm not going to go over it again.\"",
        points: 2,
        outcome:
          "Clear. He stops asking, at least for now. He also hears it as cold, and the \"I literally can't get to work\" part goes unanswered, which he'll remember.",
        cost: "Holding a line by refusing to discuss it protects the boundary but not the relationship.",
      },
      {
        id: "b",
        text: "\"Okay. Just this once. But this is really the last time.\"",
        points: 0,
        outcome:
          "You've just taught him the exact phrasing that works. \"The last time\" was also what you said last time. The car might get fixed; the pattern definitely continues.",
        cost: "A boundary that moves when pushed isn't a boundary. It's an opening bid.",
      },
      {
        id: "c",
        text: "\"I'm not lending money, that hasn't changed. If the car's the problem, I can help you look at other options tonight. What does the garage actually need?\"",
        points: 3,
        outcome:
          "The no stays a no, said once, without heat. And you've engaged with the real problem, the car, rather than the request, the money. If he needs practical help, he's got it. If he only wanted the £400, that becomes clear quickly.",
        cost: "It takes more of your evening than a flat no, and he may still be annoyed.",
      },
      {
        id: "d",
        text: "Don't reply tonight. Let it sit until he calms down.",
        points: 1,
        outcome:
          "He reads the silence as a maybe and sends two more messages. By morning the question is bigger, not smaller, and you've spent the night thinking about it anyway.",
        cost: "Delay feels like neutrality. To the person waiting, it feels like a door left ajar.",
      },
    ],
    principle: {
      title: "Hold the line, help with the problem",
      body: "You can say no to the request and still take the need seriously. Separating the two is what makes the no survivable.",
    },
    insight:
      "When someone pushes on a boundary, the instinct is to either defend it harder or give it up. Both treat the money as the whole conversation. But what he's actually brought you is a problem, the car, wrapped in a solution, your £400. Decline the solution, engage with the problem. If the problem is real, you've helped. If it was only ever about the money, the conversation tells you that too.",
    alsoDefensible:
      "A plain, warm no with no further help is reasonable if you've already been round this loop several times. You don't owe a solution. The mistake is the \"just this once\".",
  },
  {
    id: "group-chat-plan",
    category: "trade-offs",
    difficulty: 1,
    title: "The plan you don't want",
    setup: [
      "The group chat has been going all afternoon. Somehow it's been decided that Saturday is a day trip to the coast: 7am train, three changes, back at midnight. Everyone seems excited.",
      "You are not excited. You've had a brutal week and the thought of a 7am train makes you want to lie down.",
      "Chloe: \"@you you're in, right? Need to book the tickets by tonight.\"",
    ],
    prompt: "What do you send?",
    choices: [
      {
        id: "a",
        text: "\"Yeah go on then 🙃\" and hope you feel differently on Saturday.",
        points: 0,
        outcome:
          "You won't. Either you go and resent it, or you bail on Friday night and the tickets are already bought. Both are worse than saying it now.",
        cost: "A yes you don't mean costs more later than a no does now.",
      },
      {
        id: "b",
        text: "\"I'm going to sit this one out, I'm wiped. Have an amazing time and send me the chips.\"",
        points: 3,
        outcome:
          "Clean and warm. Chloe books five tickets instead of six. Nobody thinks about it again. You are not required to invent a dentist appointment.",
        cost: "Mild fear of missing out on Saturday afternoon, which you'd have felt on the 7am train too.",
      },
      {
        id: "c",
        text: "\"Any chance of a later train? 7am is rough.\"",
        points: 2,
        outcome:
          "Reasonable, and sometimes it works. But you've asked six people to replan around you when the real issue is that you don't want to go. If they say no, you're back where you started with less time.",
        cost: "Negotiating the details when the problem is the whole thing wastes everyone's effort, including yours.",
      },
      {
        id: "d",
        text: "Leave it on read until tomorrow.",
        points: 1,
        outcome:
          "Chloe has to chase you. She's now the organiser who's been left hanging, and you've made your tiredness her admin.",
        cost: "Silence is a decision too, just one that someone else has to deal with.",
      },
    ],
    principle: {
      title: "A clear no helps the organiser",
      body: "The person booking tickets needs a number, not your feelings about trains. Give them the number, kindly, early.",
    },
    insight:
      "Most people treat declining as a thing that needs justifying, so they either over-explain, stall, or cave. From the organiser's side, none of that is helpful. What Chloe needs is a quick, friendly yes or no so she can do her job. The warm, specific no, no excuse attached, is the one that respects her time and yours. Nobody is keeping score of your attendance; they're keeping score of whether you're straightforward.",
  },
  {
    id: "the-late-friend",
    category: "conflict",
    difficulty: 1,
    title: "Forty minutes, again",
    setup: [
      "You and Tom are meant to meet at seven. It's 7:40. Your phone says \"5 mins!!\" from 7:25.",
      "This is the fourth time in a row. You've started telling him earlier times, which worked once. Last time you joked about it and he laughed and said \"I know, I know.\"",
      "He arrives, out of breath, full of apology. \"Mate, I'm so sorry, the bus just didn't come.\"",
    ],
    prompt: "What do you say?",
    choices: [
      {
        id: "a",
        text: "\"No worries, you're here now.\"",
        points: 1,
        outcome:
          "Pleasant evening. Fifth time next month. You've told him, again, that there's no cost to this, so there isn't.",
        cost: "Each \"no worries\" is a small vote for the pattern continuing.",
      },
      {
        id: "b",
        text: "\"Honestly, it's every time. I'm not going to keep waiting forty minutes.\"",
        points: 2,
        outcome:
          "True and overdue. It also lands on him at the exact moment he's already apologising, so he gets defensive about the bus instead of hearing the point. The evening starts with an argument about buses.",
        cost: "Right message, worst possible timing. The point is good; the moment belongs to the apology.",
      },
      {
        id: "c",
        text: "\"It's fine, let's go.\" Then, over the first drink: \"Can we talk about the time thing? It's started to bother me.\"",
        points: 3,
        outcome:
          "You accept the apology, which costs nothing, and raise the pattern ten minutes later when he's not mid-excuse. Said that way, as something that's begun to bother you rather than a verdict on him, most people actually engage with it.",
        cost: "You have to actually do the second part. It's very easy to have a nice evening and not.",
      },
      {
        id: "d",
        text: "Say nothing, but leave at 7:35 next time and let him find an empty table.",
        points: 1,
        outcome:
          "He gets the message, but it arrives as a punishment he has to decode rather than a thing you've asked for. The next conversation is about why you left, not why he's late.",
        cost: "Consequences without a conversation feel like a trap, even when they're deserved.",
      },
    ],
    principle: {
      title: "Separate the apology from the pattern",
      body: "Accept the apology for today. Raise the pattern separately, when neither of you is defending anything.",
    },
    insight:
      "Tom's apology is about one bus. Your problem is about four evenings. If you answer the pattern while he's apologising for the bus, you're having two different conversations and both go badly. Take the apology, let the moment pass, then bring up the pattern as your experience: it's started to bother me. That's hard to argue with, because it isn't an argument.",
    alsoDefensible:
      "Starting to leave after a fixed wait is a reasonable boundary, provided you've told him it's coming. The version that works is the announced one.",
  },
  {
    id: "the-price",
    category: "disagreement",
    difficulty: 2,
    title: "The number on the table",
    setup: [
      "You're selling your old bike online. You listed it at £350, which you thought was fair-ish. A buyer has come to see it, kicked the tyres, and said: \"I'll give you £250 cash now.\"",
      "You don't actually know what it's worth. You picked £350 because a similar one sold for that. He seems keen. You have no other buyers yet, but it's only been up two days.",
    ],
    prompt: "What do you say?",
    choices: [
      {
        id: "a",
        text: "\"Done.\" A bird in the hand.",
        points: 1,
        outcome:
          "You're £250 up and the bike's gone. You also accepted the very first number he said, which tells you nothing about what he'd have paid. Buyers who open at £250 are usually prepared for £300.",
        cost: "Taking the opening offer treats your uncertainty as his advantage.",
      },
      {
        id: "b",
        text: "\"It's £350. That's the price.\"",
        points: 1,
        outcome:
          "Firm, and he might pay it. More likely he shrugs and leaves, and you've lost a real buyer over a number you admitted you half made up.",
        cost: "Holding a line you don't believe in is bluffing, and it only works if he can't tell.",
      },
      {
        id: "c",
        text: "\"What's making you say £250? What have you seen them going for?\"",
        points: 3,
        outcome:
          "Now he has to justify his number, and whatever he says tells you about the market or about him. If he has a real reason, you've learned something. If he hasn't, he'll usually move. Either way you're negotiating with information instead of nerves.",
        cost: "It takes a moment of silence afterwards that some people find hard to sit through.",
      },
      {
        id: "d",
        text: "\"Meet me in the middle, £300?\"",
        points: 2,
        outcome:
          "Perfectly normal, and probably closes. But you've split the difference between a number you weren't sure of and a number he invented, which isn't a reason, it's a reflex.",
        cost: "Splitting the difference feels fair and is really just agreeing to anchor on his number.",
      },
    ],
    principle: {
      title: "Ask before you anchor",
      body: "When you don't know the value, the other person's reasoning is worth more than their offer. Ask for it.",
    },
    insight:
      "The buyer has given you a number and you've got a number, and the instinct is to treat the gap as the whole problem. But you don't know what the bike is worth, and neither of your numbers is evidence. A question costs you nothing and makes him show his working. People who've done their research will tell you, usefully. People who haven't will often raise their offer just to end the silence.",
    uncertain:
      "What the bike is actually worth. The question is how you find that out without paying for the answer.",
  },
];
