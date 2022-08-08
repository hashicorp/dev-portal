import { ProductSlug } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import ProductIntegrationsLanding from 'views/product-integrations-landing'

export async function getStaticPaths() {
	const paths = ['vault', 'packer'].map((productSlug: ProductSlug) => ({
		params: { productSlug },
	}))
	return {
		paths,
		fallback: true,
	}
}

export async function getStaticProps({ params }) {
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
