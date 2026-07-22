# Common tasks

Where to look first, by change type. For docs and content routes specifically, read
[architecture.md](architecture.md) before changing routing or caching behavior.

## Changing a page or route

- `src/pages/` for the route file (Pages Router) or `src/app/api/` for API routes
- the matching view under `src/views/` and any layout under `src/layouts/`
- `src/proxy.ts` (middleware) and redirect logic under `build-libs/` and
  `scripts/redirects/` if the change involves redirects or middleware

## Changing shared utility or data-loading logic

- `src/lib/` for the utility and its co-located Vitest test
- `src/lib/learn-client/`, `src/lib/integrations-api-client/`, and the `fetch-*` helpers
  for remote data loading
- `src/lib/env-checks.js` (`isDeployPreview`) when loading strategy depends on the run context

## Working on a flat-slug docs product

A "flat-slug" product is served at `/<slug>/*` (no `/<product>/docs/` segment) with content
from the unified docs API. Well-Architected Framework (`well-architected-framework`) is
currently the only product wired up this way, so treat it as a worked example, **not** a
fixed template — a future flat-slug product may not need the same set of files.

To see what's involved, trace WAF through the code: its manifest in `src/data/`, its routes
under `src/pages/well-architected-framework/`, its view in `src/views/`, its entry in
`ProductSlug` (`src/types/products.ts`), and its exclusion from the generic docs route
(`excludedProducts` in `src/pages/[productSlug]/docs/index.tsx`). The backend handoff —
serving the slug from the unified docs API and adding it to
`flags.unified_docs_migrated_repos` — is a coordinated `web-unified-docs` change.

## Changing configuration behavior

- `config/index.js` for how configs are resolved and merged
- `config/*.json` for per-environment values selected by `HASHI_ENV`
- `config/__tests__/` for existing coverage
- references to `__config` in application code (values are replaced at build time)

## Changing CI, preview, or deployment behavior

See [ci-and-deployment.md](ci-and-deployment.md) for the baseline model, then open the
specific workflow under `.github/workflows/` you are touching, plus `vercel.json` and
`Dockerfile` for build/runtime configuration.
