/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	TFE_VERSION_IN_PATH_REGEXP,
	VERSION_IN_PATH_REGEX,
	NO_V_VERSION_IN_PATH_REGEX,
	SHORT_VERSION_REGEX
} from 'constants/version-path'

const LEADING_TRAILING_SLASHES_REGEXP = /^\/+|\/+$/g

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
	const pathSegments = asPath
		// `path` should never contain the scheme/domain/port, but just in case...
		.replace(/^https?:\/\/[a-z-:0-9.]+/i, '')
		// Strip leading slash
		.replace(/^\//i, '')
		.split('/')

	// Calculate how many segments the basePath contains so this can be handled dynamically
	// e.g., "vault/docs" = 2, "terraform/plugin/framework" = 3
	const basePathSegmentCount = basePath.split('/').length

	let rest = asPath
		.replace(basePath, '') // strip basePath
		.replace(LEADING_TRAILING_SLASHES_REGEXP, '') // strip leading and trailing slashes

	// Previous assumption was that version was to be expected at index 2 or 3, but the assumption broke
	// Now, version is expected to appear immediately after the basePath segments
	// Start searching from the index after all basePath segments
	const startSearchIndex = basePathSegmentCount 
	const indexOfVersion = pathSegments.slice(startSearchIndex).findIndex(
		(el) =>
			TFE_VERSION_IN_PATH_REGEXP.test(el) ||
			VERSION_IN_PATH_REGEX.test(el) ||
			NO_V_VERSION_IN_PATH_REGEX.test(el) ||
			SHORT_VERSION_REGEX.test(el)
	)

	// Convert relative index to absolute index in pathSegments array
	const absoluteVersionIndex = indexOfVersion >= 0 ? startSearchIndex + indexOfVersion : -1

	// Set cutoff to 1 position after where we start searching
	// This limits the blast radius to avoid matching versions in content slugs
	const VERSION_CUTOFF_INDEX = startSearchIndex + 1
	if (absoluteVersionIndex >= 0 && absoluteVersionIndex <= VERSION_CUTOFF_INDEX) {
		// Let's use the version cutoff index to limit the blast radius of this regex.
		// Anything beyond that in the URL will be ignored. That way versions in URL slugs
		// won't be accidentally matched and removed.
		// Example: /vault/docs/v1.17.x/upgrading/upgrade-to-1.17.x
		// We want to avoid the "upgrade-to-1.17.x" part being matched and removed.
		
		// Extract any segments between basePath and version (should typically be empty)
		const segmentsBetweenBaseAndVersion = pathSegments.slice(basePathSegmentCount, absoluteVersionIndex).map((el) => el
			.replace(TFE_VERSION_IN_PATH_REGEXP, '')
			.replace(VERSION_IN_PATH_REGEX, '')
			.replace(NO_V_VERSION_IN_PATH_REGEX, '')
			.replace(SHORT_VERSION_REGEX, '')
			.replace(LEADING_TRAILING_SLASHES_REGEXP, ''))

		// Extract segments after the version
		const segmentsAfterVersion = pathSegments.slice(absoluteVersionIndex + 1, pathSegments.length)
			// Replace the version in these segments with the target version
			.map((el) => (el).replace(NO_V_VERSION_IN_PATH_REGEX, version))

		rest = segmentsBetweenBaseAndVersion.concat(segmentsAfterVersion).filter(Boolean).join('/')
	}
	return '/' + basePath + '/' + version + (rest ? `/${rest}` : '')
}
