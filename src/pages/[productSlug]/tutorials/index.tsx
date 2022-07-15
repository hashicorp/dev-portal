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
	return __config.dev_dot.beta_product_slugs.map(
		(productSlug: LearnProductSlug) => ({
			params: { productSlug },
		})
	)
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
