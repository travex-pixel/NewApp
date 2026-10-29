# Instinct

A social judgement game: five everyday situations, a verdict per answer, a shareable social aura at the end. Next.js 16 App Router (Cache Components on), TypeScript strict, Tailwind CSS 4, Motion, deployed on Vercel. No database, no accounts, no LLM at runtime.

Read `PRODUCT.md` (what it is and isn't), `DESIGN.md` (the paper-and-ink system) and `ANALYTICS.md` (events) before changing anything user-facing.

## Working rules

- This Next.js is newer than training data. Read `node_modules/next/dist/docs/` for the API in question before using it; don't rely on memory. Cache Components means runtime APIs (`params`, `searchParams`, `cookies`, `Date.now()` in server components) must sit under `<Suspense>`.
- Server Components by default. `"use client"` only for state, effects, browser APIs.
- Only `NEXT_PUBLIC_*` variables reach the browser. There are no secrets in this project yet; keep it that way unless a server-side integration genuinely needs one.
- Content is append-only: never reorder or delete entries in `lib/content/` because challenge codes encode positions. Every scenario must fit one phone screen; `npm test` enforces the length limits in `lib/content/types.ts`.
- The situation and reveal screens must not scroll at 390×844. Check with the QA walk (Playwright) after layout changes.
- No fake data: no invented user counts, testimonials, scores, or science. The score is explicitly "how you played this round".
- Analytics go through `lib/analytics` only. Add new events to `lib/analytics/events.ts` and document them in `ANALYTICS.md`.
- Before pushing: `npm run typecheck && npm run lint && npm test && npm run build`.

## Skills in this repo

- `/impeccable` for UI work (`polish`, `audit`, `critique`, `adapt`). `DESIGN.md` and `PRODUCT.md` are its inputs.
- `vercel-react-best-practices`, `vercel-composition-patterns` for React/Next.js code.
- `web-design-guidelines` for accessibility and UX review.
- `vercel-react-view-transitions` if route animations are added.
- `deploy-to-vercel`, `vercel-optimize` for deployment and cost/caching on a live deployment.

## Reference docs

### Next.js
- Local, version-exact: `node_modules/next/dist/docs/01-app/`
- Docs: https://nextjs.org/docs
- Caching (Cache Components): https://nextjs.org/docs/app/getting-started/caching
- Metadata and OG images: https://nextjs.org/docs/app/getting-started/metadata-and-og-images

### React
- API reference: https://react.dev/reference/react
- Server Components: https://react.dev/reference/rsc/server-components

### Vercel
- Docs: https://vercel.com/docs
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs
- Environment variables: https://vercel.com/docs/environment-variables
- Web Analytics custom events: https://vercel.com/docs/analytics/custom-events

### Analytics
- PostHog JS: https://posthog.com/docs/libraries/js

### Styling
- Tailwind CSS v4: https://tailwindcss.com/docs
- Vercel web interface guidelines: https://vercel.com/design/guidelines
