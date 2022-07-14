import { LearnProductData } from 'types/products'
import {
	getProductTutorialsViewProps,
	ProductTutorialsViewProps,
} from 'views/product-tutorials-view/server'
import ProductTutorialsView from 'views/product-tutorials-view'
// product data
import nomadData from 'data/nomad.json'

export async function getStaticProps(): Promise<{
	props: ProductTutorialsViewProps
}> {
	const props = await getProductTutorialsViewProps(
		nomadData as LearnProductData
	)

	return props
}

export default ProductTutorialsView
