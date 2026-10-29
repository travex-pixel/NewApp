# Analytics

Instinct records anonymous product events so the funnel can be measured against real behaviour. Nothing here is personal: no names, no emails, no free text. Scenario IDs, choice letters, categories, referrer hostnames and challenge types only.

## Providers

| Provider | What it does | Enabled when |
|---|---|---|
| **PostHog** (`posthog-js`) | Product events (everything below), pageviews, pageleaves. | `NEXT_PUBLIC_POSTHOG_KEY` is set. Otherwise events are dropped in production and logged to the browser console in development. |
| **Vercel Web Analytics** (`@vercel/analytics`) | Pageviews and visitors. Custom events are sent too, and are recorded if the Vercel project has custom events enabled (Pro plan). | Automatically on Vercel once Web Analytics is turned on for the project. Locally the script 404s harmlessly. |
| **Vercel Speed Insights** | Core Web Vitals per route. | Automatically on Vercel once Speed Insights is turned on for the project. |

The game never talks to a provider directly. Everything goes through `lib/analytics/index.ts` (`track`, `trackOnce`), with the event schema in `lib/analytics/events.ts`. Swapping providers means changing one file.

**Nothing is recorded unless the provider is configured.** The code does not pretend otherwise; `analyticsConfigured()` tells you the truth at runtime.

## Environment variables

```
NEXT_PUBLIC_POSTHOG_KEY=phc_...            # required for PostHog
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com   # optional; defaults to the EU host
NEXT_PUBLIC_SITE_URL=https://instinct.example       # used for absolute URLs in metadata; Vercel's URL is used if unset
```

PostHog is initialised lazily (dynamic import after first paint) with `autocapture: false` and `person_profiles: "identified_only"`, so no profiles are created for anonymous players and no DOM clicks are captured beyond the events listed here.

## Events

All events carry a `mode` where relevant: `round` (a normal five-situation round), `challenge` (opened from a `/c/<code>` link), or `daily`.

| Event | Fires | Where | Properties |
|---|---|---|---|
| `landing_viewed` | Once per load of `/`. | `components/LandingBeacon.tsx` | `referrer_host` (external hostname only, if any) |
| `start_clicked` | Any click on a link to `/play` on the landing page. | `LandingBeacon` | – |
| `first_scenario_viewed` | Once per page lifetime, when a player with **no prior plays on this device** sees a scenario. | `components/Game.tsx` | `scenario_id`, `category`, `mode` |
| `scenario_viewed` | Once per scenario per page lifetime, when it is on screen in the answer phase. | `Game` | `scenario_id`, `category`, `mode`, `position` (1-based within the round) |
| `answer_selected` | Every answer. | `Game` | `scenario_id`, `category`, `choice_id` (`a`–`d`), `points` (0–3), `mode` |
| `first_scenario_completed` | Once per page lifetime, on the first answer by a player with no prior plays on this device. | `Game` | `scenario_id`, `mode` |
| `three_scenarios_completed` | Once per page lifetime, on the third answer in the current session. | `Game` | `mode` |
| `five_scenarios_completed` | Once per page lifetime, on the fifth answer in the current session. | `Game` | `mode` |
| `session_completed` | When a full round's result screen is reached. | `Game` | `points`, `max_points`, `round_number` |
| `challenge_created` | Once per challenge code per page lifetime, when a share button is pressed (a link now exists). | `components/ShareButton.tsx` | `scenario_id`, `challenge_type` (`scenario` or `daily`) |
| `share_attempted` | Each time a share is attempted, per method. Native first; clipboard if native is unavailable or fails for a reason other than the user cancelling. | `ShareButton` | `scenario_id`, `method` (`native` / `clipboard`), `challenge_type` |
| `share_succeeded` | Native: `navigator.share` resolved (the user completed the sheet). Clipboard: `writeText` resolved. A cancelled share sheet is **not** a success and not a failure. | `ShareButton` | same as above |
| `challenge_link_opened` | Once per page lifetime when a `/c/<code>` page renders. | `components/ChallengeBeacon.tsx` | `scenario_id` (or `"invalid"`), `valid` |
| `challenge_completed` | When a player answers in challenge mode. | `Game` | `scenario_id`, `same_choice` (did they pick what the sender picked) |
| `daily_challenge_completed` | When a player answers the daily. | `Game` | `scenario_id`, `date` (UTC `YYYY-MM-DD`), `points` |
| `return_visit` | On load, if the device's last recorded visit was ≥ 1 calendar day ago. | `components/AnalyticsProvider.tsx` | `days_since_last` |

Not implemented, because the features don't exist yet: `upgrade_page_viewed`, `purchase_completed`. They will be added only when there is a real upgrade page and real payment processing.

### Deduplication

`trackOnce(key, event, props)` guards funnel milestones with an in-memory set for the lifetime of the page, so React re-renders, effect re-runs and Strict Mode double-invocations do not double-fire. Keys are listed in `Game.tsx`, `LandingBeacon.tsx`, `ShareButton.tsx` and `ChallengeBeacon.tsx`. A full page reload resets the set, which is the intended behaviour for "viewed" style events.

### The funnel

```
VISITOR  → landing_viewed
STARTED  → start_clicked  (or first_scenario_viewed, for direct /play, /daily and /c links)
FIRST    → first_scenario_completed
FIVE     → five_scenarios_completed
SHARED   → share_succeeded
RETURNED → return_visit
```

In PostHog, build a funnel insight with those six steps. Break down by `mode` and `referrer_host`.

## Checking it works

1. Locally, with no PostHog key: open the browser console; every event prints as `[analytics] <event> {…}`.
2. With a key: PostHog → Activity shows events within a few seconds. Session recordings are off.
3. On Vercel: Analytics tab for pageviews; Speed Insights tab for vitals.

## Reliable vs unreliable metrics

Reliable:
- Landing → start → first scenario → five scenarios conversion, per device.
- Which scenarios and choices are picked, and how often each choice "backfires".
- Share success rate by method, and challenge open → completed rate.
- Same-choice rate on challenges.

Reliable with caveats:
- `return_visit` is per device and per browser. Clearing storage, private windows and in-app browsers (which often isolate storage) under-count returns.
- `share_succeeded` via native share means the OS sheet closed with success, not that a message was sent.

Not measurable yet:
- Whether a specific challenge link was opened by the specific person it was sent to (no server, no IDs).
- Cross-device behaviour of any kind.
- Anything about "who" the player is. By design.

## Privacy

No personal identifiers are sent. Scenario text is not sent (only IDs). Referrers are reduced to hostnames. Progress lives in `localStorage` under `instinct:*` and is never uploaded. If a privacy page is added, it should say exactly this.
