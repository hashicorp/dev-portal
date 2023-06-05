/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { RootDocsPath } from 'types/products'

export function getParentRootDocsPath(
	targetPath: string,
	rootDocsPaths: RootDocsPath[]
): RootDocsPath | null {
	/**
	 * A rootDocsPath is considered "nested" if it has multiple path parts.
	 */
	const pathParts = targetPath.split('/')
	const isNestedPath = pathParts.length > 1
	/**
	 * If we have a nested path, we try to find the parent rootDocsPath.
	 * Note that we may not find a match.
	 */
	if (isNestedPath) {
		const parentPath = pathParts.slice(0, pathParts.length - 1).join('/')
		const parentMatches = rootDocsPaths.filter((rootDocsPath) => {
			return rootDocsPath.path == parentPath
		})
		if (parentMatches.length > 0) {
			const parentDocsPath = parentMatches[0]
			return parentDocsPath
		}
	}
	/**
	 * If we can't find a "parent" rootDocsPath, return null
	 */
	return null
}
