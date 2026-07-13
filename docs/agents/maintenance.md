# Maintaining these guides

These files are operational documentation derived from the repository's current source of
truth. Use the [source hierarchy](#source-hierarchy) below to decide what to trust, keep the
[safe-change checklist](#safe-change-checklist) in mind before opening a PR, and follow the
[drift-detection](#drift-detection) rule to catch stale guidance.

## Source hierarchy

Use this priority order when gathering context:

1. Implementation files and tests in this repository.
1. Content-local or feature-local instruction/`README` files inside the specific directory
   when the task is scoped to that area.
1. Root operational files such as `README.md`, `package.json`, `vitest.config.mts`,
   `playwright.config.ts`, `next.config.js`, and `.github/workflows/*.yml`.
1. Focused internal docs under `docs/` (note: `docs/decisions/` ADRs are sparse and
   historical — only the two 2024 unified-docs env ADRs exist and nothing since — so treat
   them as background, not an active process).

## Safe-change checklist

Before opening or updating a PR:

1. Verified the behavior in the relevant source files.
1. Added or updated the narrowest useful test when changing code.
1. Ran the relevant test command locally (`npm run test`, or `npx vitest run <file>`).
1. Let the commit hooks run typecheck and lint (`simple-git-hooks` + `lint-staged`); fix any
   failures they surface.
1. Checked whether the change also affects preview or deployment workflows.
1. Called out any required `web-unified-docs` (or other content-source) follow-up explicitly.

## Maintenance rule

When updating these guides:

1. prefer improving an existing section over creating overlapping guidance
1. remove stale claims instead of layering exceptions on top of them
1. keep the guidance specific to `dev-portal`
1. verify every operational statement against the repo before adding it

Update the relevant guide in the same PR when your change modifies any of the following:

- local development commands in `README.md` or `package.json`
- required runtime versions, build steps, or validation commands
- repository structure, source-of-truth directories, or generated artifact locations
- behavior in `.github/workflows/*.yml`
- Vercel preview or production deployment flow
- the contract or working relationship between `dev-portal` and `web-unified-docs` (or other
  content sources)
- the recommended place to start for a common task

Before updating a guide:

1. read the implementation or workflow file that actually changed
1. update only the sections affected by that change
1. remove outdated guidance in the same edit
1. keep summaries short and point readers to source files for details

If you changed any of the trigger areas above and did not update the guides, explain why in
your final summary. Do not add speculative guidance just to keep these files synchronized. If
the new behavior is not yet verified, leave the existing text unchanged and call out the gap
explicitly.

## Drift detection

Not every change to this repo is made with an AI agent in the loop. A developer may edit a
workflow, bump the Node version, rename a directory, or change a command directly. When that
happens, the corresponding guidance here can silently go stale. The next agent to work in the
repo is responsible for catching that drift.

At the start of any task that relies on facts in these guides, spot-check the specific facts
you are about to depend on against their source of truth before acting on them. You do not
need to re-verify everything — only the claims relevant to your current task:

- runtime version, scripts, or commands — verify against `package.json` and `README.md`
- framework majors (Next.js, React) and the `middleware.ts` → `proxy.ts` convention — verify
  against `package.json` and the presence of `src/proxy.ts`
- unit test environment or excluded paths — verify against `vitest.config.mts`
- e2e behavior — verify against `playwright.config.ts` and `.github/workflows/playwright.yml`
- repository structure or generated artifact locations — verify against the actual directory tree
- CI, preview, or deployment behavior — verify against `.github/workflows/*.yml`,
  `vercel.json`, and the Vercel project
- configuration behavior — verify against `config/index.js` and `config/*.json`
- the `dev-portal` ↔ `web-unified-docs` contract — verify against `config/index.js`,
  `src/lib/unified-docs-migration-utils.ts`, and the unified docs API

When you find that a guide disagrees with the source of truth:

1. trust the source of truth, not the guide, for the task at hand
1. correct the stale statement in the guide as part of your change
1. if the correction is outside the scope of your current task, call out the drift explicitly
   in your final summary so a human can follow up
1. never "fix" a guide to match an assumption — only update it to match a fact you verified in
   the repository
