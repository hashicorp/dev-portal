/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	Collection,
	uuid,
	ProductOption,
	AllCollectionsProductOptions,
	ThemeOption,
} from 'lib/learn-client/types'
import { get, toError } from '../../index'

// /products/:identifier/collections
export const PRODUCT_COLLECTION_API_ROUTE = (
	identifier: ProductOption | uuid
) => `/products/${identifier}/collections`

/**
 * Returns all collections associated with a product.
 * Collections will be product associated if they have at least
 * one tutorial whose primary product (first in frontmatter array)
 * matches this product slug
 *
 * Optional query params will return collections
 * sorted according to the category sidebar sort (which automatically
 * includes filtering for theme
 */
export async function fetchAllCollectionsByProduct(
	product: AllCollectionsProductOptions,
	/**
	 * All `ProductOption` values except `sentinel` can be used as "theme" options.
	 * Theme is mainly used to add a product logo to various UI elements, and
	 * since Sentinel doesn't have a logo, it's not a valid theme option.
	 *
	 * Note: an alternative here might be to implement a `theme` option for
	 * Sentinel, and for now, set it to render a HashiCorp logo. This might
	 * be a more future-proof approach. This would require updates to `learn-api`:
	 * https://github.com/hashicorp/learn-api/blob/main/src/models/collection.ts#L17
	 */
	theme?: Exclude<ProductOption, 'sentinel'> | ThemeOption
): Promise<Collection[]> {
	const baseUrl = PRODUCT_COLLECTION_API_ROUTE(product.slug)
	let route = baseUrl

	if (product.sidebarSort) {
		const params = []
		params.push(['topLevelCategorySort', 'true'])
		if (theme) {
			params.push(['theme', theme])
		}
		route = baseUrl + `?${new URLSearchParams(params).toString()}`
	}

	const getProductCollectionsRes = await get(route)

	if (getProductCollectionsRes.ok) {
		const res = await getProductCollectionsRes.json()
		return res.result
	}

	const error = toError(getProductCollectionsRes)
	throw error
}
