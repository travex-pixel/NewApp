# Instinct

A social intelligence game. Real situations, hard choices, and the one idea worth keeping from each. Built with Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS 4, deployed on Vercel.

- `/` — the opening. Headline, the first situation visible, one button.
- `/play` — a round of five situations, then a result.
- `/daily` — one situation for everyone, resets at midnight UTC.
- `/c/<code>` — a challenge link. The sender's answer is hidden until the recipient answers.
- `/about` — what the game is, what it isn't, what it stores.

No accounts, no database, no LLM at runtime. Progress is stored in the browser. Challenge state is carried in the URL.

## Local setup

```bash
npm install
npm run dev        # http://localhost:3000
```

Checks:

```bash
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm test           # vitest: content, engine, challenge codes, daily
npm run build      # production build
```

Optional environment (`.env.local`, see `.env.example`):

```
NEXT_PUBLIC_POSTHOG_KEY=        # product analytics; events are dropped without it
NEXT_PUBLIC_POSTHOG_HOST=       # defaults to https://eu.i.posthog.com
NEXT_PUBLIC_SITE_URL=           # absolute URL for social previews; Vercel's URL is used if unset
```

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel: **Add New → Project**, import the repo. Framework is detected as Next.js; no build settings to change.
3. Under **Settings → Environment Variables**, add `NEXT_PUBLIC_POSTHOG_KEY` (and host) if you want product analytics. Nothing else is required.
4. Under the project's **Analytics** and **Speed Insights** tabs, click Enable. The components are already in the layout.
5. Deploy. Social previews (`/opengraph-image`, `/c/<code>/opengraph-image`) are generated on the Node runtime from the self-hosted fonts in `app/fonts`.

Or from the CLI: `npx vercel` (preview), `npx vercel --prod`.

## Project layout

```
app/                  routes, layout, fonts, social images, error and 404 pages
components/           Game (state machine), ChoiceList, Reveal, RoundResult, ShareButton, …
lib/content/          the scenario library and its types (authored, append-only ids)
lib/game/             engine (rounds, scoring, milestones), challenge codec, daily, storage
lib/analytics/        typed events and the provider abstraction
tests/                vitest unit tests
PRODUCT.md            durable product truth
DESIGN.md             the visual system
ANALYTICS.md          every event, where it fires, how to read it
```

## Adding a scenario

Append to `lib/content/scenarios-3.ts` (or a new file registered in `lib/content/index.ts`). Rules the tests enforce: unique kebab-case `id`, three or four choices, exactly one `points: 3`, every choice has an `outcome`, a principle title of seven words or fewer, no claims of scientific authority. **Never reorder or remove scenarios**: challenge codes encode the scenario's position in `SCENARIOS`.

## Honesty notes

- The score measures play inside the game's rules. It is not a measure of a person, and the UI says so.
- Challenge links obscure the sender's answer; they don't encrypt it. Anyone determined can read a four-character code. That's fine for a game.
- Progress does not sync across devices. The result screen says so.
- Fonts: Fraunces and Instrument Sans, both under the SIL Open Font License, self-hosted from `@fontsource`.
