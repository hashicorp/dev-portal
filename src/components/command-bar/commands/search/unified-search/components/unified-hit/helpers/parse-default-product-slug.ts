/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Helpers
import { normalizeSlugForDevDot } from 'lib/tutorials/normalize-product-like-slug'
import { isProductSlug } from 'lib/products'
// Types
import type { Hit } from 'instantsearch.js'
import type { ProductSlug } from 'types/products'
import { SearchContentTypes } from '../../../types'

/**
 * Determine the "default product slug" for a provided search object.
 *
 * Docs and integrations are always expected to have a single product,
 * and this will be used as their "default product slug".
 *
 * Tutorials may have many products, so we use the default collection
 * context for a tutorial to determine the "default product slug".
 *
 * Tutorials may also have no products (for WAF), in which
 * case we return `null`.
 */
export function parseDefaultProductSlug(hit: Hit): ProductSlug | null {
	let defaultProductSlug: ProductSlug
	if (hit.type === SearchContentTypes.TUTORIAL) {
		const normalizedSlug = normalizeSlugForDevDot(hit.defaultContext.section)
		defaultProductSlug = isProductSlug(normalizedSlug) ? normalizedSlug : null
	} else {
		const hasDefaultProduct =
			Array.isArray(hit.products) && hit.products.length > 0
		defaultProductSlug = hasDefaultProduct ? hit.products[0] : null
	}
	if (!isProductSlug(defaultProductSlug)) {
		defaultProductSlug = null
	}
	return defaultProductSlug
}
