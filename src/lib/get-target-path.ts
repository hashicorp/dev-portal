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

	// Find the indices of all segments that match TFE_VERSION_IN_PATH_REGEXP
	const matchingIndices = pathSegments.reduce((indices, segment, index) => {
		if (TFE_VERSION_IN_PATH_REGEXP.test(segment)) {
			indices.push(index)
		}
		return indices
	}, [])

	// If there's more than one matching segment, remove the first one
	if (matchingIndices.length > 1) {
		pathSegments.splice(matchingIndices[0], 1)
	}

	// Find the index of the version segment
	const indexOfVersion = pathSegments.findIndex(
		(el) =>
			TFE_VERSION_IN_PATH_REGEXP.test(el) || VERSION_IN_PATH_REGEX.test(el)
	)

	// If a version is in the path, replace it; otherwise, insert it at the beginning
	if (indexOfVersion !== -1) {
		let spliceArgs:
			| [number, number, string]
			| [number, number, string, string, string]

		if (pathSegments[indexOfVersion - 2] === 'releases') {
			spliceArgs = [
				indexOfVersion - 2,
				3,
				'releases',
				version.slice(1, 5),
				version,
			]
			pathSegments.splice(
				...(spliceArgs as [number, number, string, string, string])
			)
		} else {
			spliceArgs = [indexOfVersion, 1, version]
			pathSegments.splice(...(spliceArgs as [number, number, string]))
		}
	} else {
		pathSegments.unshift(version)
	}

	// Construct the final path
	let finalPath = `/${basePath.replace(/\/$/, '')}/${pathSegments.join(
		'/'
	)}`.replace(/\/$/, '')

	return finalPath
}
