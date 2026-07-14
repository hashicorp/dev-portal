# CI, previews & deployment

Work from this baseline mental model, then verify details in the workflow files under
`.github/workflows/`.

## CI

- `ci.yml` runs on pull requests, merge groups, and pushes to `main`. It has a `test` job
  (`npm ci` then `npm run test:ci`, which runs `npm run test`) and a `lint` job
  (`npm run lint`).
- Both jobs read the Node version from `package.json` via `node-version-file`.
- `nextjs_bundle_analysis.yml` tracks JavaScript bundle sizes.
- Other workflows cover container publishing (`docker_publish.yml`), caching (`cache.yml`),
  preview URL registration (`register-preview-url.yml`), and content-repo redeploys
  (`redeploy-content-repos.yml`); open the specific file before changing its behavior.

## Preview flow

- Preview deployments are built and hosted through Vercel.
- `playwright.yml` runs the Playwright e2e suite against a preview when a preview
  `deployment_status` reports `success`, using `E2E_BASE_URL` and the Vercel automation
  bypass secret.
- `register-preview-url.yml` handles preview URL registration.

## Production flow

- The production site is `developer.hashicorp.com`, deployed through Vercel.
- Verify the exact production trigger and steps in the relevant workflow and Vercel project
  before making claims about it.
