import { GetStaticPropsContext } from 'next'
import { LearnProductData, LearnProductSlug, ProductSlug } from 'types/products'
import {
	getProductTutorialsViewProps,
	ProductTutorialsViewProps,
} from 'views/product-tutorials-view/server'
import ProductTutorialsView from 'views/product-tutorials-view'
import { cachedGetProductData } from 'lib/get-product-data'

/**
 * Based on the array of beta product slugs,
 * generate each product tutorials route
 * i.e. /vault/tutorials
 */
function generateProductTutorialHomePaths() {
	const paths = []

	__config.dev_dot.beta_product_slugs.forEach((productSlug: ProductSlug) => {
		if (productSlug !== 'hcp') {
			paths.push({
				params: { productSlug },
			})
		}
	})

	return paths
}

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ productSlug: LearnProductSlug }>): Promise<{
	props: ProductTutorialsViewProps
}> {
	const productData = cachedGetProductData(params.productSlug)
	const props = await getProductTutorialsViewProps(
		productData as LearnProductData
	)

	return props
}

export async function getStaticPaths() {
	return {
		paths: generateProductTutorialHomePaths(),
		fallback: false,
	}
}

export default ProductTutorialsView
