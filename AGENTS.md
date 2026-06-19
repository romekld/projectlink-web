<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project LINK Web Agent Guide

This repository is a Next.js 16 + React 19 app with Supabase, TanStack Query, shadcn/ui, Serwist, and a feature-driven architecture. Treat this file as the local source of truth for agent work in `apps/web`.

## What To Read First

- Check the relevant Next.js docs in `node_modules/next/dist/docs/` before editing code that depends on framework behavior.
- Read `features/template/README.md` for the repository's feature-driven architecture rules.
- Keep `components/ui/` as shared primitives only; prefer feature-local code for business logic.

## Core Rules

- Prefer feature-based changes under `features/<domain>/` and keep cross-feature sharing in `shared` or `lib`.
- Use the existing Supabase clients in `lib/supabase/`; do not create ad hoc clients inside features.
- Keep server-only data access in feature `services/` and client state in hooks, stores, or React Query layers.
- Do not mix UI route changes with business logic when a feature module already owns the behavior.
- If a route or component is already generated from a shared pattern, update the owning pattern instead of patching one-off copies.
- Avoid broad formatting-only edits. Keep diffs focused and preserve the repo's current style.

## Important Project Structure

- `app/` contains App Router routes, layouts, manifest, and service worker wiring.
- `features/` contains domain modules such as auth, bhw, navigation, submissions, and health-station workflows.
- `components/` contains shared UI and layout composition.
- `lib/` contains cross-cutting utilities and Supabase client helpers.
- `public/` contains static assets, including the generated service worker.

## Navigation And App Shell

- Dashboard navigation is owned by `features/navigation/` and the role-specific configs under `app/(web)/`.
- Update the shared role policy instead of hardcoding path rules in layouts or sidebar components.
- Treat `components/layout/web/app-sidebar.tsx` as a compatibility layer only.

## Supabase And Auth

- Use `lib/supabase/server.ts`, `lib/supabase/client.ts`, and `lib/supabase/middleware.ts` as the only client entry points.
- Keep auth and session refresh behavior in middleware and route-group layouts, not inside feature components.
- Respect the generated database types in `features/` and avoid hand-rolled schema copies.

## PWA And Service Worker

- The app uses Serwist and a generated `public/sw.js` from `app/sw.ts`.
- If you touch service worker or manifest behavior, update the source file and regenerate outputs through the existing scripts.
- Preserve the custom `next.config.ts` rewrites and headers around `/rhm-manifest.webmanifest` and `/sw.js` unless you are intentionally changing PWA behavior.

## Commands

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Type check: `pnpm check-types`
- Run tests: `pnpm test`
- Generate PWA icons: `pnpm generate-icons`

## Editing Expectations

- Use `apply_patch` for manual edits.
- Keep changes minimal and localized to the owning feature or shared abstraction.
- When adding behavior, prefer small validation steps such as lint, typecheck, or focused tests after the edit.
- Do not remove unrelated user changes or clean up files outside the task scope.

## Verification

- Run the smallest relevant check after each substantive change.
- Prefer `pnpm lint` or `pnpm check-types` for code edits, and `pnpm test` for behavior changes.
- If a change affects routing, auth, or PWA behavior, verify the impacted path end to end.
<!-- END:nextjs-agent-rules -->

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool                        | Use when                                               |
| --------------------------- | ------------------------------------------------------ |
| `detect_changes`            | Reviewing code changes — gives risk-scored analysis    |
| `get_review_context`        | Need source snippets for review — token-efficient      |
| `get_impact_radius`         | Understanding blast radius of a change                 |
| `get_affected_flows`        | Finding which execution paths are impacted             |
| `query_graph`               | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes`     | Finding functions/classes by name or keyword           |
| `get_architecture_overview` | Understanding high-level codebase structure            |
| `refactor_tool`             | Planning renames, finding dead code                    |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
