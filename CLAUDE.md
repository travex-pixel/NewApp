# NewApp

A web app built with Next.js (App Router), deployed on Vercel, with Supabase for the database, auth and storage. Styling uses Tailwind CSS and shadcn/ui.

## Working rules

- Next.js, React and Supabase APIs change between versions. Check the version in `package.json` and read the matching docs below before using an API you're not sure about. Don't rely on memory.
- Default to Server Components. Add `"use client"` only when a component needs state, effects or browser APIs.
- Never expose secrets to the browser. Only variables prefixed `NEXT_PUBLIC_` reach the client; the Supabase service role key must stay server-side.
- Every Supabase table gets Row Level Security policies before it holds user data.

## Skills in this repo

- `/impeccable` for UI design: start new work with `/impeccable init`, then `craft`, `polish`, `audit`.
- `vercel-react-best-practices` and `vercel-composition-patterns` for React and Next.js code.
- `web-design-guidelines` for accessibility and UX reviews.
- `vercel-react-view-transitions` for page and route animations.
- `deploy-to-vercel` to deploy, and `vercel-optimize` to check cost and caching on a live deployment.

## Reference docs

### Next.js
- Docs: https://nextjs.org/docs
- Getting started (App Router): https://nextjs.org/docs/app/getting-started
- Caching: https://nextjs.org/docs/app/guides/caching
- Release notes: https://nextjs.org/blog

### React
- API reference: https://react.dev/reference/react
- Server Components: https://react.dev/reference/rsc/server-components

### Vercel
- Docs: https://vercel.com/docs
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs
- Environment variables: https://vercel.com/docs/environment-variables
- Functions: https://vercel.com/docs/functions

### Supabase
- Docs: https://supabase.com/docs
- Next.js quickstart: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- Auth with Next.js (server-side): https://supabase.com/docs/guides/auth/server-side/nextjs
- Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Storage: https://supabase.com/docs/guides/storage

### Styling and UI
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/docs
- Vercel web interface guidelines: https://vercel.com/design/guidelines
