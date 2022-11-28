import { cachedGetProductData } from 'lib/get-product-data'
import {
	fetchAllProductIntegrations,
	Integration,
} from 'lib/integrations-api-client'
import { ProductSlug } from 'types/products'
import ProductIntegrationsLanding from 'views/product-integrations-landing'

// The products that we are enabling for this Integrations POC
export const enabledProducts: Array<ProductSlug> = [
	'packer',
	'waypoint',
	'vault',
]

export async function getServerSideProps({ params }) {
	// 404 if we're not on an enabled page
	if (!enabledProducts.includes(params.productSlug)) {
		return {
			notFound: true,
		}
	}

	const integrations: Integration[] = await fetchAllProductIntegrations(
		params.productSlug
	)
	return {
		props: {
			integrations: integrations,
			product: {
				...cachedGetProductData(params.productSlug),
			},
		},
	}
}

export default ProductIntegrationsLanding
