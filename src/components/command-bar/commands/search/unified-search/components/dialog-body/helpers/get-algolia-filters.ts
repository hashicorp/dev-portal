/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'
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
	productSlug?: ProductSlug,
	resultType?: SearchContentTypes
): string {
	/**
	 * Product filter
	 */
	let productFilter = ''
	if (productSlug) {
		productFilter = `products:${productSlug}`

		/**
		 * The edition:hcp only applies to `tutorials` records, which will
		 * never have products:hcp, but we can't apply complex filters
		 * via the Algolia filters API parameter to only apply the `edition`
		 * filter to tutorial records, so we use an OR filter instead.
		 * Ref: https://www.algolia.com/doc/api-reference/api-parameters/filters/
		 */
		if (productSlug === 'hcp') {
			productFilter += ` OR edition:${productSlug}`
		}
	}

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
	return [typeFilter, productFilter]
		.filter((s) => s !== '')
		.map((s) => `(${s})`)
		.join(' AND ')
}
