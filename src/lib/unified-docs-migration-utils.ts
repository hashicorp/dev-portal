/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const MKTG_CONTENT_DOCS_API = process.env.MKTG_CONTENT_DOCS_API
const UNIFIED_DOCS_API = process.env.UNIFIED_DOCS_API

/**
 * Given a repository name,
 *
 * Return `true` if the content for the repository in question has been
 * migrated to the unified docs repository, for the purpose of serving
 * `.mdx` and nav-data `.json` documents. Return `false` if the repository
 * has not been migrated.
 *
 * Currently, the list of migrated repositories is managed as a flag in the
 * `config` files at the root of this project (`hashicorp/dev-portal`).
 *
 * NOTE: in this context "document service" includes the API operations
 * that serve docs content version metadata, nav-data `.json` files, and
 * individual `.mdx` document files.
 *
 * There are other docs-related operations that the content API provides, and
 * those operations likely make sense to migrate at the same time as our
 * document services. However, those other services have not yet been
 * implemented in the Unified Docs API. We may want to implement those services
 * and expand this flag to encompass them as well before proceeding.
 * Specifically, the services that relate closely to serving docs are:
 * - /api/content-versions - this API endpoint hasn't yet been fully
 *   implemented. Asana task:
 *   https://app.asana.com/0/1207899860738460/1208471953509347/f
 * - Image and asset serving - currently docs images and assets are served
 *   through an API route that more or less acts as a proxy to GitHub. Our new
 *   unified docs repo will have images and other assets in its `public` folder.
 *   Image components and related functions will need to be updated accordingly.
 *   Examples include `remark-rewrite-assets` and `remark-image-dimensions`.
 *   These updates are dependent on the approach we take to images. Asana task:
 *   https://app.asana.com/0/1207899860738460/1207910088307871/f
 * - Redirects - currently redirects are fetched directly from GitHub. We will
 *   likely want to move redirects into the unified docs repo, so that they
 *   exist alongside the content that they reference. Once we've decided on
 *   an approach, we'll be better able to implement a migration mechanism
 *   for redirects on a product-by-product basis. Asana task:
 *   https://app.asana.com/0/1207899860738460/1208307126937882/f
 * - fetchContentApiFileString - used within `shim-remote-includes`, which was
 *   a stopgap solution for Packer plugins. Ideally these should have since been
 *   migrated to Packer Integrations, but this migration may not be complete.
 *   If the migration isn't complete, we'll need to account for this
 *   operation at some point.
 *
 */
function checkIsMigratedToUnifiedDocs(repoName: string): boolean {
	const migratedRepos = __config.flags.unified_docs_migrated_repos
	return migratedRepos.indexOf(repoName) !== -1
}

/**
 * Given a repository name,
 *
 * Return the base URL for the content API to use, based on whether
 * the content for the repository in question has been migrated to the
 * unified docs repository.
 */
function getContentApiBaseUrl(repoName: string): string {
	checkEnvVarsInDev()
	return checkIsMigratedToUnifiedDocs(repoName)
		? UNIFIED_DOCS_API
		: MKTG_CONTENT_DOCS_API
}

/**
 * Courtesy helper, warn about any missing content API related
 * environment vars during development
 */
function checkEnvVarsInDev() {
	if (process.env.NODE_ENV === 'development') {
		const missingEnvVars = []
		if (!MKTG_CONTENT_DOCS_API) missingEnvVars.push('MKTG_CONTENT_DOCS_API')
		if (!UNIFIED_DOCS_API) missingEnvVars.push('UNIFIED_DOCS_API')
		if (missingEnvVars.length > 0) {
			const message = [
				'Missing environment variable required to fetch remote content:',
				missingEnvVars.map((v) => `  - \`${v}\``).join('\n'),
				'Reach out to #team-web-platform to get the proper value(s).',
			].join('\n')
			throw new Error(message)
		}
	}
}

export { getContentApiBaseUrl }
