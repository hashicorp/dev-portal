import { ProductSlug } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import {
	fetchProductIntegrations,
	Integration,
} from 'lib/integrations-api-client'
import ProductIntegrationsLanding from 'views/product-integrations-landing'
import { ApiResponse } from 'lib/integrations-api-client/standard-client'

// The products that we are enabling for this Integrations POC
export const enabledProducts: Array<ProductSlug> = ['packer', 'waypoint']

export async function getStaticPaths() {
	const paths = enabledProducts.map((productSlug: ProductSlug) => ({
		params: { productSlug },
	}))
	return {
		paths,
		fallback: false,
	}
}

export async function getStaticProps({ params }) {
	const integrationResult: ApiResponse<Integration[]> =
		await fetchProductIntegrations(params.productSlug)
	return {
		props: {
			integrations: integrationResult.result,
			product: {
				...cachedGetProductData(params.productSlug),
			},
		},
	}
}

export default ProductIntegrationsLanding
