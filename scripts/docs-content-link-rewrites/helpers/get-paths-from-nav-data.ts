/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { fileContentEntry } from "./fetch-nav-data-for-repo-and-base-path"

/**
 * @NOTE copied from:
 * node_modules/@hashicorp/react-docs-page/server/consts.ts
 */
const DEFAULT_PARAM_ID = 'page'

/**
 * @NOTE copied from:
 * node_modules/@hashicorp/react-docs-page/server/get-paths-from-nav-data.ts
 */
function getPathArraysFromNodes(navNodes: fileContentEntry[]): string[][] {
	const slugs: string[][] = navNodes.reduce(
		(acc: string[][], navNode: fileContentEntry) => {
			// Individual items have a path, these should be added
			if ('path' in navNode) {
				return acc.concat([navNode.path.split('/')])
			}
			// Category items have child routes, these should all be added
			if ('routes' in navNode) {
				return acc.concat(getPathArraysFromNodes(navNode.routes))
			}
			// All other node types (dividers, external links) can be ignored
			return acc
		},
		[] as string[][]
	)
	return slugs
}

/**
 * @NOTE copied from:
 * node_modules/@hashicorp/react-docs-page/server/get-paths-from-nav-data.ts
 */
function getPathsFromNavData(
	navDataResolved: fileContentEntry[],
	paramId: string = DEFAULT_PARAM_ID
): {
	params: Record<string, string[]>
}[] {
	//  Transform navigation data into path arrays
	const pagePathArrays = getPathArraysFromNodes(navDataResolved)
	// Ensure we include an empty array for the "/" index page path
	// (may be included in nav-data, eg for Terraform, or may not, eg for all other sites)
	const hasIndexPage =
		pagePathArrays.filter((p) => p && p.length == 0).length > 0
	if (!hasIndexPage) {
		pagePathArrays.unshift([])
	}
	// Return the array of all page paths
	const paths = pagePathArrays.map((p: string[]) => {
		return { params: { [paramId]: p }, }
	})
	return paths
}

export { getPathsFromNavData }
