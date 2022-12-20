import { ENABLED_INTEGRATION_PRODUCTS } from 'lib/enabled-integration-products'
import { cachedGetProductData } from 'lib/get-product-data'
import { fetchIntegration } from 'lib/integrations-api-client/integration'
import { fetchIntegrationRelease } from 'lib/integrations-api-client/release'
import { ProductSlug } from 'types/products'
import ProductIntegrationNested from 'views/product-integration-nested'

interface PathParams {
	productSlug: ProductSlug
	integrationSlug: string
}

export async function getServerSideProps({
	params: { productSlug, integrationSlug },
}: {
	params: PathParams
}) {
	// 404 if we're not on an enabled page
	if (!ENABLED_INTEGRATION_PRODUCTS.includes(productSlug)) {
		return {
			notFound: true,
		}
	}

	// ===== Fetch Integration
	const integrationResponse = await fetchIntegration(
		productSlug,
		integrationSlug
	)
	if (integrationResponse.meta.status_code != 200) {
		console.warn('Could not fetch integration', integrationResponse)
		return { notFound: true }
	}
	const integration = integrationResponse.result

	// ==== Fetch Active Release
	const activeReleaseResponse = await fetchIntegrationRelease(
		productSlug,
		integrationSlug,
		integrationResponse.result.versions[0] // TODO
	)
	if (activeReleaseResponse.meta.status_code != 200) {
		console.warn(
			'Could not fetch release for version',
			// version, TODO
			activeReleaseResponse
		)
		return { notFound: true }
	}

	const activeRelease = activeReleaseResponse.result

	return {
		props: {
			product: {
				...cachedGetProductData(productSlug),
			},
			integration,
			activeRelease,
		},
	}
}

export default ProductIntegrationNested
