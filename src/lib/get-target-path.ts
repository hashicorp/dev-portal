/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	TFE_VERSION_IN_PATH_REGEXP,
	VERSION_IN_PATH_REGEX,
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
	const GLOBAL_TFE_VERSION_IN_PATH_REGEXP = /v[0-9]{6}-\d+/gi
	const YEAR_REGEX = /[0-9]{4}/g
	const versionYear = version.match(/[0-9]{4}/)

	// If the path has two versions, e.g. /terraform/enterprise/v202312-1/releases/2023/v202312-1, replace the versions and year to match the target version
	asPath = asPath
		.replaceAll(GLOBAL_TFE_VERSION_IN_PATH_REGEXP, version)
		.replaceAll(YEAR_REGEX, String(versionYear))
	// if it ends with 'releases' and no preceding version, add year and version
	if (/\/[a-z]+[A-Z]+\/releases$/i.test(asPath)) {
		asPath = `${asPath}/${versionYear}/${version}`
	}
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
			TFE_VERSION_IN_PATH_REGEXP.test(el) || VERSION_IN_PATH_REGEX.test(el)
	)

	// if a version is in an expected position, strip it so we can replace it
	if (indexOfVersion <= 3) {
		rest = rest
			.replace(TFE_VERSION_IN_PATH_REGEXP, '')
			.replace(VERSION_IN_PATH_REGEX, '')
			.replace(LEADING_TRAILING_SLASHES_REGEXP, '')
	}

	return '/' + basePath + '/' + version + (rest ? `/${rest}` : '')
}
