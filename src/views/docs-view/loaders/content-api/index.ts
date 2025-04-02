/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getContentApiBaseUrl } from 'lib/unified-docs-migration-utils'
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
) {
	const contentApiBaseUrl = getContentApiBaseUrl(product)
	const fullPath = `nav-data/${version}/${basePath}`
	const url = `${contentApiBaseUrl}/api/content/${product}/${fullPath}`

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
) {
	const contentApiBaseUrl = getContentApiBaseUrl(product)
	const url = `${contentApiBaseUrl}/api/content/${product}/${fullPath}`
	const response = await fetch(url)

	if (response.status !== 200) {
		throw new ContentApiError(`Failed to fetch: ${url}`, response.status)
	}

	const { result } = await response.json()
	return result
}

export async function fetchVersionMetadataList(product: string) {
	const contentApiBaseUrl = getContentApiBaseUrl(product)
	const url = `${contentApiBaseUrl}/api/content/${product}/version-metadata?partial=true`
	const response = await fetch(url)

	if (response.status !== 200) {
		throw new ContentApiError(`Failed to fetch: ${url}`, response.status)
	}

	const { result } = await response.json()
	return result
}
