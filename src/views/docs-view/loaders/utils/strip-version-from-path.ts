/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const REGEX = /^v[0-9]+\.[0-9]+\.(x|[0-9]+)$/i
const TFE_REGEX = /^v[0-9]{6}-[0-9]+$/i
const NO_V_REGEX = /^[0-9]+\.[0-9]+\.(x|[0-9]+)$/i

/**
 * Given an array of strings, returns a tuple of
 * - [0]: a version or 'latest'
 * - [1]: an array without the version
 * @param {string[]} pathParams
 * @returns {[string, string[]]} [version, strippedParams]
 */
export const stripVersionFromPathParams = (
	pathParams: string[] = []
): [string, string[]] => {
	const index = pathParams.findIndex((e) => REGEX.test(e) || TFE_REGEX.test(e) || NO_V_REGEX.test(e))
	let version = 'latest'
	let params = [...pathParams]

	// A "version" is expected to only exist at index (0)
	// in a list of Next.js params.
	// If it is elsewhere, it's likely that it should be left alone.

	if (index == 0) {
		version = pathParams[index]
		params = [...params.slice(0, index), ...params.slice(index + 1)]
		return [version, params]
	}

	return [version, params]
}
