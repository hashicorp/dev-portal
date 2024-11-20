import { ApiDocsUrlContext } from '../types'

/**
 * Given an array of URL params, parse the context for an OpenAPI v2 URL, and
 * Return { isVersionedUrl, versionId, operationSlug } parsed from the URL.
 */
export function parseOpenApiUrlContext(
	params: string[] | never
): ApiDocsUrlContext {
	/**
	 * We expect URLs in one of the two following formats:
	 *
	 * 1. Un-versioned, for the "latest" version:
	 * - /<basePath> (landing page)
	 * - /<basePath>/[operationSlug] (operation page)
	 *
	 * 2. Versioned, for a specific version:
	 * - /<basePath>/[versionId] (landing page)
	 * - /<basePath>/[versionId]/[operationSlug] (operation page)
	 *
	 * We need to determine which format we're in, and then
	 * generate the appropriate static props.
	 *
	 * We expect versions to be in the format `YYYY-MM-DD`.
	 * If the first param is a version, we're in a versioned context.
	 * Note that we may not have a first param, if we're on the landing
	 * page in an un-versioned context.
	 */
	const pathParts = Array.isArray(params) ? params : []
	const isVersionedUrl = /^\d{4}-\d{2}-\d{2}$/.test(pathParts[0])
	const versionId = isVersionedUrl ? pathParts[0] : 'latest'

	// Note: operationSlug may be undefined, eg if we're  on a landing page
	const operationSlug = isVersionedUrl ? pathParts[1] : pathParts[0]

	/**
	 * Return the parsed context
	 */
	return {
		isVersionedUrl,
		versionId,
		operationSlug,
	}
}
