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
 *
 * @TODO write a few test cases
 */
const normalizeRemoteLoaderSlug = (remoteLoaderSlug: string) => {
	return productSlugs.find((productSlug: ProductSlug) => {
		if (remoteLoaderSlug === productSlug) {
			return true
		}

		const productData = cachedGetProductData(productSlug)
		return !!productData.rootDocsPaths.find((rootDocsPath: RootDocsPath) => {
			return remoteLoaderSlug === rootDocsPath.productSlugForLoader
		})
	})
}

export { normalizeRemoteLoaderSlug }
