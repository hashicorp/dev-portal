/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { getContentApiBaseUrl } from '../unified-docs-migration-utils'

export class ContentApiError extends Error {
	name = 'ContentApiError' as const
	constructor(
		message: string,
		public status: number,
		public resource: 'nav-data' | 'doc' | 'version-metadata',
		public resource_url: string,
	) {
		super(message)
	}
}

interface fetchDocsContentProps {
	url: string
	includeBypassHeader: boolean
	useOldMarketingContentAPI?: boolean
	product?: string
	resource?: 'nav-data' | 'doc' | 'version-metadata'
}

/**
 * Fetches docs content from either the UDR (Unified Docs Repository) API or
 * the legacy Marketing Content Docs API.
 *
 * The `url` is appended to the selected API base URL to form the full request
 * path - i.e. ${UNIFIED_DOCS_API}/${url}
 *
 * @param url - The path to append to the API base URL.
 * @param includeBypassHeader - When `true` and `UDR_VERCEL_AUTH_BYPASS_TOKEN`
 *   is set, adds the `x-vercel-protection-bypass` header to the request. Used
 *   to reach password-protected Vercel preview deployments.
 * @param useOldMarketingContentAPI - When `true`, routes the request to the
 *   legacy Marketing Content Docs API instead of the UDR API. Defaults to
 *   `false`.
 * @param product - The product name passed to `getContentApiBaseUrl` to
 *   resolve the correct Marketing Content API base URL. Only relevant when
 *   `useOldMarketingContentAPI` is `true`.
 * @param resource - The type of resource being fetched (`"nav-data"`,
 *   `"doc"`, or `"version-metadata"`). Only relevant when
 *   `useOldMarketingContentAPI` is `true`; used to populate the typed
 *   `ContentApiError` on non-200 responses.
 */
export const fetchDocsContent = async ({
	url,
	includeBypassHeader,
	useOldMarketingContentAPI = false,
	product,
	resource,
}: fetchDocsContentProps): Promise<Response> => {
	let API_BASE_URL = ''
	// builder headers
	const headers =
		includeBypassHeader && process.env.UDR_VERCEL_AUTH_BYPASS_TOKEN
			? new Headers({
					'x-vercel-protection-bypass':
						process.env.UDR_VERCEL_AUTH_BYPASS_TOKEN,
				})
			: new Headers()

	// 1. Check if content API
	if (useOldMarketingContentAPI) {
		API_BASE_URL = getContentApiBaseUrl(product)
	} else {
		API_BASE_URL = process.env.UNIFIED_DOCS_API
	}

	// 2. Form fetch query
	const QUERY_URL = `${API_BASE_URL}/${url}`

	// 3. Fetch the query
	const response = await fetch(QUERY_URL, { headers })

	// 4. For content API calls, throw a typed error on non-200 so callers get
	//    structured error info. For non-content-API calls, return the response
	//    and let the caller inspect .ok / .status as needed.
	if (useOldMarketingContentAPI && response.status !== 200) {
		throw new ContentApiError(
			`Failed to fetch: ${QUERY_URL}`,
			response.status,
			resource,
			QUERY_URL,
		)
	}

	return response
}
