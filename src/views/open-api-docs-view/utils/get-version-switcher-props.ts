/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Types
import type { VersionSwitcherProps } from 'components/version-switcher'
import type { OpenApiDocsVersionData } from '../types'

/**
 * Given version data and other OpenAPI docs details,
 * Return version switcher dropdown props for use in `OpenApiDocsView`.
 *
 * Note: If there is only one version, we return null.
 */
export function getVersionSwitcherProps({
	projectName,
	versionData,
	targetVersion,
	defaultVersion,
	basePath,
}: {
	projectName: string
	versionData: OpenApiDocsVersionData[]
	targetVersion: OpenApiDocsVersionData
	defaultVersion: OpenApiDocsVersionData
	basePath: string
}): VersionSwitcherProps | null {
	// Return null early if we only have one version
	if (versionData.length === 1) {
		return null
	}

	// Otherwise, we have multiple versions, we need to build dropdown props
	const label = projectName

	// Each version becomes an option in the dropdown
	const options = versionData.map(
		({ versionId, releaseStage }: OpenApiDocsVersionData) => {
			/**
			 * Determine the version label suffix to show.
			 * - Default case is to show the version only, no (suffix)
			 * - If this is the default version, show 'latest'. For information on
			 *   what "default version" means, see `findDefaultVersion`.
			 * - If we have a defined releaseStage that isn't 'stable', show it
			 */
			const isLatest = versionId === defaultVersion.versionId
			let versionLabelSuffix = ''
			if (isLatest) {
				versionLabelSuffix = ' (latest)'
			} else if (releaseStage && releaseStage !== 'stable') {
				versionLabelSuffix = ` (${releaseStage})`
			}
			// Construct the label to show in the dropdown
			const label = versionId + versionLabelSuffix
			// Construct the aria-label for the version dropdown.
			const ariaLabel = `Choose a version of the API docs for ${projectName}. Currently viewing version ${label}.`
			// Construct the `href` for this version, which is special if latest
			const href = isLatest ? basePath : `${basePath}/${versionId}`
			// Mark this version option as selected if it's the current option
			const isSelected = versionId === targetVersion.versionId
			// Return all the props
			return { ariaLabel, href, isLatest, isSelected, label }
		}
	)

	// Return the dropdown props
	return { label, options }
}
