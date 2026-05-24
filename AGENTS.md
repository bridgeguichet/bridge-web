# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Bridge is a Next.js 16 dashboard application (React 19) for "Bridge guichet" — a service platform for the Congolese diaspora, expatriates, investors, and retirees. The UI is primarily in French.
Bridge is a Next.js full-stack application (React 19) for "Bridge guichet" — a service platform for the Congolese diaspora, expatriates, investors, and retirees. The UI is primarily in French. Auth is handled by Better Auth with a Neon PostgreSQL database via Drizzle ORM.

## Commands

- **Dev server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint` (Biome)
- **Format**: `npm run format` (Biome, writes changes)
- **Check (lint + format)**: `npm run check` or `npm run check:fix`
- **Generate theme presets**: `npm run generate:presets`

There is no test framework configured in this project.

Node >= 20.9.0 is required.

## Environment Variables

- `NEXT_PUBLIC_API_URL` — base URL for client-side requests (default: `http://localhost:3000`)
- `DATABASE_URL` — Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` — secret key for Better Auth (generate: `openssl rand -base64 32`)
- `BETTER_AUTH_URL` — public URL of the app used by Better Auth (default: `http://localhost:3000`)

## Architecture

### Routing (Next.js App Router)

- `src/app/(main)/dashboard/` — authenticated dashboard pages (default, CRM, finance, users)
- `src/app/(main)/auth/` — login/register pages
- `src/app/(external)/` — public-facing landing page
- `src/app/api/auth/[...all]/` — Better Auth catch-all route handler (handles sign-in, sign-up, sign-out, session, etc.)

### Feature Modules (`src/features/`)

Each feature domain (e.g. `auth`, `users`) follows a consistent structure:
- `types.ts` — TypeScript interfaces and types
- `services.ts` — API call functions using axios
- `hooks.ts` — React Query mutations/queries wrapping services
- `store.ts` — Zustand store (if needed)
- `components/` — feature-specific React components
- `index.ts` — barrel export

When adding a new feature, follow this pattern. Import features via their barrel export (e.g. `import { useLogin } from "@/features/auth"`).

### Authentication Flow

Auth uses **Better Auth** (full-stack, server-side sessions):
1. `src/lib/auth/auth.ts` — server-side Better Auth instance connected to Neon via Drizzle.
2. `src/app/api/auth/[...all]/route.ts` — catch-all Next.js route that exposes all Better Auth endpoints.
3. `src/lib/auth/auth-client.ts` — client-side `authClient` using `better-auth/react`.
4. `src/features/auth/services.ts` — calls `authClient.signIn.email()`, `signUp.email()`, `signOut()`, `getSession()`, `changePassword()`.
5. Client-side auth state is managed in a Zustand store (`src/features/auth/store.ts`).
6. Middleware (`src/middleware.ts`) guards `/dashboard/*` routes by checking the Better Auth session cookie.

### State Management

- **Server state**: TanStack React Query (`src/lib/react-query/`). Default staleTime is 60s; refetchOnWindowFocus is disabled.
- **Client state**: Zustand stores in `src/stores/` (preferences) and `src/features/*/store.ts` (domain state).
- **Preferences**: A sophisticated system in `src/lib/preferences/` handles theme mode, theme presets, content layout, navbar style, and sidebar configuration. Preferences are persisted via cookies (for SSR compatibility). A `ThemeBootScript` runs before hydration to avoid flicker.

### UI & Styling

- **Component library**: shadcn/ui (new-york style) in `src/components/ui/`. These are auto-generated — do not manually edit files in `src/components/ui/`.
- **Shared components**: `src/components/` — reusable non-UI components (data-table, logo, header, language-switcher, etc.)
- **Styling**: Tailwind CSS v4 with CSS variables for theming. Theme presets are defined in `src/styles/presets/` and loaded in `globals.css`.
- **Icons**: lucide-react for UI icons; `simple-icons` for brand icons.

### Internationalization

i18next with `react-i18next`. Translation files are in `src/lib/i18n/locales/{lang}/translation.json` (currently `fr` and `en`). French is the default and fallback language. Use the `useTranslation` hook from `@/lib/i18n/use-translation`.

### Path Aliases

`@/*` maps to `./src/*` (configured in tsconfig.json). Always use `@/` imports.

## Code Style

- **Linter/Formatter**: Biome (not ESLint/Prettier). Biome config enforces: 2-space indent, double quotes, semicolons, trailing commas, 120-char line width.
- **Import ordering** (enforced by Biome): react → next → packages → aliases (`@/`) → relative paths, with blank lines between groups.
- **`src/components/ui/` is excluded from linting** — these are generated shadcn components.
- Biome enforces `useSortedClasses` for Tailwind class ordering.
- Use `"use client"` directive only where needed (components using hooks, browser APIs).
- Pre-commit hooks via Husky + lint-staged run `biome check --write` on staged `.js/.ts/.jsx/.tsx` files.
