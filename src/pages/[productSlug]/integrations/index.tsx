import { cachedGetProductData } from 'lib/get-product-data'
import { IntegrationsAPI } from 'lib/integrations-api-client'
import { ProductSlug } from 'types/products'
import ProductIntegrationsLanding from 'views/product-integrations-landing'

export const integrationsApiClient = new IntegrationsAPI({
	BASE: process.env.NEXT_PUBLIC_INTEGRATIONS_API_BASE_URL,
})

// The products that we are enabling for this Integrations POC
export const enabledProducts: Array<ProductSlug> = ['waypoint', 'vault']

export async function getServerSideProps({ params }) {
	// 404 if we're not on an enabled page
	if (!enabledProducts.includes(params.productSlug)) {
		return {
			notFound: true,
		}
	}

	const { result } = await integrationsApiClient.integrations.fetchIntegrations(
		params.productSlug,
		'100'
	)

	return {
		props: {
			integrations: result,
			product: {
				...cachedGetProductData(params.productSlug),
			},
		},
	}
}

export default ProductIntegrationsLanding
