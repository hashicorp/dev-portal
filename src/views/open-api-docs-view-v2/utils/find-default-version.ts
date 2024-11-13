/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ApiDocsVersionData } from 'lib/api-docs/types'
import { sortDateVersionData } from './sort-date-version-data'

/**
 * Given an array of version data,
 * Return the default version that should be shown.
 *
 * - If there is exactly one version, we treat it as the default version.
 * - If there are multiple versions, but no `stable` version, we'll show
 *   the very latest version as the default version (even if not `stable`).
 * - If there are multiple versions, and at least one `stable` version,
 *   we'll show the latest `stable` version as the default version.
 *
 * Note: only supports date-based version formats, for example "2023-01-15".
 * We'd need to update the sort logic in order to support other formats.
 */
export function findDefaultVersion(
	versionData: ApiDocsVersionData[]
): ApiDocsVersionData {
	// If we have exactly one version, we'll show that as the default.
	if (versionData.length === 1) {
		return versionData[0]
	}
	// Sort versions in descending order
	const versionsDescending = sortDateVersionData(versionData)
	// Ideally, we'll show the latest 'stable' release as the default.
	const latestStableVersion = versionsDescending.find(
		(v) => v.releaseStage === 'stable'
	)
	// Fall back to the latest version (any stage!) if there's no 'stable' version
	const defaultVersion = latestStableVersion || versionsDescending[0]
	// Return the default version
	return defaultVersion
}
