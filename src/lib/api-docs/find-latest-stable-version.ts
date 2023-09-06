/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ApiDocsVersionData } from './types'
import { sortDateVersionData } from './sort-date-version-data'

/**
 * Given an array of version data,
 * Return the latest `stable` version.
 *
 * Note: only supports date-based version formats, for example "2023-01-15".
 * We'd need to update the sort logic in order to support other formats.
 */
function findLatestStableVersion(
	versionData: ApiDocsVersionData[]
): ApiDocsVersionData {
	// If we have exactly one version, we assume it's the latest stable version.
	if (versionData.length === 1) {
		return versionData[0]
	}
	// Sort versions in descending order
	const versionsDescending = sortDateVersionData(versionData)
	// Return the first 'stable' release we can find in descending versions
	return versionsDescending.find((v) => v.releaseStage === 'stable')
}

export { findLatestStableVersion }
