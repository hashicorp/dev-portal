# Content sources

This repo is the frontend; it is not the source of truth for the content it renders.

`dev-portal` owns the user-facing frontend experience, rendering, routing, and presentation.
It fetches content from six distinct sources depending on the page type:

## 1. Unified Docs API (UDR API) — docs pages

- Serves: `/[productSlug]/docs/*`
- Source of truth: `hashicorp/web-unified-docs`
- Consumed via the `UNIFIED_DOCS_API` environment variable. `config/index.js` fetches
  `${UNIFIED_DOCS_API}/api/supported-products` to populate the `unified_docs_migrated_repos`
  flag, which controls which products are served from this pipeline.
- Migration helpers live in `src/lib/unified-docs-migration-utils.ts`.
- Some feature work spans both repositories; preview/production flows may need coordinated
  changes. See [cross-repo changes](#cross-repo-changes) below.
- The **legacy** docs source is the content API (`MKTG_CONTENT_DOCS_API`,
  `content.hashicorp.com`, repo: `mktg-content-workflows`). Products not yet migrated still
  fall back to it. The committed `.env` notes the intent to remove `MKTG_CONTENT_DOCS_API`
  once migration completes (no firm timeline).

## 2. Learn API — tutorials pages

- Serves: `/[productSlug]/tutorials/*`
- Source of truth: `hashicorp/learn-api` (synced from `hashicorp/tutorials` content repo)
- An idempotent sync process keeps the Learn API in step with the tutorials content repo.

## 3. Integrations API — integrations pages

- Serves: `/[productSlug]/integrations/*`
- Source of truth: external integration repos (e.g. `hashicorp/integrations`)
- Flow: content-update notification → Integrations Registry validates auth and triggers sync
  → Integrations API fetches updated content from external repos.

## 4. Releases API (external) — downloads pages

- Serves: `/[productSlug]/downloads` (download assets and version metadata)
- Fetched at runtime via `scripts/fetch-release-data.ts` (or equivalent).
- The static shell of downloads pages is configured via local `install-landing.json` files
  (see local filesystem below).

## 5. GitHub API — OpenAPI docs pages

- Serves: `/[productSlug]/api/*`
- Fetches product-generated `swagger.json` files from the respective product repos
  (`hashicorp/*/swagger.json`).
- Page configuration (which endpoints to expose, how to label them) lives in local
  `[slug]/api-docs/[pages].tsx` source files.

## 6. Local filesystem — landing pages and page config

- Serves: product landing pages (`/[productSlug]`), docs landing pages
  (`/[productSlug]/docs`), and downloads page shells.
- Key files: `product-landing.json`, `docs-landing.json`, `install-landing.json`.
- These are committed source files in `dev-portal`, not fetched from an external API.

---

## Cross-repo changes

When a task changes both an API contract and the frontend experience, explicitly call out
the split:

- what changes belong in the upstream source repo (e.g. `web-unified-docs`, `learn-api`)
- what changes belong in `dev-portal`
- what needs coordinated preview testing across both repos
