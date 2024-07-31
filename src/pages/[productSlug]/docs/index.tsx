/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'
import { getStaticProps } from 'views/product-root-docs-path-landing/server'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { activeProductSlugs } from 'lib/products'

/**
 * Generates the paths for all /:productSlug/docs routes.
 */
const getStaticPaths = async () => {
	const paths = activeProductSlugs.map((productSlug: ProductSlug) => ({
		params: { productSlug },
	}))

	paths.push({
		params: { productSlug: 'well-architected-framework' },
	})

	return {
		paths,
		fallback: false,
	}
}

export { getStaticPaths, getStaticProps }
export default ProductRootDocsPathLanding
