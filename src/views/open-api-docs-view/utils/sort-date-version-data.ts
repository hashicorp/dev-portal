/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { ApiDocsVersionData } from 'lib/api-docs/types'

/**
 * Sort version data in descending order.
 *
 * Note: only works with `YYYY-MM-DD` version formats.
 */
export function sortDateVersionData(
	versionData: ApiDocsVersionData[]
): ApiDocsVersionData[] {
	return versionData.sort((a, b) => {
		// We expect consistent YYYY-MM-DD formatting, so string compare works fine
		const aBeforeB = a.versionId > b.versionId
		const bBeforeA = b.versionId > a.versionId
		return aBeforeB ? -1 : bBeforeA ? 1 : 0
	})
}
