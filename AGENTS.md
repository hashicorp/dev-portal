# Dev Portal agent guide

`dev-portal` is the user-facing Next.js frontend for HashiCorp's developer site
(`developer.hashicorp.com`), rendering product docs, tutorials, and related experiences from
content it fetches at build/request time from the unified docs API and other sources. This
repo is the frontend — it is **not** the source of truth for the content it renders.

## Universal rules (apply to every task)

1. **Verify before you claim.** Read the relevant source files before stating how the system
   works. Do not infer architecture or workflow behavior from old notes.
2. **Work test-driven.** For code changes, add or update a failing test first, then make it
   pass. See [testing.md](docs/agents/testing.md).
3. **Middleware lives in `src/proxy.ts`** (Next.js 16 convention), not `src/middleware.ts`.
   Do not create a `middleware.ts` file.
4. **Keep the guides current.** If your change touches any of the trigger areas listed in
   [maintaining these guides](docs/agents/maintenance.md#maintenance-rule), update the
   relevant guide in the same PR. If you skip it, say why in your summary.

## Key facts

- **Runtime:** Node `>=24.0.0 <25.0.0`. **Next.js 16** (`^16.2.7`) + **React 19**
  (`^19.2.7`) — write for those majors and verify in `package.json` before using
  version-sensitive APIs. Do not assume older Next.js (13/14) or React 18 patterns.
- **Primary test command:** `npm run test` (`vitest run`, one-shot — not a watcher). Single
  file: `npx vitest run path/to/file`.
- **Build:** `npm run build` (`next build --webpack`). The `prebuild`/`prestart` scripts
  generate tutorial maps, extract HVD content, and build the sitemap.
- **Typecheck and lint run automatically on commit** via `simple-git-hooks`
  (`npm run typecheck`) and `lint-staged` (`npm run lint -- --fix`), so you rarely need to
  run them by hand.

## Companion guides

- [Architecture & docs rendering](docs/agents/architecture.md) — ISR pipeline, how docs pages
  get content, diagrams, high-value facts.
- [Testing & TDD workflow](docs/agents/testing.md) — required workflow, expectations by change
  type, commands.
- [Local development](docs/agents/local-development.md) — env setup and running the app.
- [Repo map](docs/agents/repo-map.md) — directory structure and feature-local docs.
- [Common tasks](docs/agents/common-tasks.md) — where to look by change type (routes,
  utilities, flat-slug products, config, CI).
- [CI, previews & deployment](docs/agents/ci-and-deployment.md).
- [Content sources](docs/agents/content-sources.md) — relationship to `web-unified-docs` and
  other content sources.
- [Maintaining these guides](docs/agents/maintenance.md) — maintenance rule, drift detection,
  source hierarchy, safe-change checklist.
