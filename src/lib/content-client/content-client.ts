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

export const ContentClient = async (
	url: string,
	hasHeaders: boolean,
	isContentAPI: boolean,
	product?: string,
	resource?: 'nav-data' | 'doc' | 'version-metadata',
): Promise<Response> => {
	let API_BASE_URL = ''
	// builder headers
	const headers =
		hasHeaders && process.env.UDR_VERCEL_AUTH_BYPASS_TOKEN
			? new Headers({
					'x-vercel-protection-bypass':
						process.env.UDR_VERCEL_AUTH_BYPASS_TOKEN,
				})
			: new Headers()

	// 1. Check if content API
	if (isContentAPI) {
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
	if (response.status !== 200 && isContentAPI) {
		throw new ContentApiError(
			`Failed to fetch: ${QUERY_URL}`,
			response.status,
			resource,
			QUERY_URL,
		)
	}

	return response
}
