# Instinct

Five everyday social situations. Five instinctive decisions. One surprisingly revealing result.

A mobile-first social judgement game built with Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS 4 and Motion, deployed on Vercel. No accounts, no database, no AI at runtime.

- `/`: the hook. Headline, one sentence, one button, and a peek at today's five.
- `/play`: today's five (a new set at the player's local midnight) then a reveal after each, then your social aura. Then another five.
- `/r/<archetype>`: a shareable result page with its own social preview; `/r/<archetype>/card` (4:5) and `/card-square` are the PNG cards.
- `/c/<code>`: a challenge link for one situation; the sender's answer stays hidden until the recipient answers.
- `/about`: what it is, what it isn't, what it keeps.
- `/palettes`: preview the three colour palettes on your own phone (not linked from the game).

## Local setup

```bash
npm install
npm run dev        # http://localhost:3000
```

Checks (all must pass before pushing):

```bash
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm test           # vitest: content limits, engine, archetypes, challenge codes
npm run build      # production build
```

Optional environment (`.env.local`, see `.env.example`): `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `NEXT_PUBLIC_SITE_URL`.

## Deploying to Vercel

1. Push to GitHub.
2. Vercel → Add New → Project → import the repo. Next.js is detected; nothing to change.
3. Settings → Environment Variables: optional. The site URL is picked up from Vercel automatically at build time; set `NEXT_PUBLIC_SITE_URL` only for a custom domain. Add `NEXT_PUBLIC_POSTHOG_KEY` if you want product analytics.
4. Enable Web Analytics and Speed Insights in the project tabs.
5. Deploy. Social previews and card PNGs render on the Node runtime from the self-hosted fonts in `app/fonts`.

CLI: `npx vercel` (preview), `npx vercel --prod`.

## Layout

```
app/                   routes, layout, fonts, OG images, card PNG routes, error and 404
components/game/       GameShell, SituationScreen, AnswerOption, Progress, RevealScreen,
                       AlternativePaths, ResultScreen, AuraCard, MotifMark, ShareActions, Game, PlayGame
components/            Wordmark, ForkMark, beacons, challenge ShareButton
lib/content/           the scenario library (authored, append-only) and its limits
lib/game/              engine (today's five, another five), archetypes (scoring), stores, challenge codec
lib/analytics/         typed events and the provider abstraction
lib/aura-image.tsx     the PNG card (ImageResponse)
tests/                 vitest
PRODUCT.md · DESIGN.md · ANALYTICS.md
```

## Content rules

Psychology notes live in `lib/content/science.ts`, keyed by scenario id. Only add a finding that has held up (replicated, meta-analysed, or a classic that stands), say what was actually found, and give a source someone can look up. Most situations don't need one.


Append to `lib/content/scenarios-3.ts` (or a new file registered in `lib/content/index.ts`). Tests enforce: unique kebab-case id, ≤ 48-char title, ≤ 270-char setup, four choices ≤ 100 chars with a verdict ≤ 60, one or two `gets` and `costs` lines ≤ 100, at least one dimension scored per choice and at least three distinct score directions per scenario, no claims of scientific authority. **Never reorder or delete**: challenge codes encode position.

## Honesty notes

- The social aura is a read of five choices under explicit rules (`lib/game/archetypes.ts`). The UI says so. It measures a round, not a person.
- Challenge links obscure the sender's answer; they don't encrypt it.
- Progress is per device and does not sync.
- Native image sharing needs a real phone browser; it was tested here only as far as a headless browser allows (the download and copy fallbacks).
