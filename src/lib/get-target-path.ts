/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	TFE_VERSION_IN_PATH_REGEXP,
	VERSION_IN_PATH_REGEX,
} from 'constants/version-path'

interface GetTargetPathArgs {
	basePath: string
	asPath: string
	version: string
}

/**
 * Get a target path for router navigation; Handles dynamic basePath
 */
export function getTargetPath({
	basePath,
	asPath,
	version,
}: GetTargetPathArgs): string {
	// Remove the basePath and a following slash if it exists from the asPath
	const pathSegments = asPath
		.replace(new RegExp(`${basePath}/?`), '')
		.replace(/^https?:\/\/[a-z-:0-9.]+|^\//i, '') // remove scheme/domain/port and leading slash
		.split('/')

	if (
		pathSegments.filter((segment) => TFE_VERSION_IN_PATH_REGEXP.test(segment))
			.length > 1
	) {
		const index = pathSegments.findIndex((segment) =>
			TFE_VERSION_IN_PATH_REGEXP.test(segment)
		)

		if (index !== -1) {
			pathSegments.splice(index, 1)
		}
	}

	// version is only expected to be at index 2, or 3 in the case of TF-Plugins
	const indexOfVersion = pathSegments.findIndex(
		(el) =>
			TFE_VERSION_IN_PATH_REGEXP.test(el) || VERSION_IN_PATH_REGEX.test(el)
	)

	// if a version is in the path, strip it and its preceding path segment so we can replace it
	if (indexOfVersion !== -1) {
		if (pathSegments[indexOfVersion - 2] === 'releases') {
			// Extract the year from the version
			const year = version.slice(1, 5)
			pathSegments.splice(indexOfVersion - 2, 3, 'releases', year, version)
		} else {
			pathSegments.splice(indexOfVersion, 1, version)
		}
	} else {
		// If version is not in the path, insert it at the beginning
		pathSegments.unshift(version)
	}

	// Ensure that basePath does not end with a slash
	basePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
	let pathSegmentsString = pathSegments.join('/')

	let finalPath = '/' + basePath + '/' + pathSegmentsString

	// Remove trailing slash if it exists
	finalPath = finalPath.replace(/\/$/, '')

	return finalPath
}
