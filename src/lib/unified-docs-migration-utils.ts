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
 * migrated to the unified docs repository, or `false` otherwise.
 *
 * Currently, the list of migrated repositories is managed as a flag in the
 * `config` files at the root of this project (`hashicorp/dev-portal`).
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

/**
 * Given a string, expected to be a URL,
 * Return `true` if the URL is a content API URL, or `false` otherwise.
 *
 * Note that as we're in the process
 * of migrating to the unified docs API, Content API urls could either use our
 * old base URL (MKTG_CONTENT_DOCS_API) or the new one (UNIFIED_DOCS_API).
 */
function checkIsContentApiUrl(url: string): boolean {
	const contentApiBaseUrls = [MKTG_CONTENT_DOCS_API, UNIFIED_DOCS_API]
	return contentApiBaseUrls.some((apiUrl) => url.startsWith(apiUrl))
}

export {
	checkIsContentApiUrl,
	checkIsMigratedToUnifiedDocs,
	getContentApiBaseUrl,
}
