/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Utilities
import { findDefaultVersion } from 'views/open-api-docs-view/utils'
// Types
import type { ApiDocsVersionData } from 'lib/api-docs/types'

/**
 * TODO: write description
 */
export default function parseVersionData(
	pathParts: string[],
	versionData
): {
	isVersionedUrl: boolean
	defaultVersion: ApiDocsVersionData | undefined
	targetVersion: ApiDocsVersionData | undefined
} {
	const versionId = pathParts?.length > 0 ? pathParts[0] : null
	const isVersionedUrl = typeof versionId === 'string'
	const defaultVersion = findDefaultVersion(versionData)
	// Resolve the current version
	let targetVersion: ApiDocsVersionData | undefined
	if (isVersionedUrl) {
		targetVersion = versionData.find((v) => v.versionId === versionId)
	} else {
		targetVersion = defaultVersion
	}
	return {
		isVersionedUrl,
		defaultVersion,
		targetVersion,
	}
}
