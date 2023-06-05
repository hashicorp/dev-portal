/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { cachedGetProductData } from 'lib/get-product-data'
import { productSlugs } from 'lib/products'
import { ProductSlug, RootDocsPath } from 'types/products'

/**
 * Given a slug used to load content for a product, returns the ProductSlug
 * associated with it.
 */
const normalizeRemoteLoaderSlug = (remoteLoaderSlug: string) => {
	const normalizedSlug = productSlugs.find((productSlug: ProductSlug) => {
		if (remoteLoaderSlug === productSlug) {
			return true
		}

		const productData = cachedGetProductData(productSlug)
		return !!productData.rootDocsPaths.find((rootDocsPath: RootDocsPath) => {
			return remoteLoaderSlug === rootDocsPath.productSlugForLoader
		})
	})

	if (!normalizedSlug) {
		throw new Error(
			`Could not normalize invalid remoteLoaderSlug: "${remoteLoaderSlug}"`
		)
	}

	return normalizedSlug
}

export { normalizeRemoteLoaderSlug }
