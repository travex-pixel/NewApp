# Analytics

Instinct records anonymous product events so the funnel can be measured against real behaviour. Nothing here is personal: scenario IDs, choice letters, categories, archetype IDs, referrer hostnames and share methods only.

## Providers

| Provider | What it does | Enabled when |
|---|---|---|
| **PostHog** (`posthog-js`) | Product events (everything below), pageviews, pageleaves. | `NEXT_PUBLIC_POSTHOG_KEY` is set. Otherwise events are dropped in production and logged to the browser console in development. |
| **Vercel Web Analytics** (`@vercel/analytics`) | Pageviews and visitors. Custom events are sent too and recorded if the Vercel project has custom events enabled. | Automatically on Vercel once Web Analytics is turned on for the project. Locally the script 404s harmlessly. |
| **Vercel Speed Insights** | Core Web Vitals per route. | Automatically on Vercel once enabled for the project. |

The game never talks to a provider directly: `lib/analytics/index.ts` (`track`, `trackOnce`), schema in `lib/analytics/events.ts`. **Nothing is recorded unless a provider is configured**, and the code does not pretend otherwise.

## Environment variables

```
NEXT_PUBLIC_POSTHOG_KEY=phc_...                      # required for PostHog
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com   # optional
NEXT_PUBLIC_SITE_URL=https://instinct.example       # absolute URL for share links and previews
```

PostHog initialises lazily after first paint with `autocapture: false` and `person_profiles: "identified_only"`: no profiles for anonymous players, no DOM click capture.

## Events

`mode` is `round` (today's five / another five) or `challenge` (opened from a `/c/<code>` link).

| Event | Fires | Where | Properties |
|---|---|---|---|
| `landing_viewed` | Once per load of `/`. | `components/LandingBeacon.tsx` | `referrer_host` |
| `start_clicked` | Click on a link to `/play` on the landing page. | `LandingBeacon` | – |
| `scenario_viewed` | Once per scenario per round per page lifetime. | `components/game/Game.tsx` | `scenario_id`, `category`, `mode`, `position` (1–5) |
| `answer_selected` | Every answer. Locked against double taps. | `Game` | `scenario_id`, `category`, `choice_id`, `mode`, `position` |
| `drawer_opened` | The "other paths" drawer is opened. | `Game` | `scenario_id`, `mode` |
| `round_completed` | The fifth reveal's CTA is pressed and the aura is computed. | `Game` | `archetype_id`, `round_index` (0 = today's five), `date` |
| `result_viewed` | Once per result per page lifetime. | `components/game/ResultScreen.tsx` | `archetype_id` |
| `play_again` | "Play another five". | `Game` | `round_index` |
| `share_attempted` | Each share attempt, per method. | `ShareActions`, `ShareButton` | `method`, `archetype_id` or `scenario_id` |
| `share_succeeded` | Native: the share sheet resolved. Download: the file was handed to the browser. Copy: `writeText` resolved. A cancelled sheet is neither. | same | same |
| `challenge_created` | Once per challenge code per page lifetime (a link now exists). | `components/ShareButton.tsx` | `scenario_id` |
| `challenge_link_opened` | A `/c/<code>` page renders. | `components/ChallengeBeacon.tsx` | `scenario_id` or `"invalid"`, `valid` |
| `challenge_completed` | A challenge is answered. | `Game` | `scenario_id`, `same_choice` |
| `return_visit` | Load ≥ 1 calendar day after the device's last recorded visit. | `components/AnalyticsProvider.tsx` | `days_since_last` |

Share methods: `native-image` (Web Share API with the PNG card), `download`, `copy-link`, `copy-text`, and for challenge links `native` / `clipboard`.

### Deduplication

`trackOnce(key, …)` guards milestone events with an in-memory set for the page lifetime, so re-renders, effect re-runs and Strict Mode never double-fire. `answer_selected` is guarded by the game's selection lock instead.

### The funnel

```
VISITOR  → landing_viewed
STARTED  → start_clicked  (or scenario_viewed position 1, for direct /play and /c links)
FIRST    → answer_selected position 1
FIVE     → round_completed
SHARED   → share_succeeded
RETURNED → return_visit
```

Break down by `mode`, `referrer_host` and `archetype_id`.

## Checking it works

1. Locally with no key: every event prints to the console as `[analytics] <event> {…}`.
2. With a key: PostHog → Activity within seconds.
3. On Vercel: the Analytics and Speed Insights tabs.

## Limits

- Returns are per device and per browser; in-app browsers often isolate storage, so returns are under-counted.
- `share_succeeded` via native share means the OS sheet closed with success, not that a message was sent.
- No server, no IDs: whether a specific link was opened by the specific person it was sent to can't be known.
