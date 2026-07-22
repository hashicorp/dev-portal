# Testing & TDD workflow

Default to a test-driven workflow for code changes.

1. Identify the exact behavior that needs to change.
1. Find the closest existing test file or create a focused new test near the changed logic.
1. Write or update the failing test first.
1. Make the smallest code change that makes the test pass.
1. Run the narrowest relevant test command first.
1. Run broader validation only after the targeted test passes.

## Commands

The primary validation command is the unit suite:

```sh
npm run test
```

This runs `vitest run` — a one-shot that executes the suite once and exits, **not** a
watcher. Run a single file with `npx vitest run path/to/file`.

Typecheck and lint run automatically on commit via `simple-git-hooks` (`npm run typecheck`)
and `lint-staged` (`npm run lint -- --fix`), so you rarely need to run them by hand.

End-to-end tests use Playwright and require a running server / preview deployment. Run
them with `npm run test:e2e` and view the report with `npx playwright show-report`.
Playwright tests are appropriate for behavior that needs a real Next.js server, such as
middleware, redirects, and link rewrites.

## Expectations by change type

**Utility or transformation logic:**
- most utilities live under `src/lib/`; co-locate or extend a Vitest test next to the logic you change
- keep fixtures small and explicit
- prefer adding coverage around the exact edge case you are changing

**React components, views, and layouts:**
- use Vitest with `@testing-library/react` (the project runs in a `jsdom` environment with globals enabled; see `vitest.config.mts`)
- co-locate test files with the component under `src/components/`, `src/views/`, or `src/layouts/`

**Page / routing behavior:**
- pages are primarily Pages Router files under `src/pages/`; some API routes use the App Router under `src/app/api/`
- if the behavior depends on a running server (redirects, middleware via `src/proxy.ts`, link rewrites), prefer a Playwright e2e test under `src/__tests__/e2e`
- the Vitest config excludes `src/__tests__/e2e`, `.next`, and `src/.extracted` from the unit run

**Configuration behavior:**
- per-environment config lives in `config/*.json`, selected by `HASHI_ENV`, and is exposed globally as `__config`
- config resolution and merging lives in `config/index.js`; tests live in `config/__tests__/`

**Landing / authorable content changes (`src/content/`):**
- `src/content/` holds authorable landing-page content as JSON — sidebar "Resources" items, product/docs/install landing pages, and certifications (see `src/content/README.md`). It is **not** product docs MDX; that content lives in `web-unified-docs`.
- validate the JSON against its consuming view/types and check the rendered landing page; code tests may not be the primary validation path
