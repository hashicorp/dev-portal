import { LearnProductData, ProductSlug } from 'types/products'
import {
	getProductTutorialsViewProps,
	ProductTutorialsViewProps,
} from 'views/product-tutorials-view/server'
import ProductTutorialsView from 'views/product-tutorials-view'

export default ProductTutorialsView

export async function getStaticProps({ params }): Promise<{
	props: ProductTutorialsViewProps
}> {
	const productData = await import(`data/${params.product}.json`)
	const props = await getProductTutorialsViewProps(
		productData as LearnProductData
	)

	return props
}

function generateProductTutorialHomePaths() {
	return Array.from(
		__config.dev_dot.beta_product_slugs,
		(productSlug: ProductSlug) => ({
			params: { product: productSlug },
		})
	)
}

export async function getStaticPaths() {
	return {
		paths: generateProductTutorialHomePaths(),
		fallback: false,
	}
}
