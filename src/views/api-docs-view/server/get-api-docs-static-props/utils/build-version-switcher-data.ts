/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { ApiDocsVersionData } from 'lib/api-docs/types'
import { findLatestStableVersion } from 'lib/api-docs'

/**
 * Construct a label and options for an API docs version switcher.
 */
function buildVersionSwitcherData({
	versionData,
	currentVersionId,
	baseUrl,
	apiName,
}: {
	versionData: ApiDocsVersionData[]
	currentVersionId: string
	baseUrl: string
	apiName: string
}) {
	const latestStableVersion = findLatestStableVersion(versionData)
	const options = versionData.map((v: ApiDocsVersionData) => {
		const isLatest = v.versionId === latestStableVersion?.versionId
		const label = `${v.versionId} (${v.releaseStage})`
		const ariaLabel = `Choose a version of the ${apiName}. Currently viewing ${label}.`
		return {
			label,
			ariaLabel,
			isLatest,
			isSelected: v.versionId === currentVersionId,
			href: isLatest ? baseUrl : `${baseUrl}/${v.versionId}`,
		}
	})
	return { label: apiName, options }
}

export { buildVersionSwitcherData }
