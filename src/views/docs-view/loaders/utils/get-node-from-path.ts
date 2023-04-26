/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { NavData } from '@hashicorp/react-docs-sidenav/types'
import path from 'path'

export function flattenRoutes(nodes: NavData) {
	return nodes.reduce((acc, n) => {
		if (!('routes' in n)) {
			return acc.concat(n)
		}
		return acc.concat(flattenRoutes(n.routes))
	}, [] as NavData)
}

export function getNodeFromPath(
	pathToMatch: string,
	navData: NavData,
	localContentDir: string
) {
	// If there is no path array, we return a
	// constructed "home page" node. This is just to
	// provide authoring convenience to not have to define
	// this node. However, we could ask for this node to
	// be explicitly defined in `navData` (and if it isn't,
	// then we'd render a 404 for the root path)
	const isLandingPage = pathToMatch === ''
	if (isLandingPage) {
		return {
			filePath: path.join(localContentDir, 'index.mdx'),
		}
	}
	//  If it's not a landing page, then we search
	// through our navData to find the node with a path
	// that matches the pathArray we're looking for.

	const allNodes = flattenRoutes(navData)
	const matches = allNodes.filter((n) => n.path === pathToMatch)
	// Throw an error for missing files - if this happens,
	// we might have an issue with `getStaticPaths` or something
	if (matches.length === 0) {
		throw new Error(`Missing resource to match "${pathToMatch}"`)
	}
	// Throw an error if there are multiple matches
	// If this happens, there's likely an issue in the
	// content source repo
	if (matches.length > 1) {
		throw new Error(
			`Ambiguous path matches for "${pathToMatch}". Found:\n\n${JSON.stringify(
				matches
			)}`
		)
	}
	//  Otherwise, we have exactly one match,
	//  and we can return the filePath off of it
	return matches[0]
}
