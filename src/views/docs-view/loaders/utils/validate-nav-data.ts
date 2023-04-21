/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { NavData } from '@hashicorp/react-docs-sidenav/types'
import validateFilePaths from '@hashicorp/react-docs-sidenav/utils/validate-file-paths'
import validateRouteStructure from '@hashicorp/react-docs-sidenav/utils/validate-route-structure'
import validateUnlinkedContent from '@hashicorp/react-docs-sidenav/utils/validate-unlinked-content'

export async function validateNavData(
	navData: NavData,
	localContentDir: string
) {
	const withFilePaths = await validateFilePaths(navData, localContentDir)
	// Validate unlinked content checks for content files that are NOT
	// included in the provided navData. This requires filesystem access,
	// similar to validateFilePaths
	const unlinkedRoutes = await validateUnlinkedContent(navData, localContentDir)
	if (unlinkedRoutes.length > 0) {
		const COLOR_RESET = '\x1b[0m'
		const COLOR_RED = '\x1b[31m'
		const jsonList = JSON.stringify(unlinkedRoutes, null, 2)
		throw new Error(
			`\n${COLOR_RED}Error: Unlinked pages found in the ${localContentDir} directory.\n\nPlease add these paths to the "${localContentDir}" nav data file, or remove the .mdx files. If you want the pages to exist but not be linked in the navigation, you can add a "hidden" property to the page object in the navigation structure.\n\n${jsonList}${COLOR_RESET}\n\n`
		)
	}
	// Note: validateRouteStructure returns navData with additional __stack properties,
	// which detail the path we've inferred for each branch and node
	// (branches do not have paths defined explicitly, so we need to infer them)
	// We don't actually need the __stack properties for rendering, they're just
	// used in validation, so we don't use the output of this function.
	validateRouteStructure(withFilePaths)
	// Return the resolved, validated navData
	return withFilePaths
}
