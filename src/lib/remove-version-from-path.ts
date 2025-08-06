/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	VERSION_IN_PATH_REGEX,
	TFE_VERSION_IN_PATH_REGEXP,
	NO_V_VERSION_IN_PATH_REGEX,
} from 'constants/version-path'

/**
 * Removes a version string from a path, and returns the new path.
 * Returns the original string if no version is present.
 */
export function removeVersionFromPath(path: string): string {
	const pathSegments = path.split('/')

	const i = pathSegments.findIndex((el) => {
		return (
			VERSION_IN_PATH_REGEX.test(el) ||
			TFE_VERSION_IN_PATH_REGEXP.test(el) ||
			NO_V_VERSION_IN_PATH_REGEX.test(el)
		)
	})

	if (i > -1) {
		return [...pathSegments.slice(0, i), ...pathSegments.slice(i + 1)].join('/')
	} else {
		return path
	}
}
