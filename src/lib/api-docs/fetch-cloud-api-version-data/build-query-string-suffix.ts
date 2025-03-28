/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Given an object of params,
 * Return a fully formatted query string, including the leading `?`.
 *
 * If the incoming `params` object does not have meaningful values,
 * an empty string will be returned. Meaningful values are all values
 * other than `undefined` and `null`.
 */
function buildQueryStringSuffix(params: Record<string, any>): string {
	const queryParams = new URLSearchParams()
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) {
			continue
		}
		const stringValue = String(value)
		queryParams.append(key, stringValue)
	}
	const hasQueryParams = Array.from(queryParams).length > 0
	const queryString = hasQueryParams ? `?${queryParams.toString()}` : ''
	return queryString
}

export { buildQueryStringSuffix }
