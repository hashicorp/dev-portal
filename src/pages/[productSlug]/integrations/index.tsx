import { ENABLED_INTEGRATION_PRODUCTS } from 'lib/enabled-integration-products'
import { cachedGetProductData } from 'lib/get-product-data'
import {
	fetchAllProductIntegrations,
	Integration,
} from 'lib/integrations-api-client/integration'
import ProductIntegrationsLanding from 'views/product-integrations-landing'

export async function getServerSideProps({ params }) {
	// 404 if we're not on an enabled page
	if (!ENABLED_INTEGRATION_PRODUCTS.includes(params.productSlug)) {
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
