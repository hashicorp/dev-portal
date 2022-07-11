import terraformData from 'data/terraform.json'
import { LearnProductData } from 'types/products'
import {
	getProductTutorialsViewProps,
	ProductTutorialsViewProps,
} from 'views/product-tutorials-view/server'
import ProductTutorialsView from 'views/product-tutorials-view'

export async function getStaticProps(): Promise<{
	props: ProductTutorialsViewProps
}> {
	const props = await getProductTutorialsViewProps(
		terraformData as LearnProductData
	)

	return props
}

export default ProductTutorialsView
