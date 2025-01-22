/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPaths } from 'next'
import { PRODUCT_DATA_MAP } from 'data/product-data-map'
import { getStaticProps } from 'views/playground/server'
import PlaygroundView from 'views/playground'

export default PlaygroundView

export const getStaticPaths: GetStaticPaths = async () => {
	// Only generate paths for products that have an instruqtId
	const paths = Object.values(PRODUCT_DATA_MAP)
		.filter((product) => product.instruqtId)
		.map((product) => ({
			params: { productSlug: product.slug },
		}))

	return {
		paths,
		fallback: false,
	}
}

export { getStaticProps }
