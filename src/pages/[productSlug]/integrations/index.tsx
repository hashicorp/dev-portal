import { ProductSlug } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import ProductIntegrationsLanding from 'views/product-integrations-landing'

export async function getStaticPaths() {
	const paths = ['vault', 'packer'].map((productSlug: ProductSlug) => ({
		params: { productSlug },
	}))
	console.log('getStaticPaths', paths)
	return {
		paths,
		fallback: false,
	}
}

export async function getStaticProps({ params }) {
	const productData = cachedGetProductData(params.productSlug)
	console.log('getStaticProps', params.productSlug, productData)
	return {
		props: {
			productSlug: params.productSlug,
			product: {
				...cachedGetProductData(params.productSlug),
			},
		},
	}
}

export default ProductIntegrationsLanding
