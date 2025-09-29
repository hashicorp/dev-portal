/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	TFE_VERSION_IN_PATH_REGEXP,
	VERSION_IN_PATH_REGEX,
	NO_V_VERSION_IN_PATH_REGEX,
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

	let rest = asPath
		.replace(basePath, '') // strip basePath
		.replace(LEADING_TRAILING_SLASHES_REGEXP, '') // strip leading and trailing slashes

	// version is only expected to be at index 2, or 3 in the case of TF-Plugins
	// - "product" will be at index 0, and "basePath" at index 1
	const indexOfVersion = pathSegments.findIndex(
		(el) =>
			TFE_VERSION_IN_PATH_REGEXP.test(el) ||
			VERSION_IN_PATH_REGEX.test(el) ||
			NO_V_VERSION_IN_PATH_REGEX.test(el)
	)

	const VERSION_CUTOFF_INDEX = 3
	if (indexOfVersion <= VERSION_CUTOFF_INDEX) {
		// Let's use the version cutoff index to limit the blast radius of this regex.
		// Anything beyond that in the URL will be ignored. That way versions in URL slugs
		// won't be accidentally matched and removed.
		// Example: /vault/docs/v1.17.x/upgrading/upgrade-to-1.17.x
		// We want to avoid the "upgrade-to-1.17.x" part being matched and removed.
		const firstHalf = pathSegments.slice(2, VERSION_CUTOFF_INDEX).map((el) => el
			.replace(TFE_VERSION_IN_PATH_REGEXP, '')
			.replace(VERSION_IN_PATH_REGEX, '')
			.replace(NO_V_VERSION_IN_PATH_REGEX, '')
			.replace(LEADING_TRAILING_SLASHES_REGEXP, ''))

		const lastHalf = pathSegments.slice(VERSION_CUTOFF_INDEX, pathSegments.length)
			// Replace the version in the last half with the target version
			.map((el) => (el).replace(NO_V_VERSION_IN_PATH_REGEX, version))

		rest = firstHalf.concat(lastHalf).filter(Boolean).join('/')
	}
	return '/' + basePath + '/' + version + (rest ? `/${rest}` : '')
}
