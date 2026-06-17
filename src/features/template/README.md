# Feature-Driven Architecture — Next.js + Supabase

Feature-Driven Architecture (FDA) organizes code by **business domain** rather than file type. Each feature is a self-contained module: it owns its data access, mutations, validation, UI, and client state. The rest of the app consumes it only through its public `index.ts` barrel.

This guide is scoped to the **Next.js 15 App Router + Supabase** stack and reflects its specific constraints — Server Components, Server Actions, cookie-based auth sessions (async), and auto-generated database types.

---

## Core Principles

1. **Feature encapsulation** — One folder per domain. Everything that feature needs lives inside it.
2. **Server-first data access** — Supabase is queried in `services/` (server-only). Client components fetch through React Query hooks that call Server Actions or Route Handlers.
3. **Single Supabase client per context** — `lib/supabase/` centralises client creation for server, browser, and middleware. Never instantiate clients ad-hoc inside features.
4. **Type safety end-to-end** — Generated DB types flow from Supabase → `types/database.ts` → feature `types/` → UI. Zod validates at system boundaries (forms, API input).
5. **No cross-feature imports** — Features share code only through `shared/`. Direct feature-to-feature imports are forbidden.

---

## Recommended Dependencies

| Package | Role |
| --- | --- |
| `@supabase/supabase-js` | Core Supabase client |
| `@supabase/ssr` | Cookie-based auth for App Router (SSR/RSC) |
| `zod` | Schema validation for forms and server action inputs |
| `next-safe-action` | Type-safe Server Actions with Zod input parsing |
| `@tanstack/react-query` | Client-side data fetching, caching, and sync |
| `zustand` | Lightweight client-only UI state (modals, selections) |
| `@t3-oss/env-nextjs` | Type-safe, validated environment variables |

---

## Global Directory Structure

```text
src/
├── app/                          → Next.js App Router (routes only)
│   ├── (auth)/                   → Auth route group (public)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── route.ts          → Supabase OAuth / magic-link callback
│   ├── (web)/                    → Web interface route group (sidebar shell)
│   │   ├── layout.tsx            → Auth guard + web shell
│   │   └── [feature]/
│   │       └── page.tsx
│   ├── (mobile)/                 → Mobile interface route group (bottom bar shell)
│   │   ├── layout.tsx            → Auth guard + mobile shell
│   │   └── [feature]/
│   │       └── page.tsx
│   ├── api/                      → Route Handlers (webhooks only)
│   │   └── webhooks/
│   │       └── [provider]/
│   │           └── route.ts
│   ├── layout.tsx                → Root layout (providers, fonts)
│   └── globals.css
│
├── features/                     → Feature modules (one per business domain)
│   └── <feature-name>/           → See feature structure below
│
├── lib/
│   ├── supabase/                 → Supabase client factory (the only place clients are created)
│   │   ├── server.ts             → createClient — for RSC, Server Actions, Route Handlers
│   │   ├── client.ts             → createClient — for Client Components
│   │   └── middleware.ts         → createMiddlewareClient — for middleware.ts
│   ├── query-client.ts           → Shared TanStack Query client factory
│   └── utils.ts                  → Shared tailwind-merge + clsx utility
│
├── shared/
│   ├── components/
│   │   ├── ui/                   → shadcn/ui primitives (button.tsx, input.tsx, dialog.tsx …)
│   │   └── layout/               → app-shell.tsx, sidebar.tsx, header.tsx
│   ├── hooks/                    → Generic hooks (use-debounce.ts, use-media-query.ts …)
│   └── types/                    → Global TS utility types
│
├── providers/                    → Root React context providers
│   ├── query-provider.tsx        → TanStack QueryClientProvider
│   └── supabase-provider.tsx     → Browser Supabase client context
│
├── types/
│   └── database.ts               → Auto-generated: `supabase gen types typescript`
│
├── middleware.ts                  → Supabase session refresh on every request
└── instrumentation.ts             → (optional) OpenTelemetry / Sentry init
```

> **Route Handlers vs Server Actions:** Use Route Handlers (`app/api/`) **only** for inbound webhooks from third-party services (Stripe, push notifications, etc.). All mutations initiated by the UI go through Server Actions in `features/<name>/actions/`.

---

## Feature Structure

Every feature follows the same internal layout. Add only the layers you actually need — a read-only feature may have no `actions/` or `stores/`. **All files must use kebab-case.**

```text
features/<feature-name>/
├── actions/                      → Next.js Server Actions (mutations)
│   └── <feature>-actions.ts      → next-safe-action wrappers, calls services/
│
├── components/                   → Feature-scoped UI
│   ├── <feature>-table.tsx
│   ├── <feature>-form.tsx
│   └── <feature>-card.tsx
│
├── hooks/                        → Client-side React hooks
│   └── use-<feature>.ts          → Wraps React Query + stores
│
├── queries/                      → TanStack Query hooks (client-side data fetching)
│   └── use-<feature>-query.ts    → useQuery / useMutation calling Server Actions
│
├── options/                      → Query key factories + queryOptions() definitions
│   └── <feature>-options.ts      → Centralises cache keys; consumed by queries/ and actions/
│
├── schemas/                      → Zod schemas (isomorphic — runs server + client)
│   └── <feature>-schema.ts       → Input validation; exported to actions/ and components/
│
├── services/                     → Supabase data access (server-only)
│   └── <feature>-service.ts      → Direct Supabase queries; never imported by Client Components
│
├── stores/                       → Zustand stores (UI state only — no server data)
│   └── <feature>-store.ts        → Modal open/close, selected rows, filters
│
├── types/                        → Feature-specific TypeScript types
│   └── <feature>-types.ts        → Derived from database.ts + feature-local types
│
└── index.ts                      → Public barrel export (the feature's external API)
```

---

## Data Flow

```text
[Client Component]
      │  triggers mutation / reads cached data
      ▼
[queries/ hook]  ←→  [stores/ Zustand]
      │  calls via React Query
      ▼
[actions/ Server Action]   ← validated by schemas/ (Zod + next-safe-action)
      │
      ▼
[services/ Supabase query]  ← uses lib/supabase/server.ts (await cookies())
      │
      ▼
[Supabase DB]  — RLS enforces row-level access
```

For **read-only Server Components** skip actions/ and queries/ entirely — call `services/` directly in the page component.

```tsx
// app/(web)/users/page.tsx  — Server Component
import { get_user_list } from "@/features/user/services/user-service";

export default async function UsersPage() {
  const users = await get_user_list();        // direct service call, no hook needed
  return <UserTable initialData={users} />;
}
```

---

## Supabase Client Conventions (Next.js 15)

```ts
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/database.types";

export async function createClient() {
  const cookieStore = await cookies(); // MUST be awaited in Next.js 15
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      cookies: { 
        getAll: () => cookieStore.getAll(), 
        setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) 
      } 
    }
  );
}
```

```ts
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

```ts
// middleware.ts (now named src/proxy.ts in some setups, but logic remains)
import { createMiddlewareClient } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);
  await supabase.auth.getUser();   // refreshes session cookie on every request
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
```

---

## App Router Integration

### Server Actions (mutations)

```ts
// features/user/actions/user-actions.ts
"use server";
import { actionClient } from "@/lib/safe-action";
import { create_user_schema } from "@/features/user/schemas/user-schema";
import { insert_user } from "@/features/user/services/user-service";

export const create_user_action = actionClient
  .schema(create_user_schema)
  .action(async ({ parsedInput }) => {
    return insert_user(parsedInput);
  });
```

### React Query hook (client)

```ts
// features/user/queries/use-user-query.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { user_keys } from "@/features/user/options/user-options";
import { create_user_action } from "@/features/user/actions/user-actions";

export function use_users() {
  return useQuery(user_keys.list());
}

export function use_create_user() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: create_user_action,
    onSuccess: () => qc.invalidateQueries({ queryKey: user_keys.all }),
  });
}
```

---

## Naming Conventions

| Artifact | Convention | Example |
| --- | --- | --- |
| Server Action file | `<feature>-actions.ts` | `user-actions.ts` |
| Service file | `<feature>-service.ts` | `user-service.ts` |
| Zod schema file | `<feature>-schema.ts` | `user-schema.ts` |
| React Query hook | `use-<feature>-query.ts` | `use-user-query.ts` |
| Zustand store | `<feature>-store.ts` | `user-store.ts` |
| Query key factory | `<feature>-keys` (variable) | `user-keys` |
| Component | `<feature>-<name>.tsx` | `user-table.tsx` |
| Types file | `<feature>-types.ts` | `user-types.ts` |

---

## Shared Layer (`shared/`)

| Folder | Contents |
| --- | --- |
| `shared/components/ui/` | shadcn/ui primitives — installed via CLI (e.g., `button.tsx`) |
| `shared/components/layout/` | `app-shell.tsx`, `sidebar.tsx`, `page-header.tsx` |
| `shared/hooks/` | `use-debounce.ts`, `use-media-query.ts`, `use-local-storage.ts` |
| `shared/types/` | `nullable.ts`, `api-error.ts` |

---

## Example: User Feature

```text
features/user/
├── actions/
│   └── user-actions.ts           → create_user, update_user, delete_user
├── components/
│   ├── user-table.tsx
│   ├── user-form.tsx
│   └── user-avatar.tsx
├── hooks/
│   └── use-user-table.ts         → table sort/filter UI state
├── queries/
│   └── use-user-query.ts         → use_users(), use_create_user()
├── options/
│   └── user-options.ts           → user_keys factory + queryOptions defs
├── schemas/
│   └── user-schema.ts            → create_user_schema, update_user_schema
├── services/
│   └── user-service.ts           → get_users(), insert_user(), update_user()
├── stores/
│   └── user-store.ts             → selected_user_id, is_create_modal_open
├── types/
│   └── user-types.ts             → User, UserRow, CreateUserInput
└── index.ts                      → re-exports public API
```

---

## Workflow for Adding a New Feature

1. **Generate DB types** if you added a migration: `supabase gen types typescript --local > src/lib/supabase/database.types.ts`
2. **Create** `features/<feature-name>/` with the folders you need.
3. **Define types** in `types/` derived from `Database` generated types.
4. **Write Zod schemas** in `schemas/` for every mutation input.
5. **Write service functions** in `services/` using `await createClient()` from `@/lib/supabase/server`.
6. **Wrap in Server Actions** in `actions/` using `next-safe-action` + your schemas.
7. **Add query keys + queryOptions** in `options/`.
8. **Add React Query hooks** in `queries/` for client components.
9. **Build UI** in `components/`; use Zustand `stores/` only for local UI state.
10. **Export public API** from `index.ts`.
11. **Wire routes** in `app/` — prefetch on the Server Component page, hydrate with `HydrationBoundary`.

---

## What NOT to Put Inside a Feature

| Concern | Correct location |
| --- | --- |
| Supabase client creation | `lib/supabase/` only |
| shadcn/ui base components | `shared/components/ui/` |
| Env variable access | `lib/env.ts` (if implemented) |
| Auth session logic | `middleware.ts` + `app/(auth)/` |
| Webhook receivers | `app/api/webhooks/` Route Handlers |
| DB type definitions | `lib/supabase/database.types.ts` |
| Cross-feature shared logic | `shared/` only — never feature-to-feature |
