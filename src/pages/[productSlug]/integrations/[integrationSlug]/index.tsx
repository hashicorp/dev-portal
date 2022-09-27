import { cachedGetProductData } from 'lib/get-product-data'
import {
	fetchIntegration,
	fetchIntegrationRelease,
} from 'lib/integrations-api-client'
import ProductIntegration from 'views/product-integration'

export async function getServerSideProps({ params }) {
	const integrationResponse = await fetchIntegration(
		params.productSlug,
		params.integrationSlug
	)

	// 404
	if (integrationResponse.meta.status_code != 200) {
		return {
			notFound: true,
		}
	}

	// Just fetching the most recent release for now
	const latestReleaseResponse = await fetchIntegrationRelease(
		params.productSlug,
		params.integrationSlug,
		integrationResponse.result.versions[
			integrationResponse.result.versions.length - 1
		]
	)
	return {
		props: {
			integration: integrationResponse.result,
			latestRelease: latestReleaseResponse.result,
			product: {
				...cachedGetProductData(params.productSlug),
			},
		},
	}
}

export default ProductIntegration
