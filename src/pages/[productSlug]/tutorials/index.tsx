import { GetStaticPropsContext } from 'next'
import { LearnProductData, LearnProductSlug, ProductSlug } from 'types/products'
import {
	getCloudTutorialsViewProps,
	getProductTutorialsViewProps,
	ProductTutorialsViewProps,
} from 'views/product-tutorials-view/server'
import ProductTutorialsViewActual from 'views/product-tutorials-view'
import { cachedGetProductData } from 'lib/get-product-data'

/**
 * Note: this is a spiked approach to get HCP content rendering.
 * Perhaps we'd want a separate view component, as design on current
 * learn.hashicorp.com site for HCP vs other product landing pages
 * differs pretty significantly (for example, no sidebar).
 */
function ProductTutorialsView(props) {
	return (
		<>
			{/* <pre>
				<code>{JSON.stringify(props.metadata, null, 2)}</code>
			</pre>
			<pre>
				<code>{JSON.stringify(Object.keys(props), null, 2)}</code>
			</pre> */}
			<ProductTutorialsViewActual {...props} />
		</>
	)
}

/**
 * Based on the array of beta product slugs,
 * generate each product tutorials route
 * i.e. /vault/tutorials
 */
function generateProductTutorialHomePaths() {
	const paths = __config.dev_dot.beta_product_slugs.map(
		(productSlug: ProductSlug) => ({ params: { productSlug } })
	)
	return paths
}

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ productSlug: LearnProductSlug }>): Promise<{
	props: ProductTutorialsViewProps
}> {
	const productData = cachedGetProductData(params.productSlug)
	/**
	 * TODO: figure out approach to HCP. Dependent on design.
	 * For now, this is a spiked approach to get current content rendering.
	 * Likely makes sense to wait to finalize this until we have final designs.
	 */
	let props
	if (productData.slug == 'hcp') {
		props = await getCloudTutorialsViewProps()
	} else {
		props = await getProductTutorialsViewProps(productData as LearnProductData)
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
