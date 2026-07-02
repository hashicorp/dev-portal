# Content sources

This repo is the frontend; it is not the source of truth for the content it renders.

- `dev-portal` owns the user-facing frontend experience, rendering, routing, and presentation.
- `web-unified-docs` owns unified content sourcing, content processing, and the unified docs
  API for migrated products.
- `dev-portal` also consumes content from the content API (`mktg-content-workflows`), the
  Learn API, the integrations API, the GitHub API, and the local filesystem.
- The content API (`MKTG_CONTENT_DOCS_API`, `content.hashicorp.com`) is the **legacy** docs
  source. The repo is incrementally migrating products off it onto the unified docs API —
  the committed `.env` notes the intent to remove `MKTG_CONTENT_DOCS_API` once migration
  completes (no firm timeline). Until then, non-migrated products still fall back to it.
- The unified docs API is consumed via the `UNIFIED_DOCS_API` environment variable;
  `config/index.js` fetches `${UNIFIED_DOCS_API}/api/supported-products` to populate the
  `unified_docs_migrated_repos` flag, which controls which products are served from the
  unified docs pipeline.
- Migration helpers for this integration live in `src/lib/unified-docs-migration-utils.ts`.
- Some feature work spans both repositories, and preview/production flows may need
  coordinated changes.

When a task changes both the API contract and the frontend experience, explicitly call out
the split:

- what changes belong in `web-unified-docs`
- what changes belong in `dev-portal`
- what needs coordinated preview testing across both repos
