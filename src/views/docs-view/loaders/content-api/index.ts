/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const MKTG_CONTENT_DOCS_API = process.env.MKTG_CONTENT_DOCS_API

// Courtesy helper for warning about missing env vars during development
const checkEnvVarsInDev = () => {
	if (process.env.NODE_ENV === 'development') {
		if (!MKTG_CONTENT_DOCS_API) {
			const message = [
				'Missing environment variable required to fetch remote content:',
				'  - `MKTG_CONTENT_DOCS_API`',
				'Reach out to #team-web-platform to get the proper value.',
			].join('\n')
			throw new Error(message)
		}
	}
}

export class ContentApiError extends Error {
	name = 'ContentApiError' as const
	constructor(message: string, public status: number) {
		super(message)
	}
}

export async function fetchNavData(
	product: string, //: string, // waypoint
	basePath: string, //: string, // commands | docs | plugins
	version: string //: string // v0.5.x
): Promise<any> {
	checkEnvVarsInDev()

	const fullPath = `nav-data/${version}/${basePath}`
	const url = `${MKTG_CONTENT_DOCS_API}/api/content/${product}/${fullPath}`

	const response = await fetch(url)

	if (response.status !== 200) {
		throw new ContentApiError(`Failed to fetch: ${url}`, response.status)
	}

	const { result } = await response.json()
	return result
}

export async function fetchDocument(
	product: string,
	fullPath: string
): Promise<any> {
	checkEnvVarsInDev()

	const url = `${MKTG_CONTENT_DOCS_API}/api/content/${product}/${fullPath}`
	const response = await fetch(url)

	if (response.status !== 200) {
		throw new ContentApiError(`Failed to fetch: ${url}`, response.status)
	}

	const { result } = await response.json()
	return result
}

export async function fetchVersionMetadataList(product: string) {
	checkEnvVarsInDev()

	const url = `${MKTG_CONTENT_DOCS_API}/api/content/${product}/version-metadata?partial=true`
	const response = await fetch(url)

	if (response.status !== 200) {
		throw new ContentApiError(`Failed to fetch: ${url}`, response.status)
	}

	const { result } = await response.json()
	return result
}
