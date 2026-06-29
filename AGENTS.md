# Dev Portal agent guide

## Purpose

Use this file as the default operating guide for AI agents that contribute to the application code behind `hashicorp/dev-portal` (the site served at `developer.hashicorp.com`).

This file should help an agent:

- understand the repository's role in the DevDot platform
- find the right code, content, and configuration surfaces quickly
- work in a test-driven way by default
- verify assumptions against the repository instead of guessing
- understand where this repo ends and where `web-unified-docs` and other content sources begin

This file is intentionally practical. It should describe how this codebase works and how to make safe changes inside it. It should not try to duplicate every specialized process document in the repo.

## Scope

This repository is the user-facing frontend for HashiCorp product documentation, tutorials, and related developer experiences.

This file is for contributing to the overall codebase, architecture, workflows, and operational behavior of `dev-portal`.

Do not treat this file as the primary guide for product-specific documentation content. When a task is specific to one content set, first check that area for its own `README.md`, style guidance, templates, or other local instructions and follow those repo-local documents before applying the general guidance here. Content authoring guidance lives under `src/content/` (see `src/content/README.md`).

- `dev-portal` renders the user-facing experience and pulls content from multiple sources at build and request time
- content sources include the unified docs API (`web-unified-docs`), the content API (`mktg-content-workflows`), the Learn API, the integrations API, the local filesystem, and the GitHub API
- `web-unified-docs` is the unified docs API and content source for migrated product documentation that this repo consumes
- both repos participate in preview and production flows

When you need to explain or change behavior, verify the current implementation in this repo first. Do not infer architecture or workflow behavior from old notes.

## Core working rules

1. Verify before you claim. Read the relevant files before stating how the system works.
1. Start with the smallest change that can solve the problem.
1. Default to a test-driven workflow for code changes: add or update a failing test first, then make it pass (see "Required workflow: TDD first" below).
1. Prefer targeted tests before broad refactors.
1. Keep changes local to the layer you are modifying.
1. Treat generated artifacts and build outputs as derived from source unless the repo clearly requires direct edits. In this repo, generated output lands in directories such as `src/.generated/` and `src/.extracted/`; treat those as build products, not hand-edited source.
1. If behavior touches deployment or preview infrastructure, inspect the matching GitHub Actions workflow under `.github/workflows/` before changing code.

## Required workflow: TDD first

Default to a test-driven workflow for code changes.

1. Identify the exact behavior that needs to change.
1. Find the closest existing test file or create a focused new test near the changed logic.
1. Write or update the failing test first.
1. Make the smallest code change that makes the test pass.
1. Run the narrowest relevant test command first.
1. Run broader validation only after the targeted test passes.

The primary validation command is the unit suite:

```sh
npm run test
```

This runs `vitest run` — a one-shot that executes the suite once and exits, **not**
a watcher. Run a single file with `npx vitest run path/to/file`. (Typecheck and lint
run automatically on commit via `simple-git-hooks` and `lint-staged`, so you rarely
need to run them by hand.)

End-to-end tests use Playwright and require a running server / preview deployment.
Run them with `npm run test:e2e` and view the report with `npx playwright show-report`.
Playwright tests are appropriate for behavior that needs a real Next.js server,
such as middleware, redirects, and link rewrites.

### TDD expectations by change type

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

## Local development

This is a developer-only path. It is intentionally not advertised to content
authors or educators — they do not run this repo directly. (The repo's Docker
image is the content-repo preview flow, driven from the content / `web-unified-docs`
side; its `Dockerfile` entrypoint is `scripts/content-repo-preview/start.sh`, not a
general way to develop the frontend.)

Because `dev-portal` renders mostly by fetching content from the unified docs API
(UDR), running it locally is about pointing the frontend at a UDR backend:

1. The committed `.env` holds the API endpoints. `UNIFIED_DOCS_API` defaults to
   `http://localhost:8080` (a UDR instance running locally); a deployed UDR URL is
   also present commented-out. Edit `.env` to point at whichever backend you want.
1. Secret tokens go in `.env.local` (e.g. `MKTG_CONTENT_API_TOKEN`,
   `GITHUB_PUBLIC_REPO_TOKEN`) — see `.env.local.example`. Running `vercel link`
   then `vercel env pull .env.local` (per `README.md`) fetches these from the
   linked Vercel project, or ask a teammate for values.

Then install and run:

```sh
npm install
npm start
```

`npm start` runs `next dev --webpack` and serves the app on http://localhost:3000.
To run locally with accessibility checks, use `npm run start:with-axe` (sets `AXE_ENABLED`).

## First places to look

Mechanically, `dev-portal` is a fairly standard Next.js app: it renders pages with
the Pages Router and fetches most docs content at build/request time from the
unified docs API (UDR). Start with the surface that matches your change:

- **Rendering / UI**: `src/pages/` (routes), `src/views/` (page views), `src/components/`, `src/layouts/`
- **Docs content pipeline**: `src/views/docs-view/` (loaders + `server.ts`) — see "How docs pages render and get their content" below
- **Data / utilities**: `src/lib/` (data fetching, transforms, and their co-located Vitest tests)
- **Environment / config**: the committed `.env` (API endpoints) and `config/index.js` + `config/*.json` (`__config`, selected by `HASHI_ENV`)

For supporting facts: `package.json` for the runtime (`node >=24.0.0 <25.0.0`) and
commands, `next.config.js` for build/routing, `vitest.config.mts` (unit) and
`playwright.config.ts` (e2e) for tests, and `.github/workflows/` for CI and deploys.

Then narrow your search by change type.

### Feature-local documentation

Some features document themselves directly next to their implementation rather than
in `docs/` or the root `README.md`. A directory may include its own `README.md`
explaining how that piece works, how to extend it, and how to test it — for example
`src/content/README.md`, `src/data/README.md`, and several others under `src/`.

Before changing a feature, look for a co-located `README.md` or notes file in the
same directory (and parent directories) and read it first. When you change the
feature's behavior, update that co-located documentation in the same PR.

## Repo map

### Primary source directories

- `src/pages/`: Next.js Pages Router routes (the primary rendering surface)
- `src/app/`: App Router surface, currently API routes under `src/app/api/`
- `src/views/`: full-page "view" components, co-located with their sub-components and tests
- `src/components/`: shared, reusable components
- `src/layouts/`: generic layout components
- `src/hooks/` and `src/contexts/`: shared hooks and React contexts
- `src/lib/`: core utility, data-fetching, and transformation logic (with Vitest coverage)
- `src/content/`: authored content sets (each may have its own `README.md`)
- `config/`: per-environment JSON configuration and the resolver in `config/index.js`
- `scripts/`: build, preview, sitemap, redirect, and maintenance scripts
- `public/`: served static assets
- `docs/`: internal documentation and decision records (`docs/decisions/`)
- `src/.generated/` and `src/.extracted/`: generated/derived output, not hand-edited source

### High-value architecture facts

- The repo uses Next.js and requires Node `>=24.0.0 <25.0.0`.
- It runs **Next.js 16** (`^16.2.7`) with **React 19** (`^19.2.7`); write code for those
  majors, and confirm the installed versions in `package.json` before using
  APIs that changed across major versions. Do not assume older Next.js (13/14)
  or React 18 patterns.
- Middleware lives in `src/proxy.ts`, the Next.js 16 convention — **not** in
  `src/middleware.ts`. There is no `src/middleware.ts` in this repo. When adding
  or changing edge middleware (redirects, UA blocks, tutorial-variant rewrites),
  edit `src/proxy.ts`; do not create a `middleware.ts` file. See the legacy note
  below before trusting older references.
- Rendering is primarily through the Pages Router (`src/pages/`); the App Router surface is currently limited to API routes (`src/app/api/`).
- Builds use webpack (`next build --webpack`), and `prebuild`/`prestart` scripts generate tutorial maps, extract HVD content, and build the sitemap.
- Content is sourced from multiple external APIs and the local filesystem; see the "Relationship to web-unified-docs and other content sources" section.

#### Legacy reference: `middleware.ts` vs `proxy.ts`

Older material in and around this repo predates the move to `src/proxy.ts` and
still says `src/middleware.ts` — for example the `dev-portal-workflows.png`
diagram (until recently).
If you are reading a legacy doc, comment, PR, or external snippet that references
`middleware.js`/`middleware.ts`, treat it as the old name for `src/proxy.ts`. Do
not "restore" a `middleware.ts` file or downgrade the code to match the stale
reference — update your mental model (and the stale reference, if you own it) to
`src/proxy.ts` instead.

## How docs pages render and get their content

Most product docs pages are Incremental Static Regeneration (ISR) pages, not
per-request SSR. Understand this pipeline before changing docs rendering, routing,
or caching behavior.

The request/render chain for a typical docs route is:

1. a route file under `src/pages/<product>/docs/[...page].tsx` (or the generic
   `src/pages/[productSlug]/docs/index.tsx`) wires the page using
   `getRootDocsPathGenerationFunctions(productSlug, basePath)` in
   `src/views/docs-view/utils/get-root-docs-path-generation-functions.ts`
1. that returns `getStaticPaths` / `getStaticProps` from
   `src/views/docs-view/server.ts`
1. `getStaticProps` uses `RemoteContentLoader`
   (`src/views/docs-view/loaders/remote-content.ts`), which calls the content-api
   client (`src/views/docs-view/loaders/content-api/index.ts`) to fetch nav data,
   MDX, and version metadata, then renders MDX through remark/rehype
1. the rendered page is served via `src/views/docs-view/index.tsx`

Key verified behaviors (confirm in `src/views/docs-view/server.ts` before relying on them):

- `getStaticProps` returns `revalidate: __config.dev_dot.revalidate` (currently
  `43200`, i.e. 12 hours, in `config/base.json`). This is the ISR window.
- `getStaticPaths` does **not** prebuild every docs URL. It prunes to the most
  analytics-popular paths via `getStaticPathsFromAnalytics`
  (`src/lib/get-static-paths-from-analytics.ts`, limited by
  `__config.dev_dot.max_static_paths`) intersected with valid nav paths, and
  returns `fallback: 'blocking'`. Paths that miss the cut are rendered on first
  request, then cached.
- Two cases **bypass** the analytics prune and prebuild all paths: deploy
  previews of a content source repo, and `terraform-cdk` (its pages exceed the
  ISR lambda response limit). Both are explicit branches in `server.ts`.
- When the content API 404s for a path, `getStaticProps` returns
  `{ notFound: true, revalidate: 10 }` so the 404 is retried rather than cached
  long-term.
- On-demand cache invalidation exists via the token-protected
  `src/pages/api/revalidate.ts` and `src/pages/api/revalidate/paths.ts`, which
  call `response.revalidate(path)`.

Which backend serves a product's content depends on
`flags.unified_docs_migrated_repos` (see the
"Relationship to web-unified-docs and other content sources" section): migrated
repos are served by the unified docs API, and everything else falls back to the
legacy content API (`MKTG_CONTENT_DOCS_API`). The switch logic lives in
`src/lib/unified-docs-migration-utils.ts`.

### Architecture diagrams

Three committed diagrams under `docs/architecture-diagrams/` give a visual mental
model of the above. They are secondary references — verify specifics
against the code before relying on them. Load them with the image-viewing tool
when you need the end-to-end picture:

- `dev-portal-workflows.png` — build/deploy lifecycle (`prebuild` →
  `build` → `postbuild`) on the left and the ISR user-request flow on the right.
  It visualizes the prebuild script order, the build step prerendering the most
  popular pages per product, and `getStaticProps` fetching from the unified docs
  API and writing HTML to the ISR cache.
- `dev-portal-entrypoint-architecture.png` — the distinct page entry points
  (integrations, tutorials, landing pages, downloads, docs, OpenAPI docs) and the
  content source of truth behind each (integrations API, Learn API, releases API,
  the unified docs API, and the GitHub API for product-generated `swagger.json`).
- `dev-portal-sitemap.png` — the page-type taxonomy (custom landing, templatized
  landing, distinct template, and docs-markdown pages) and the route hierarchy
  under `/[product]`.

## How to navigate common tasks

### If you are changing a page or route

Inspect the following areas first:

- `src/pages/` for the route file (Pages Router) or `src/app/api/` for API routes
- the matching view under `src/views/` and any layout under `src/layouts/`
- `src/proxy.ts` (middleware) and redirect logic under `build-libs/` and `scripts/redirects/` if the change involves redirects or middleware

For docs and content routes specifically, read "How docs pages render and get their content" above before changing routing or caching behavior.

### If you are changing shared utility or data-loading logic

Inspect the following areas first:

- `src/lib/` for the utility and its co-located Vitest test
- `src/lib/learn-client/`, `src/lib/integrations-api-client/`, and the `fetch-*` helpers for remote data loading
- `src/lib/env-checks.js` (`isDeployPreview`) when loading strategy depends on the run context

### If you are working on a flat-slug docs product

A "flat-slug" product is served at `/<slug>/*` (no `/<product>/docs/` segment)
with content from the unified docs API. Well-Architected Framework
(`well-architected-framework`) is currently the only product wired up this way, so
treat it as a worked example, **not** a fixed template — a future flat-slug product
may not need the same set of files.

To see what's involved, trace WAF through the code: its manifest in `src/data/`,
its routes under `src/pages/well-architected-framework/`, its view in `src/views/`,
its entry in `ProductSlug` (`src/types/products.ts`), and its exclusion from the
generic docs route (`excludedProducts` in `src/pages/[productSlug]/docs/index.tsx`).
The backend handoff — serving the slug from the unified docs API and adding it to
`flags.unified_docs_migrated_repos` — is a coordinated `web-unified-docs` change.

### If you are changing configuration behavior

Inspect the following areas first:

- `config/index.js` for how configs are resolved and merged
- `config/*.json` for per-environment values selected by `HASHI_ENV`
- `config/__tests__/` for existing coverage
- references to `__config` in application code (values are replaced at build time)

### If you are changing CI, preview, or deployment behavior

Read "CI, previews, and deployment mental model" below for the baseline model,
then open the specific workflow under `.github/workflows/` you are touching, plus
`vercel.json` and `Dockerfile` for build/runtime configuration.

## CI, previews, and deployment mental model

Agents should work from this baseline mental model and then verify details in the workflow files.

### CI

- `ci.yml` runs on pull requests, merge groups, and pushes to `main`. It has a `test` job (`npm ci` then `npm run test:ci`, which runs `npm run test`) and a `lint` job (`npm run lint`).
- Both jobs read the Node version from `package.json` via `node-version-file`.
- `nextjs_bundle_analysis.yml` tracks JavaScript bundle sizes.
- other workflows under `.github/workflows/` cover container publishing (`docker_publish.yml`), caching (`cache.yml`), preview URL registration (`register-preview-url.yml`), and content-repo redeploys (`redeploy-content-repos.yml`); open the specific file before changing its behavior.

### Preview flow

- preview deployments are built and hosted through Vercel
- `playwright.yml` runs the Playwright e2e suite against a preview when a preview `deployment_status` reports `success`, using `E2E_BASE_URL` and the Vercel automation bypass secret
- `register-preview-url.yml` handles preview URL registration

### Production flow

- the production site is `developer.hashicorp.com`, deployed through Vercel
- verify the exact production trigger and steps in the relevant workflow and Vercel project before making claims about it

## Relationship to web-unified-docs and other content sources

This repo is the frontend; it is not the source of truth for the content it renders.

- `dev-portal` owns the user-facing frontend experience, rendering, routing, and presentation
- `web-unified-docs` owns unified content sourcing, content processing, and the unified docs API for migrated products
- `dev-portal` also consumes content from the content API (`mktg-content-workflows`), the Learn API, the integrations API, the GitHub API, and the local filesystem
- the content API (`MKTG_CONTENT_DOCS_API`, `content.hashicorp.com`) is the **legacy** docs source. The repo is incrementally migrating products off it onto the unified docs API — the committed `.env` notes the intent to remove `MKTG_CONTENT_DOCS_API` once migration completes (no firm timeline). Until then, non-migrated products still fall back to it.
- the unified docs API is consumed via the `UNIFIED_DOCS_API` environment variable; `config/index.js` fetches `${UNIFIED_DOCS_API}/api/supported-products` to populate the `unified_docs_migrated_repos` flag, which controls which products are served from the unified docs pipeline
- migration helpers for this integration live in `src/lib/unified-docs-migration-utils.ts`
- some feature work spans both repositories, and preview/production flows may need coordinated changes

When a task changes both the API contract and the frontend experience, explicitly call out the split:

- what changes belong in `web-unified-docs`
- what changes belong in `dev-portal`
- what needs coordinated preview testing across both repos

## Source hierarchy for agents

Use the following priority order when gathering context:

1. Implementation files and tests in this repository
1. Content-local or feature-local instruction/README files inside the specific directory when the task is scoped to that area
1. Root operational files such as `README.md`, `package.json`, `vitest.config.mts`, `playwright.config.ts`, `next.config.js`, and `.github/workflows/*.yml`
1. Focused internal docs under `docs/` (note: `docs/decisions/` ADRs are sparse and historical — only the two 2024 unified-docs env ADRs exist and nothing since — so treat them as background, not an active process)

## Safe change checklist

Before opening or updating a PR, make sure you did the following:

1. Verified the behavior in the relevant source files.
1. Added or updated the narrowest useful test when changing code.
1. Ran the relevant test command locally.
1. Ran `npm run typecheck` and `npm run lint` when touching TypeScript or JavaScript.
1. Checked whether the change also affects preview or deployment workflows.
1. Called out any required `web-unified-docs` (or other content-source) follow-up explicitly.

## Maintenance rule for this file

Treat this file as operational documentation derived from the repository's current source of truth.

When updating this file:

1. prefer improving an existing section over creating overlapping guidance
1. remove stale claims instead of layering exceptions on top of them
1. keep the file specific to `dev-portal`
1. verify every operational statement against the repo before adding it

Update this file in the same PR when your change modifies any of the following:

- local development commands in `README.md` or `package.json`
- required runtime versions, build steps, or validation commands
- repository structure, source-of-truth directories, or generated artifact locations
- behavior in `.github/workflows/*.yml`
- Vercel preview or production deployment flow
- the contract or working relationship between `dev-portal` and `web-unified-docs` (or other content sources)
- the recommended place to start for a common task

Before updating this file:

1. read the implementation or workflow file that actually changed
1. update only the sections affected by that change
1. remove outdated guidance in the same edit
1. keep summaries short and point readers to source files for details

If you changed any of the trigger areas above and did not update this file, explain why in your final summary. Do not add speculative guidance just to keep this file synchronized. If the new behavior is not yet verified, leave the existing text unchanged and call out the gap explicitly.

### Drift detection for changes made without AI

Not every change to this repo is made with an AI agent in the loop. A developer
may edit a workflow, bump the Node version, rename a directory, or change a
command directly. When that happens, the corresponding guidance in this file can
silently go stale. The next agent to work in the repo is responsible for catching
that drift.

At the start of any task that relies on facts in this file, spot-check the specific
facts you are about to depend on against their source of truth before acting on
them. You do not need to re-verify the entire file — only the claims relevant to
your current task. Use this mapping:

- runtime version, scripts, or commands — verify against `package.json` and `README.md`
- framework majors (Next.js, React) and the `middleware.ts` → `proxy.ts` convention — verify against `package.json` and the presence of `src/proxy.ts`
- unit test environment or excluded paths — verify against `vitest.config.mts`
- e2e behavior — verify against `playwright.config.ts` and `.github/workflows/playwright.yml`
- repository structure or generated artifact locations — verify against the actual directory tree
- CI, preview, or deployment behavior — verify against `.github/workflows/*.yml`, `vercel.json`, and the Vercel project
- configuration behavior — verify against `config/index.js` and `config/*.json`
- the `dev-portal` ↔ `web-unified-docs` contract — verify against `config/index.js`, `src/lib/unified-docs-migration-utils.ts`, and the unified docs API

When you find that this file disagrees with the source of truth:

1. trust the source of truth, not this file, for the task at hand
1. correct the stale statement in this file as part of your change
1. if the correction is outside the scope of your current task, call out the drift explicitly in your final summary so a human can follow up
1. never "fix" this file to match an assumption — only update it to match a fact you verified in the repository
