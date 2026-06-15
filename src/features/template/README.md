# Feature-Driven Architecture — Next.js + Supabase

Feature-Driven Architecture (FDA) organizes code by **business domain** rather than file type. Each feature is a self-contained module: it owns its data access, mutations, validation, UI, and client state. The rest of the app consumes it only through its public `index.ts` barrel.

This guide is scoped to the **Next.js App Router + Supabase** stack and reflects its specific constraints — Server Components, Server Actions, cookie-based auth sessions, and auto-generated database types.

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
│   │   ├── server.ts             → createServerClient — for RSC, Server Actions, Route Handlers
│   │   ├── browser.ts            → createBrowserClient — for Client Components
│   │   └── middleware.ts         → createMiddlewareClient — for middleware.ts
│   ├── query-client.ts           → Shared TanStack Query client factory
│   └── env.ts                    → @t3-oss/env-nextjs validated env schema
│
├── shared/
│   ├── components/
│   │   ├── ui/                   → shadcn/ui primitives (Button, Input, Dialog …)
│   │   └── layout/               → AppShell, Sidebar, Header, PageHeader
│   ├── hooks/                    → Generic hooks (useDebounce, useMediaQuery …)
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

Every feature follows the same internal layout. Add only the layers you actually need — a read-only feature may have no `actions/` or `stores/`.

```text
features/<feature-name>/
├── actions/                      → Next.js Server Actions (mutations)
│   └── <feature>Actions.ts       → next-safe-action wrappers, calls services/
│
├── components/                   → Feature-scoped UI
│   ├── <Feature>Table.tsx
│   ├── <Feature>Form.tsx
│   └── <Feature>Card.tsx
│
├── hooks/                        → Client-side React hooks
│   └── use<Feature>.ts           → Wraps React Query + stores
│
├── queries/                      → TanStack Query hooks (client-side data fetching)
│   └── use<Feature>Query.ts      → useQuery / useMutation calling Server Actions
│
├── options/                      → Query key factories + queryOptions() definitions
│   └── <feature>Options.ts       → Centralises cache keys; consumed by queries/ and actions/
│
├── schemas/                      → Zod schemas (isomorphic — runs server + client)
│   └── <feature>Schema.ts        → Input validation; exported to actions/ and components/
│
├── services/                     → Supabase data access (server-only)
│   └── <feature>Service.ts       → Direct Supabase queries; never imported by Client Components
│
├── stores/                       → Zustand stores (UI state only — no server data)
│   └── <feature>Store.ts         → Modal open/close, selected rows, filters
│
├── types/                        → Feature-specific TypeScript types
│   └── <feature>Types.ts         → Derived from database.ts + feature-local types
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
[services/ Supabase query]  ← uses lib/supabase/server.ts
      │
      ▼
[Supabase DB]  — RLS enforces row-level access
```

For **read-only Server Components** skip actions/ and queries/ entirely — call `services/` directly in the page component.

```tsx
// app/(dashboard)/users/page.tsx  — Server Component
import { getUserList } from "@/features/user/services/userService";

export default async function UsersPage() {
  const users = await getUserList();        // direct service call, no hook needed
  return <UserTable initialData={users} />;
}
```

---

## Supabase Client Conventions

```ts
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  );
}
```

```ts
// lib/supabase/browser.ts
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

```ts
// middleware.ts
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
// features/user/actions/userActions.ts
"use server";
import { actionClient } from "@/lib/safe-action";
import { createUserSchema } from "@/features/user/schemas/userSchema";
import { insertUser } from "@/features/user/services/userService";

export const createUserAction = actionClient
  .schema(createUserSchema)
  .action(async ({ parsedInput }) => {
    return insertUser(parsedInput);
  });
```

### React Query hook (client)

```ts
// features/user/queries/useUserQuery.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/features/user/options/userOptions";
import { createUserAction } from "@/features/user/actions/userActions";

export function useUsers() {
  return useQuery(userKeys.list());
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUserAction,
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}
```

### Page consuming both patterns

```tsx
// app/(dashboard)/users/page.tsx
import { getUsers } from "@/features/user/services/userService";
import { UserTable } from "@/features/user/components/UserTable";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { userKeys } from "@/features/user/options/userOptions";

export default async function UsersPage() {
  const qc = new QueryClient();
  await qc.prefetchQuery({ queryKey: userKeys.list().queryKey, queryFn: getUsers });
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <UserTable />
    </HydrationBoundary>
  );
}
```

---

## Naming Conventions

| Artifact | Convention | Example |
| --- | --- | --- |
| Server Action file | `<feature>Actions.ts` | `userActions.ts` |
| Service file | `<feature>Service.ts` | `userService.ts` |
| Zod schema file | `<feature>Schema.ts` | `userSchema.ts` |
| React Query hook | `use` prefix + `Query` suffix | `useUserQuery.ts` |
| Zustand store | `<feature>Store.ts` | `userStore.ts` |
| Query key factory | `<feature>Keys` | `userKeys` |
| Component | PascalCase | `UserTable.tsx` |
| Types file | `<feature>Types.ts` | `userTypes.ts` |

---

## Shared Layer (`shared/`)

| Folder | Contents |
| --- | --- |
| `shared/components/ui/` | shadcn/ui primitives — installed via CLI, not hand-written |
| `shared/components/layout/` | AppShell, Sidebar, PageHeader, Breadcrumb |
| `shared/hooks/` | `useDebounce`, `useMediaQuery`, `useLocalStorage` |
| `shared/types/` | `Nullable<T>`, `PaginatedResponse<T>`, `ApiError` |

---

## Example: User Feature

```text
features/user/
├── actions/
│   └── userActions.ts            → createUser, updateUser, deleteUser
├── components/
│   ├── UserTable.tsx
│   ├── UserForm.tsx
│   └── UserAvatar.tsx
├── hooks/
│   └── useUserTable.ts           → table sort/filter UI state
├── queries/
│   └── useUserQuery.ts           → useUsers(), useCreateUser()
├── options/
│   └── userOptions.ts            → userKeys factory + queryOptions defs
├── schemas/
│   └── userSchema.ts             → createUserSchema, updateUserSchema
├── services/
│   └── userService.ts            → getUsers(), insertUser(), updateUser()
├── stores/
│   └── userStore.ts              → selectedUserId, isCreateModalOpen
├── types/
│   └── userTypes.ts              → User, UserRow, CreateUserInput
└── index.ts                      → re-exports public API
```

---

## Workflow for Adding a New Feature

1. **Generate DB types** if you added a migration: `supabase gen types typescript --local > src/types/database.ts`
2. **Create** `features/<name>/` with the folders you need.
3. **Define types** in `types/` derived from `Database` generated types.
4. **Write Zod schemas** in `schemas/` for every mutation input.
5. **Write service functions** in `services/` using `createSupabaseServerClient()`.
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
| Env variable access | `lib/env.ts` via `@t3-oss/env-nextjs` |
| Auth session logic | `middleware.ts` + `app/(auth)/` |
| Webhook receivers | `app/api/webhooks/` Route Handlers |
| DB type definitions | `types/database.ts` (auto-generated) |
| Cross-feature shared logic | `shared/` only — never feature-to-feature |
