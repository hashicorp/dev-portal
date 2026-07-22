/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { SearchContentTypes } from '../../../types'

/**
 * Given an optional product slug,
 *
 * Return an Algolia `filter` string that will filter for search objects
 * of any type (`docs`, `tutorial`, or `integration`) that match the
 * specified product slug.
 *
 * Note: intended for use with our unified search indices, which are
 * named `<env>_DEVDOT_omni` in Algolia.
 */
export function getAlgoliaFilters(
	resultType?: SearchContentTypes
): string {
	/**
	 * Type filter
	 */
	let typeFilter = ''
	if (resultType && resultType !== SearchContentTypes.GLOBAL) {
		typeFilter = `type:${resultType}`
	}

	/**
	 * Combine filters, results must match ALL filters at once.
	 */
	return [typeFilter]
		.filter((s) => s !== '')
		.map((s) => `(${s})`)
		.join(' AND ')
}
