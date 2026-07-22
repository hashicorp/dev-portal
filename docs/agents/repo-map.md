# Repo map

## Primary source directories

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

## Feature-local documentation

Some features document themselves directly next to their implementation rather than in
`docs/` or the root `README.md`. A directory may include its own `README.md` explaining how
that piece works, how to extend it, and how to test it — for example `src/content/README.md`,
`src/data/README.md`, and several others under `src/`.

Before changing a feature, look for a co-located `README.md` or notes file in the same
directory (and parent directories) and read it first. When you change the feature's
behavior, update that co-located documentation in the same PR.
