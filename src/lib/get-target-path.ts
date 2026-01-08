/**
 * Copyright IBM Corp. 2021, 2025
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

	// Find the FIRST version segment after the basePath
	// A version segment must match the pattern exactly, not just contain it as a substring
	// This prevents "upgrade-from-1.15.x" from being detected as a version
	// We also limit the search to segments close to the basePath to avoid matching
	// version-like content deep in the path (e.g., release note filenames)
	const startSearchIndex = basePathSegmentCount
	const VERSION_SEARCH_LIMIT = 2 // Only look in the first 2 segments after basePath
	const searchSegments = pathSegments.slice(startSearchIndex, startSearchIndex + VERSION_SEARCH_LIMIT)
	
	const indexOfVersion = searchSegments.findIndex((el) => {
		// Check if this segment matches a version pattern exactly (not as a substring)
		const tfeMatch = el.match(TFE_VERSION_IN_PATH_REGEXP)
		const versionMatch = el.match(VERSION_IN_PATH_REGEX)
		const noVMatch = el.match(NO_V_VERSION_IN_PATH_REGEX)
		const shortMatch = el.match(SHORT_VERSION_REGEX)
		
		// A version segment must match the entire segment, not just part of it
		return (
			(tfeMatch && el === tfeMatch[0]) ||
			(versionMatch && el === versionMatch[0]) ||
			(noVMatch && el === noVMatch[0]) ||
			(shortMatch && el === shortMatch[0])
		)
	})

	// Convert relative index to absolute index in pathSegments array
	const absoluteVersionIndex = indexOfVersion >= 0 ? startSearchIndex + indexOfVersion : -1

	if (absoluteVersionIndex >= 0) {
		// Found a version in the path - extract segments before and after it
		
		// Extract any segments between basePath and version (should typically be empty)
		// Apply replacements to strip out any version patterns from these segments
		const segmentsBetweenBaseAndVersion = pathSegments.slice(basePathSegmentCount, absoluteVersionIndex).map((el) => el
			.replace(TFE_VERSION_IN_PATH_REGEXP, '')
			.replace(VERSION_IN_PATH_REGEX, '')
			.replace(NO_V_VERSION_IN_PATH_REGEX, '')
			.replace(SHORT_VERSION_REGEX, '')
			.replace(LEADING_TRAILING_SLASHES_REGEXP, ''))

		// Extract segments after the version - these are content paths and should not be modified
		const segmentsAfterVersion = pathSegments.slice(absoluteVersionIndex + 1, pathSegments.length)

		rest = segmentsBetweenBaseAndVersion.concat(segmentsAfterVersion).filter(Boolean).join('/')
	}
	// If no version found, rest already contains the full content path
	
	return '/' + basePath + '/' + version + (rest ? `/${rest}` : '')
}
