# Architecture & docs rendering

Read this before changing docs rendering, routing, or caching behavior.

## High-value architecture facts

- Next.js app requiring Node `>=24.0.0 <25.0.0`.
- Runs **Next.js 16** (`^16.2.7`) with **React 19** (`^19.2.7`). Write code for those
  majors and confirm the installed versions in `package.json` before using APIs that
  changed across major versions. Do not assume older Next.js (13/14) or React 18 patterns.
- Middleware lives in `src/proxy.ts` (the Next.js 16 convention), **not**
  `src/middleware.ts`. When adding or changing edge middleware (redirects, UA blocks,
  tutorial-variant rewrites), edit `src/proxy.ts`; do not create a `middleware.ts` file.
  Legacy docs, comments, and the `dev-portal-workflows.png` diagram may still say
  `middleware.ts` — treat that as the old name for `src/proxy.ts`.
- Rendering is primarily through the Pages Router (`src/pages/`); the App Router surface
  is currently limited to API routes (`src/app/api/`).
- Builds use webpack (`next build --webpack`). The `prebuild`/`prestart` scripts generate
  tutorial maps, extract HVD content, and build the sitemap.
- Content is sourced from multiple external APIs and the local filesystem — see
  [content-sources.md](content-sources.md).
- Generated/derived output lands in `src/.generated/` and `src/.extracted/`; treat those
  as build products, not hand-edited source.

## How docs pages render and get their content

Most product docs pages are Incremental Static Regeneration (ISR) pages, not per-request
SSR. The request/render chain for a typical docs route is:

1. a route file under `src/pages/<product>/docs/[...page].tsx` (or the generic
   `src/pages/[productSlug]/docs/index.tsx`) wires the page using
   `getRootDocsPathGenerationFunctions(productSlug, basePath)` in
   `src/views/docs-view/utils/get-root-docs-path-generation-functions.ts`
1. that returns `getStaticPaths` / `getStaticProps` from `src/views/docs-view/server.ts`
1. `getStaticProps` uses `RemoteContentLoader`
   (`src/views/docs-view/loaders/remote-content.ts`), which calls the content-api client
   (`src/views/docs-view/loaders/content-api/index.ts`) to fetch nav data, MDX, and version
   metadata, then renders MDX through remark/rehype
1. the rendered page is served via `src/views/docs-view/index.tsx`

Key verified behaviors (confirm in `src/views/docs-view/server.ts` before relying on them):

- `getStaticProps` returns `revalidate: __config.dev_dot.revalidate` (currently `43200`,
  i.e. 12 hours, in `config/base.json`). This is the ISR window.
- `getStaticPaths` does **not** prebuild every docs URL. It prunes to the most
  analytics-popular paths via `getStaticPathsFromAnalytics`
  (`src/lib/get-static-paths-from-analytics.ts`, limited by
  `__config.dev_dot.max_static_paths`) intersected with valid nav paths, and returns
  `fallback: 'blocking'`. Paths that miss the cut are rendered on first request, then cached.
- Two cases **bypass** the analytics prune and prebuild all paths: deploy previews of a
  content source repo, and `terraform-cdk` (its pages exceed the ISR lambda response limit).
  Both are explicit branches in `server.ts`.
- When the content API 404s for a path, `getStaticProps` returns
  `{ notFound: true, revalidate: 10 }` so the 404 is retried rather than cached long-term.
- On-demand cache invalidation exists via the token-protected `src/pages/api/revalidate.ts`
  and `src/pages/api/revalidate/paths.ts`, which call `response.revalidate(path)`.

Which backend serves a product's content depends on `flags.unified_docs_migrated_repos`
(see [content-sources.md](content-sources.md)): migrated repos are served by the unified
docs API, and everything else falls back to the legacy content API
(`MKTG_CONTENT_DOCS_API`). The switch logic lives in
`src/lib/unified-docs-migration-utils.ts`.

## Architecture diagrams

Three committed diagrams under `docs/architecture-diagrams/` give a visual mental model.
They are secondary references — verify specifics against the code before relying on them.

- `dev-portal-workflows.png` — build/deploy lifecycle (`prebuild` → `build` → `postbuild`)
  and the ISR user-request flow, including the prebuild script order and `getStaticProps`
  fetching from the unified docs API and writing HTML to the ISR cache.
- `dev-portal-entrypoint-architecture.png` — the distinct page entry points (integrations,
  tutorials, landing pages, downloads, docs, OpenAPI docs) and the content source of truth
  behind each (integrations API, Learn API, releases API, the unified docs API, and the
  GitHub API for product-generated `swagger.json`).
- `dev-portal-sitemap.png` — the page-type taxonomy (custom landing, templatized landing,
  distinct template, and docs-markdown pages) and the route hierarchy under `/[product]`.
