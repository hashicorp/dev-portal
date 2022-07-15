import { GetStaticPropsContext } from 'next'
import { LearnProductData, LearnProductSlug } from 'types/products'
import {
	getProductTutorialsViewProps,
	ProductTutorialsViewProps,
} from 'views/product-tutorials-view/server'
import ProductTutorialsView from 'views/product-tutorials-view'
import { cachedGetProductData } from 'views/tutorial-view/utils/get-product-data'

/**
 * Based on the array of beta product slugs,
 * generate each product tutorials route
 * i.e. /vault/tutorials
 */
function generateProductTutorialHomePaths() {
	return Array.from(
		__config.dev_dot.beta_product_slugs,
		(productSlug: LearnProductSlug) => ({
			params: { product: productSlug },
		})
	)
}

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ product: LearnProductSlug }>): Promise<{
	props: ProductTutorialsViewProps
}> {
	const productData = cachedGetProductData(params.product)
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
