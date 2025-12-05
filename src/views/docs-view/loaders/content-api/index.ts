/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { getContentApiBaseUrl } from 'lib/unified-docs-migration-utils'
export class ContentApiError extends Error {
	name = 'ContentApiError' as const
	constructor(message: string, public status: number) {
		super(message)
	}
}

const headers = process.env.UDR_VERCEL_AUTH_BYPASS_TOKEN
	? new Headers({
			'x-vercel-protection-bypass': process.env.UDR_VERCEL_AUTH_BYPASS_TOKEN,
	  })
	: new Headers()

/**
 * Retries an async operation with exponential backoff for transient 404 errors.
 * 
 * This helps handle temporary backend unavailability (cold starts, network blips, etc.)
 * without caching 404 pages during ISR revalidation.
 * 
 * @param fn - The async function to retry
 * @param retries - Number of retry attempts (default: 3)
 * @returns The result of the function call
 * @throws The error after all retries are exhausted
 */
async function retryOn404<T>(
	fn: () => Promise<T>,
	retries = 3
): Promise<T> {
	let lastError: Error
	
	for (let attempt = 0; attempt < retries; attempt++) {
		try {
			return await fn()
		} catch (error) {
			lastError = error as Error
			
			// Only retry on 404 errors (transient backend failures)
			// Other errors (500, network errors, etc.) should be thrown immediately
			if ('status' in error && error.status === 404) {
				if (attempt < retries - 1) {
					// Exponential backoff: 100ms, 200ms, 400ms
					const delay = 100 * Math.pow(2, attempt)
					await new Promise(resolve => setTimeout(resolve, delay))
					continue
				}
			}
			// Non-404 errors or last attempt - throw immediately
			throw error
		}
	}
	// Should never reach here, but TypeScript needs it
	throw lastError!
}

export async function fetchNavData(
	product: string, //: string, // waypoint
	basePath: string, //: string, // commands | docs | plugins
	version: string //: string // v0.5.x
) {
	return retryOn404(async () => {
		const contentApiBaseUrl = getContentApiBaseUrl(product)
		const fullPath = `nav-data/${version}/${basePath}`
		const url = `${contentApiBaseUrl}/api/content/${product}/${fullPath}`

		const response = await fetch(url, { headers })

		if (response.status !== 200) {
			throw new ContentApiError(`Failed to fetch: ${url}`, response.status)
		}

		const { result } = await response.json()
		return result
	})
}

export async function fetchDocument(product: string, fullPath: string) {
	return retryOn404(async () => {
		const contentApiBaseUrl = getContentApiBaseUrl(product)
		const url = `${contentApiBaseUrl}/api/content/${product}/${fullPath}`
		const response = await fetch(url, { headers })

		if (response.status !== 200) {
			throw new ContentApiError(`Failed to fetch: ${url}`, response.status)
		}

		const { result } = await response.json()
		return result
	})
}

export async function fetchVersionMetadataList(product: string) {
	const contentApiBaseUrl = getContentApiBaseUrl(product)
	const url = `${contentApiBaseUrl}/api/content/${product}/version-metadata?partial=true`
	const response = await fetch(url, { headers })

	if (response.status !== 200) {
		throw new ContentApiError(`Failed to fetch: ${url}`, response.status)
	}

	const { result } = await response.json()
	return result
}
