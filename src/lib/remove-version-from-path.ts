/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	VERSION_IN_PATH_REGEX,
	TFE_VERSION_IN_PATH_REGEXP,
} from 'constants/version-path'

/**
 * Removes a version string from a path, and returns the new path.
 * Returns the original string if no version is present.
 */
export function removeVersionFromPath(path: string): string {
	const YEAR_AND_TFE_VERSION_IN_PATH_REGEXP = /\/[0-9]{4}\/v[0-9]{6}-\d+/i
	if (YEAR_AND_TFE_VERSION_IN_PATH_REGEXP.test(path)) {
		path = path.replace(YEAR_AND_TFE_VERSION_IN_PATH_REGEXP, '')
	}
	const pathSegments = path.split('/')

	const i = pathSegments.findIndex((el) => {
		return VERSION_IN_PATH_REGEX.test(el) || TFE_VERSION_IN_PATH_REGEXP.test(el)
	})

	if (i > -1) {
		return [...pathSegments.slice(0, i), ...pathSegments.slice(i + 1)].join('/')
	} else {
		return path
	}
}
