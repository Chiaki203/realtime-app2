# realtime-app2 (Next.js + Supabase Realtime) — Agent Notes

## What this repo is
- **Next.js 13 (Pages Router) + TypeScript + Tailwind CSS**
- **Supabase** for:
  - Auth (email/password)
  - Postgres CRUD (`profiles`, `posts`, `comments`, `notices`)
  - Realtime subscriptions (`postgres_changes`)
  - Storage buckets (`avatars`, `posts`)
- Client state/data:
  - **React Query v3** for server state (+ `Suspense` defaults)
  - **Zustand** for UI/session + edited-form state

## Quick commands
- Install: `npm ci` (or `npm install`)
- Dev server: `npm run dev` (runs on **port 4000**)
- Build: `npm run build`
- Prod server: `npm run start`
- Lint: `npm run lint`
- Cypress: `npm run cypress`

## Required environment variables
Create `.env.local` with:
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
Used in `src/utils/supabase.ts`.

Notes:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is public by design, but **never** commit service-role keys or database passwords.
- If you see auth/storage failures locally, verify the Supabase project URL + anon key pair matches the intended environment.

## App entry + main flow
- `src/pages/index.tsx`
  - Reads session from Supabase (`supabase.auth.getSession()`).
  - Listens for auth changes (`supabase.auth.onAuthStateChange`) and stores session in Zustand.
  - Renders `Auth` when logged out, `Dashboard` when logged in.

## UI structure
- `src/components/Dashboard.tsx`: 3-column dashboard
  - `UserProfile` (profile + avatar upload)
  - `Feed` (posts + comments)
  - `Notification` (notices)

## Data fetching + caching conventions
- React Query is configured in `src/pages/_app.tsx` with `suspense: true` by default.
- Query key conventions in this repo:
  - `['profile']`
  - `['posts']`
  - `['notices']`
  - `['comments', postId]`
  - `['comment-count', postId]`
  - `['avatar-url', userId]`

When changing a query key, update all related subscriptions and invalidation/removals.

## Realtime subscriptions (Supabase)
Subscriptions update React Query caches directly:
- Posts: `src/hooks/useSubscribePosts.ts`
- Notices: `src/hooks/useSubscribeNotices.ts`
- Comments per post: `src/hooks/useSubscribeComments.ts`
- Comment counts: `src/hooks/useSubscribeCommentCounts.ts`

Guidelines:
- Keep cleanup consistent (unsubscribe/remove channel) to avoid duplicate subscriptions in dev.
- Prefer updating cache in-place (as this repo does) rather than refetching everything.

## Storage usage
- Avatar upload: `src/hooks/useUploadAvatarImg.ts` → bucket `avatars`
- Post image upload: `src/hooks/useUploadPostImg.ts` → bucket `posts`
- Download preview/render: `src/hooks/useDownloadUrl.ts` (downloads file and uses `URL.createObjectURL`)

If you refactor downloads, consider revoking object URLs (`URL.revokeObjectURL`) to prevent memory leaks.

## Project layout
- `src/pages/`: Next.js routes (`_app.tsx`, `_document.tsx`, `index.tsx`)
- `src/components/`: UI components (forms/items/layout)
- `src/hooks/`: React Query hooks + Realtime hooks + Storage helpers
- `src/store/`: Zustand store (session + edited form state)
- `src/types/`: shared TS types
- `src/utils/supabase.ts`: Supabase client creation

## Cypress tests
- E2E specs live in `cypress/e2e/`.
- Current tests visit a deployed URL (see `cypress/e2e/*.cy.ts`). For local testing, update those `cy.visit(...)` calls or set a `baseUrl` in `cypress.config.ts`.
- Avoid committing real credentials into tests; use dedicated test users/secrets if possible.

## Code style / editing expectations
- Prefer small, targeted changes; follow existing patterns (React Query + hooks + Zustand).
- Keep Tailwind class usage consistent with adjacent components.
- Avoid introducing new dependencies unless needed.
