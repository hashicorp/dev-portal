import nomadData from 'data/nomad.json'
import ProductLandingView from 'views/product-landing'
import { generateStaticProps } from 'views/product-landing/server'
import { ProductData } from 'types/products'

export async function getStaticProps() {
	const contentJsonFile = 'src/data/nomad-landing.json'
	const product = nomadData as ProductData

	return {
		props: await generateStaticProps({ product, contentJsonFile }),
		revalidate: 10,
	}
}

export default ProductLandingView
