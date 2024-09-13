/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { LearnProductData, LearnProductSlug, ProductSlug } from 'types/products'
import {
	getCloudTutorialsViewProps,
	getProductTutorialsViewProps,
	ProductTutorialsViewProps,
} from 'views/product-tutorials-view/server'
import ProductTutorialsView from 'views/product-tutorials-view'
import { cachedGetProductData } from 'lib/get-product-data'
import { productSlugs } from 'lib/products'

/**
 * Based on the array of beta product slugs,
 * generate each product tutorials route
 * i.e. /vault/tutorials
 */
function generateProductTutorialHomePaths() {
	const paths = productSlugs.map((productSlug: ProductSlug) => ({
		params: { productSlug },
	}))
	return paths
}

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ productSlug: LearnProductSlug }>): Promise<
	GetStaticPropsResult<ProductTutorialsViewProps>
> {
	const productData = cachedGetProductData(params.productSlug)

	/**
	 * Note: `hcp` is a "product" in Dev Dot but not in Learn,
	 * so we have to treat it slightly differently.
	 */
	let props
	try {
		const props =
			productData.slug == 'hcp'
				? await getCloudTutorialsViewProps()
				: await getProductTutorialsViewProps(productData as LearnProductData)
	} catch (e) {
		if (e.toString() === 'Error: 404 Not Found') {
			return { notFound: true }
		} else {
			throw e
		}
	}

	return props
}

export async function getStaticPaths() {
	return {
		paths: generateProductTutorialHomePaths(),
		fallback: false,
	}
}

export default ProductTutorialsView
