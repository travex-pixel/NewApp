import type { Scenario } from "./types";

export const scenarios2: Scenario[] = [
  {
    id: "the-confident-colleague",
    category: "bias",
    difficulty: 2,
    title: "Confidence versus evidence",
    setup: [
      "Your team has to pick a supplier by Friday. Two options. Raj has been championing Option A all week, fluently, with total certainty: \"I've seen this a hundred times, A is the one.\"",
      "You've read both proposals. B is cheaper, has better references, and A's case study is three years old. But you've only been here four months and Raj has been here nine years.",
      "Your manager turns to you. \"You've looked at these. Thoughts?\"",
    ],
    prompt: "What do you say?",
    choices: [
      {
        id: "a",
        text: "\"I'd go with Raj on this, he knows the space.\"",
        points: 1,
        outcome:
          "Comfortable, and possibly even correct. But you were asked because you did the reading, and you've just replaced your evidence with his tone of voice.",
        cost: "Deferring to confidence isn't humility. It's letting the loudest certainty make the decision.",
      },
      {
        id: "b",
        text: "\"B looks stronger to me. Better references, lower cost, and A's case study is old.\"",
        points: 2,
        outcome:
          "Honest and specific. Your manager now has a real disagreement to resolve. Raj is likely to push back hard, and because you've framed it as A versus B, it becomes you versus him.",
        cost: "You've made the right points in a shape that invites a fight rather than a look at the facts.",
      },
      {
        id: "c",
        text: "\"Raj, what is it about A that the proposal isn't showing me? On paper B's references look stronger and the A case study is from 2023.\"",
        points: 3,
        outcome:
          "You've put your evidence on the table and asked Raj to put his beside it. If his nine years contain something real, you'll hear it and learn. If his confidence is mostly habit, that becomes visible to everyone without you having to say it.",
        cost: "It requires you to actually be open to his answer, not just set a trap.",
      },
      {
        id: "d",
        text: "\"Could we get another week to look at both more carefully?\"",
        points: 1,
        outcome:
          "The deadline is Friday for a reason. You've turned a question about your judgement into a request for someone else to make the decision later.",
        cost: "Delay feels safe and usually just means the decision gets made with less of you in it.",
      },
    ],
    principle: {
      title: "Separate confidence from evidence",
      body: "How sure someone sounds is information about them, not about the decision. Ask what they know, not how they feel.",
    },
    insight:
      "Raj's certainty is doing a lot of work in this room, and it's easy to mistake it for knowledge. It might be knowledge. The way to find out is to ask him for the specific thing his experience is telling him, while putting your own specifics beside it. That's not a challenge; it's how you'd want to be asked. If the answer is good, the team gets it. If it isn't, nobody had to lose face for the better option to win.",
  },
  {
    id: "the-apology-that-isnt",
    category: "conflict",
    difficulty: 3,
    title: "\"Sorry you feel that way\"",
    setup: [
      "Your partner forgot your sister's birthday dinner. You'd mentioned it three times. You ended up going alone and making excuses.",
      "You brought it up this morning, calmly, you think. They said: \"I'm sorry you feel let down. I've had a lot on.\"",
      "It's an apology in shape only, and you both know it. They're now making coffee as if the matter is closed.",
    ],
    prompt: "What do you do?",
    choices: [
      {
        id: "a",
        text: "Let it go. They said sorry, technically, and they have had a lot on.",
        points: 1,
        outcome:
          "The morning stays calm. The thing stays unresolved, and the shape of that apology, where your feelings are the problem, becomes the template for next time.",
        cost: "Accepting a non-apology to keep the peace teaches both of you that the peace matters more than the repair.",
      },
      {
        id: "b",
        text: "\"That's not an apology. You're sorry I feel let down, not that you let me down.\"",
        points: 2,
        outcome:
          "Accurate, and sometimes necessary. But as an opening it's a grammar lesson, and people who are already defensive hear it as a trap. You may get the right words, delivered grudgingly, which isn't really what you wanted.",
        cost: "Winning the point about the wording can cost you the actual conversation.",
      },
      {
        id: "c",
        text: "\"I don't need you to be sorry I'm upset. I need you to get why going alone was rubbish. Can we talk about that bit?\"",
        points: 3,
        outcome:
          "You've skipped the argument about the apology and gone to what you actually want: to be understood. It's hard to be defensive against. Most people, asked that way, do try to say what they get about it, and that's the thing the sorry was supposed to carry.",
        cost: "It means saying a vulnerable thing out loud to someone who just dodged. That takes some steadiness.",
      },
      {
        id: "d",
        text: "Go cold for the day and let them work out why.",
        points: 0,
        outcome:
          "They notice, probably. They may or may not connect it to the dinner. Either way, you've now got two problems: the missed dinner and a day of silence that also needs an apology, and you've made yourself the one who escalated.",
        cost: "Withdrawal punishes without explaining, and the lesson it teaches is to avoid you, not to show up.",
      },
    ],
    principle: {
      title: "Ask for understanding, not the right words",
      body: "A real apology is evidence that someone gets it. Skip the evidence and ask for the thing itself.",
    },
    insight:
      "\"Sorry you feel that way\" is annoying because it moves the problem into your head: you're the one with the feelings. The instinct is to correct the wording, but that turns the morning into a debate about apologies, which your partner can lose without ever understanding anything. What you actually want is for them to see the evening from your side. So ask for that, directly. If they can do it, the apology sorts itself out. If they genuinely can't, that's the real information.",
    uncertain:
      "Whether \"I've had a lot on\" is a deflection or a real cry for help. The question in option C is open enough to find out.",
  },
  {
    id: "the-short-texts",
    category: "uncertainty",
    difficulty: 2,
    title: "Short replies",
    setup: [
      "You've been seeing someone for two months. It's been easy, lots of long messages, in-jokes, the whole thing.",
      "For the last three days their replies have been short. \"Ha yeah.\" \"Sounds good.\" \"Busy day, talk later x.\" Still an x. Still replying. But the texture has gone.",
      "Your brain has already written four explanations, and three of them are bad.",
    ],
    prompt: "What do you do?",
    choices: [
      {
        id: "a",
        text: "Match their energy. Short replies back. See if they notice.",
        points: 0,
        outcome:
          "Now you're both being short, each reading the other's brevity as a signal. If they were just busy, you've invented a cooling-off from nothing. If they weren't, you've made it harder to find out.",
        cost: "Mirroring a withdrawal you don't understand turns a maybe into a definitely.",
      },
      {
        id: "b",
        text: "\"Hey, you've seemed a bit distant this week. Did I do something?\"",
        points: 1,
        outcome:
          "You've asked, which is good. But \"did I do something\" hands them a script where the answer is about you, and puts them in the position of reassuring you before they've said what's going on.",
        cost: "Asking whether you're the problem makes it awkward to say the real thing, which is probably about their week.",
      },
      {
        id: "c",
        text: "\"You sound flat out this week. Everything okay your end?\"",
        points: 3,
        outcome:
          "You've noticed, kindly, and asked an open question with the most likely explanation built in. If it's work, they'll say. If it's about you, you've opened the door without walking through it first. Either way, you've shown you're paying attention without making it a test.",
        cost: "You have to be willing to accept \"yeah just mad busy\" as the answer and not keep digging.",
      },
      {
        id: "d",
        text: "Wait it out. Three days isn't anything. Don't be that person.",
        points: 2,
        outcome:
          "Often right. Short replies for three days is, most of the time, just three days. The risk is only that if something is actually wrong, you've spent the week narrating it to yourself instead of asking.",
        cost: "Patience is a virtue until it's avoidance. The difference is whether you'd feel fine asking.",
      },
    ],
    principle: {
      title: "Check the simplest explanation first",
      body: "Before you act on the story in your head, ask the question that would rule out the boring version.",
    },
    insight:
      "Three days of short texts has at least four explanations and your brain has picked the worst, because that's what brains do with gaps. The useful move isn't to decide which story is true; it's to ask in a way that lets the boring one be the answer. \"Everything okay your end?\" costs nothing, doesn't make it about you, and gets you information instead of three more days of interpretation.",
    alsoDefensible:
      "Waiting is fine if you can genuinely wait without stewing. If you're checking the time between replies, you can't, and you should ask.",
  },
  {
    id: "interrupted",
    category: "under-pressure",
    difficulty: 2,
    title: "Talked over",
    setup: [
      "You're halfway through explaining why the launch date should move. You've got the numbers. It's going well.",
      "Then Helena cuts across you: \"Sorry, can I just jump in, because I think the real issue is...\" and she's off, on a related but different point. Two minutes later she's still going and the conversation has followed her.",
      "The meeting has eight minutes left. Your point was the important one.",
    ],
    prompt: "What do you do?",
    choices: [
      {
        id: "a",
        text: "Let it go. Email the numbers to everyone afterwards.",
        points: 1,
        outcome:
          "The email gets read by half the room, after the decision has drifted in Helena's direction. Being interrupted once has become being absent from the conversation.",
        cost: "An email is a record, not a say. The decision is being shaped now.",
      },
      {
        id: "b",
        text: "At her next breath: \"Helena, I wasn't finished.\"",
        points: 1,
        outcome:
          "You get the floor back, and the room gets a jolt. It's a legitimate thing to say, but delivered cold it sounds like the problem is Helena rather than the launch date, and that's what people remember.",
        cost: "Reclaiming the floor is right. Doing it as a rebuke makes the interruption the story.",
      },
      {
        id: "c",
        text: "\"That connects to what I was getting to. Can I finish the numbers, because they change what Helena's describing.\"",
        points: 3,
        outcome:
          "You've taken the floor back, acknowledged her point without conceding it, and told the room why they should listen: your numbers affect her issue. It's hard to refuse and it doesn't make an enemy.",
        cost: "You need to actually land the point quickly once you have the floor. This buys you one clean minute, not ten.",
      },
      {
        id: "d",
        text: "Wait for the chair to bring it back to you.",
        points: 1,
        outcome:
          "The chair is also listening to Helena. With eight minutes left, the agenda is now whatever is being discussed, and that's not your point.",
        cost: "Waiting for someone else to restore your turn assumes they noticed it was taken.",
      },
    ],
    principle: {
      title: "Take the floor back with a reason",
      body: "\"I wasn't finished\" asks for fairness. \"This changes what you're describing\" gives the room a reason to want you back.",
    },
    insight:
      "Being interrupted feels like a question of manners, which is why the instinct is to either suffer it or call it out. Neither gets the launch date discussed. The room doesn't care whose turn it is; it cares what's useful. So link your point to the one that's now on the table and make it clear yours affects it. You get your minute back and Helena doesn't have to lose anything for you to have it.",
  },
  {
    id: "the-last-minute-favour",
    category: "boundaries",
    difficulty: 1,
    title: "The favour at 6pm",
    setup: [
      "It's Friday, ten past six. You're putting your coat on. You've got dinner plans you've rearranged twice already.",
      "Your colleague Jess appears, laptop open: \"I'm so sorry, I know it's late, but could you look over this deck before I send it? It'll take you ten minutes, you're so much better at this than me.\"",
      "It will not take ten minutes. It never does. Jess is lovely and this is the third Friday running.",
    ],
    prompt: "What do you say?",
    choices: [
      {
        id: "a",
        text: "\"Of course, send it over.\" Text your dinner that you'll be late.",
        points: 0,
        outcome:
          "Forty minutes later you're on the train rewriting slide nine, dinner is annoyed, and Jess has learned that 6pm on Friday is a fine time to ask.",
        cost: "Every yes you don't mean sets the price for the next request.",
      },
      {
        id: "b",
        text: "\"Sorry, no, I'm out the door. Good luck with it.\"",
        points: 2,
        outcome:
          "Clear, quick, and you make dinner. Jess is a bit stranded and the Friday pattern is at least interrupted. It's a perfectly fair answer; it just doesn't leave her with anywhere to go.",
        cost: "The flat no protects your evening and nothing else, which is sometimes exactly right.",
      },
      {
        id: "c",
        text: "\"I can't tonight, I've got plans. If it can wait, I'll give it a proper look first thing Monday. If it can't, the thing I'd check is whether the ask on the last slide is clear.\"",
        points: 3,
        outcome:
          "You've said no to tonight, offered a real alternative, and given her the one thing you'd look at, which is probably what she needs. Jess sends it or waits, either way without you. And a boundary with an alternative attached is much easier for people to hear.",
        cost: "Slightly more words at the door than you'd like. Thirty seconds, not forty minutes.",
      },
      {
        id: "d",
        text: "\"Ten minutes, max. Tops.\" Set a timer on your phone.",
        points: 1,
        outcome:
          "The timer goes off at slide four. Now you have to choose between leaving the deck half-reviewed and breaking your own rule, and whichever you pick, you'll do this again next Friday.",
        cost: "Negotiating a smaller yes still says yes to the pattern.",
      },
    ],
    principle: {
      title: "Decline the time, not the person",
      body: "\"Not now, here's when\" keeps the relationship and your evening. \"Yes\" costs the evening; \"no\" costs a bit of the relationship.",
    },
    insight:
      "Jess's \"ten minutes\" is sincere, and that's the trap: she believes it, so saying no feels disproportionate. But you're not declining ten minutes; you're declining the third Friday in a row. The move is to make the no about tonight rather than about her, and to attach something useful, a time or a tip, so she walks away with a next step instead of a rejection. People remember how a no felt far longer than what it cost them.",
    alsoDefensible:
      "The plain no is fine. You don't owe a Monday slot or a tip. The point is only that offering one makes the no land as help rather than refusal, which matters with someone you'll see every day.",
  },
  {
    id: "friends-bad-idea",
    category: "awkward",
    difficulty: 2,
    title: "Your friend's business idea",
    setup: [
      "Your friend Leo has been talking about quitting his job for months. Tonight he's finally shown you the plan: an app for finding people to walk your dog, in a town where everyone already knows everyone's dog.",
      "He's lit up. He's clearly already decided. He's spent £900 on a logo.",
      "\"So. Honestly. What do you think?\"",
    ],
    prompt: "What do you say?",
    choices: [
      {
        id: "a",
        text: "\"I love it. Go for it.\"",
        points: 0,
        outcome:
          "He's thrilled tonight. In six months, if it goes the way you think it will, he'll remember that you were the one who said go for it, and you'll remember that you knew.",
        cost: "Enthusiasm that isn't true isn't support. It's just easier.",
      },
      {
        id: "b",
        text: "\"Honestly? I don't think there's a market. Everyone here already has someone for their dog.\"",
        points: 1,
        outcome:
          "True, and he asked. But delivered as a verdict on the night he showed you the logo, it lands as \"your dream is stupid.\" He defends it, you double down, and he stops showing you things.",
        cost: "Being right about the idea and wrong about the moment loses you the chance to be useful later.",
      },
      {
        id: "c",
        text: "\"Walk me through who the first ten customers are. Like actual people. Who's the first?\"",
        points: 3,
        outcome:
          "You've shown real interest and asked the question that matters, and he has to answer it himself. If there's a market, he'll name people and you'll both learn something. If he can't, he discovers the gap in his own words, which is the only way anyone discovers it.",
        cost: "It's slower than a verdict and he might not thank you for the question tonight.",
      },
      {
        id: "d",
        text: "\"It's a big step. Have you thought about doing it on the side first?\"",
        points: 2,
        outcome:
          "Sensible, and probably the right advice. It also skips past the idea itself to risk management, which he'll hear as \"you're not sure,\" without you ever having said what you're not sure about.",
        cost: "Advising caution without engaging with the plan is a polite way of not answering the question.",
      },
    ],
    principle: {
      title: "Ask the question, don't give the verdict",
      body: "A doubt you deliver gets defended. A doubt someone finds themselves gets taken seriously.",
    },
    insight:
      "Leo didn't ask \"what do you think\" to get a review. He asked for support, and the honest problem is that support and honesty seem to point in different directions. They don't have to. The specific question, who is the first customer, is more supportive than \"go for it\" because it treats the plan as real. And it's more honest than \"there's no market\" because it lets the market answer. Your job tonight isn't to be right; it's to be the friend he still wants to show things to.",
  },
  {
    id: "the-dinner-bill",
    category: "trade-offs",
    difficulty: 1,
    title: "Splitting the bill",
    setup: [
      "Birthday dinner for a friend, nine of you. You had a main and tap water because you're saving for a deposit. The two people opposite had cocktails, starters, and a bottle of something.",
      "The bill arrives. Someone says, as someone always does: \"Shall we just split it nine ways? Easier.\"",
      "Nine ways is £62. Your share is about £24.",
    ],
    prompt: "What do you do?",
    choices: [
      {
        id: "a",
        text: "Pay the £62. It's a birthday. Don't be that person.",
        points: 1,
        outcome:
          "The table stays easy and you're £38 lighter than you planned. Which is fine once. The problem is it's never once, and \"don't be that person\" is a rule you've only ever applied to yourself.",
        cost: "Paying to avoid a four-second conversation is a habit that compounds.",
      },
      {
        id: "b",
        text: "\"I'll just put in for mine, I only had the one thing.\" Put £30 in and move on.",
        points: 3,
        outcome:
          "Said lightly, with the cash already in, this takes about four seconds and nobody thinks about it again. You've paid your share plus a bit, which is all a birthday needs.",
        cost: "A brief moment where you feel like the one who broke the vibe. The vibe recovers immediately.",
      },
      {
        id: "c",
        text: "\"Can we do it properly? Some people had a lot more than others.\"",
        points: 1,
        outcome:
          "True, and now the table is doing arithmetic, two people feel singled out, and the birthday person is watching their dinner turn into an audit.",
        cost: "Fixing the whole system is a bigger job than fixing your bit of it, and this isn't the night.",
      },
      {
        id: "d",
        text: "Pay the £62, then message the organiser later to say the split wasn't really fair.",
        points: 0,
        outcome:
          "You've paid in full and complained after, which is the combination nobody respects. The organiser can't un-split a bill, so the message just makes them feel bad.",
        cost: "Raising it afterwards has all the awkwardness and none of the benefit.",
      },
    ],
    principle: {
      title: "Solve your bit, not the system",
      body: "You don't need the table to agree on fairness. You need to pay for what you had, cheerfully, and let the rest sort itself out.",
    },
    insight:
      "The fear here is social, not financial: being seen as the person who makes a thing of it. But the two options people reach for, paying up silently or demanding an itemised split, are both about the whole table. The small move is to quietly sort your own share, with the money already going in so there's nothing to discuss. Nobody minds that. What people mind is the lecture about fairness, or the resentment that leaks out three dinners later.",
  },
  {
    id: "the-forgotten-name",
    category: "awkward",
    difficulty: 1,
    title: "What's their name again",
    setup: [
      "A work thing, drinks after. Someone walks up with a big smile: \"Hey! It's been ages!\" You met them. Definitely. A conference, maybe, or that project with the other agency.",
      "Their name is completely gone. They clearly remember yours.",
      "A colleague is heading over and is about to expect an introduction.",
    ],
    prompt: "What do you do?",
    choices: [
      {
        id: "a",
        text: "Bluff. \"Hey! Great to see you!\" Keep it vague and hope the name surfaces or they drift off.",
        points: 1,
        outcome:
          "It won't surface. The colleague arrives, you say \"this is... my colleague Ben,\" and leave a hole where the name should be. Everyone hears it.",
        cost: "Every minute of bluffing raises the cost of eventually admitting it.",
      },
      {
        id: "b",
        text: "\"I'm so sorry, I've completely blanked on your name, I remember the project though.\"",
        points: 3,
        outcome:
          "They say it, you say \"of course,\" and the conversation carries on. Said early and plainly, this is a three-second non-event. People forgive forgotten names instantly; what they don't forgive is being bluffed at for ten minutes.",
        cost: "One small flinch of embarrassment, over before it's finished.",
      },
      {
        id: "c",
        text: "Introduce your colleague first and hope they introduce themselves back.",
        points: 2,
        outcome:
          "Often works. Your colleague says \"Hi, I'm Ben,\" and they say \"Nadia, hi.\" Occasionally they just say \"hi\" and now there are two of you who don't know.",
        cost: "A good trick with a failure mode. Fine as a first attempt if you're ready to use option B when it doesn't land.",
      },
      {
        id: "d",
        text: "Ask them to put their number in your phone so you can catch up properly.",
        points: 1,
        outcome:
          "Clever, slightly transparent, and it doesn't help in the next thirty seconds when Ben arrives.",
        cost: "Elaborate workarounds usually take more effort than the honest sentence they're avoiding.",
      },
    ],
    principle: {
      title: "Pay the small price early",
      body: "Some embarrassments are cheap at the start and expensive later. Forgetting a name is the clearest example.",
    },
    insight:
      "You're weighing a small, certain awkwardness now against a large, possible one later, and people reliably choose the gamble. It's a bad bet. Forgotten names are one of the most universally forgiven things in social life, because everyone has done it this week. The only version that stings is the one that's been dragged out. Admit it, add the thing you do remember so they know it's not indifference, and move on.",
    alsoDefensible:
      "The introduce-your-colleague move is a fine first attempt. Just have the honest line ready for when it doesn't produce the name.",
  },
];
