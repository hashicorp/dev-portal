import terraformData from 'data/terraform.json'
import ProductLandingView from 'views/product-landing'
import { generateStaticProps } from 'views/product-landing/server'
import { ProductData } from 'types/products'

export async function getStaticProps() {
	const product = terraformData as ProductData

	return {
		props: await generateStaticProps({ product }),
		revalidate: 10,
	}
}

export default ProductLandingView
