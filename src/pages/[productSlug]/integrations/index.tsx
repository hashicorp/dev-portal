import { ProductSlug } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import ProductIntegrationsLanding from 'views/product-integrations-landing'

export async function getStaticPaths() {
	const paths = ['vault', 'packer'].map((productSlug: ProductSlug) => ({
		params: { productSlug },
	}))
	console.log("paths", paths)
	return {
		paths,
		fallback: true,
	}
}

export async function getStaticProps({ params }) {
	const productData = cachedGetProductData(params.productSlug)
	console.log(
		'ProductData from getStaticProps',
		params.productSlug,
		productData
	)

	if (!productData) {
		return {
			notFound: true,
		}
	}

	return {
		props: {
			productSlug: params.productSlug,
			product: {
				...productData,
			},
		},
	}
}

export default ProductIntegrationsLanding
