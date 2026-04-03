/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { getVersionFromPath } from 'lib/get-version-from-path'

export function isRestrictedDocsPath(path: string): boolean {
	const pathname =
		path.startsWith('http://') || path.startsWith('https://')
			? new URL(path).pathname
			: path

	const pathSegments = pathname.split('/').filter(Boolean)

	if (pathSegments[0] !== 'vault' || pathSegments[1] !== 'docs') {
		return false
	}

	if (pathSegments[2] === 'restricted') {
		return true
	}

	return (
		pathSegments[2] === getVersionFromPath(pathname) &&
		pathSegments[3] === 'restricted'
	)
}