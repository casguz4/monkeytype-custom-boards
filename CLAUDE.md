# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MonkeyType Battle — a web app to compare typing statistics between MonkeyType users. Users enter usernames via a form, the app fetches profiles from the MonkeyType public API, and displays comparison stats (WPM, accuracy, tests completed, time typing).

## Tech Stack

- **Framework**: React Router v7 (SSR enabled) with Vite
- **Runtime/Deploy**: Cloudflare Workers (via `@cloudflare/vite-plugin`)
- **Styling**: Tailwind CSS v4 with shadcn/ui (new-york style, `rsc: false`)
- **Linting**: oxlint (type-aware) + ESLint; formatting with oxfmt
- **Pre-commit**: Husky + lint-staged (runs oxlint on JS/TS, oxfmt on all files)
- **Package manager**: pnpm

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build (react-router build)
- `pnpm run preview` — build then preview locally with Vite
- `pnpm run check` — full check: typecheck + build + wrangler dry-run deploy
- `pnpm run typecheck` — runs `cf-typegen` then `oxlint`
- `pnpm run lint` — oxlint with type-aware checking, zero warnings allowed
- `pnpm run lint:fix` — auto-fix lint issues
- `pnpm run format` — format with oxfmt
- `pnpm run format:check` — check formatting without writing
- `pnpm run deploy` — deploy to Cloudflare Workers via wrangler
- `pnpm run cf-typegen` — regenerate Cloudflare types + react-router types
- `pnpm run gen:readme` — auto-generate README via `@stephansama/auto-readme`

No test runner is configured.

## Architecture

- **`app/routes.ts`** — single layout route wrapping `routes/home.tsx`
- **`app/routes/home.tsx`** — main page; contains `MTUserClient` (fetches from `api.monkeytype.com/users/`), stat transformation logic, and the comparison UI state machine (form → loading → results)
- **`app/layout.tsx`** — shared shell (header, footer, Toaster)
- **`app/components/`** — feature components (`UserInputForm`, `StatsGrid`, `ComparisonHighlights`, `UserStatsDataGrid`, `LoadingState`)
- **`app/components/ui/`** — shadcn/ui primitives (do not edit manually; managed via `npx shadcn@latest add`)
- **`app/@types/api.ts`** — global `UserProfile` type (ambient, no export) matching MonkeyType API shape
- **`app/lib/url.ts`** — URL search param helpers for syncing form state to `?users=` query param
- **`workers/app.ts`** — Cloudflare Worker entry point; creates React Router request handler with `cloudflare.env` context

## Path Aliases

`~` maps to `./app` (configured in both vite.config.ts and tsconfig). Use `~/components/...`, `~/lib/...` etc.

## Key Patterns

- The `UserProfile` type in `app/@types/api.ts` is ambient (globally available without import)
- MonkeyType API calls happen client-side in the route component, not in a loader
- User list is synced to `?users=` query param so comparisons are shareable via URL
- Use `oxlint-disable-next-line` (not eslint-disable) for lint suppressions
- **oxfmt + Tailwind v4 caveat**: `experimentalTailwindcss` in `.oxfmtrc.jsonc` is disabled because it's incompatible with Tailwind v4's CSS-based config — enabling it will strip all `className` strings to empty `''`. Do not re-enable until oxfmt adds Tailwind v4 support.
- `format:fix` script in package.json has a typo (`oxmft` instead of `oxfmt`) — use `pnpm run format` instead
