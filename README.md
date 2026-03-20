# supabase-social-dashboard

Social dashboard built with Next.js and Supabase. The app includes auth, profile management, feed posts with comments, notifications, personal notes, image uploads, and Supabase Realtime subscriptions.

## Stack

- Next.js 13 (Pages Router)
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, Storage, Realtime
- React Query
- Zustand

## Features

- Email/password authentication
- Profile editing with avatar upload
- Feed posts with image upload
- Inline post editing
- Comments with realtime count updates
- Notifications CRUD
- Personal `My Notes`
- Mobile tab navigation for `Profile`, `Feed`, and `Notification`

## Local development

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run dev
```

The development server runs on `http://localhost:4000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run cypress
```

## Supabase setup

This project expects these main tables:

- `profiles`
- `posts`
- `comments`
- `notices`
- `my_notes`

Storage buckets used by the app:

- `avatars`
- `posts`

SQL files live in `src/sql/`.

If you want realtime updates across clients, make sure the relevant tables are included in the `supabase_realtime` publication.

## Project structure

```text
src/
  components/   UI components
  hooks/        data hooks, mutations, realtime subscriptions
  pages/        Next.js pages
  store/        Zustand store
  styles/       global styles
  types/        shared types
  utils/        Supabase client
```

## Notes

- The app uses `next/font/google` to load Inter.
- React Query is configured with `suspense: true`.
- Cypress specs currently target app flows directly and may need environment-specific test accounts.
