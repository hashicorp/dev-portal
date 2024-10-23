/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'
import { getStaticProps } from 'views/product-root-docs-path-landing/server'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { productSlugs } from 'lib/products'

/**
 * Generates the paths for all /:productSlug/docs routes.
 */
const getStaticPaths = async () => {
	const paths = productSlugs
		.filter((productSlug: ProductSlug) => {
			// Exclude Sentinel, we want to load the MDX-based landing page
			const isSentinel = productSlug === 'sentinel'
			return !isSentinel
		})
		.map((productSlug: ProductSlug) => ({
			params: { productSlug },
		}))

	return {
		paths,
		fallback: false,
	}
}

export { getStaticPaths, getStaticProps }
export default ProductRootDocsPathLanding
