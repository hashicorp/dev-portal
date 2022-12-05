import { cachedGetProductData } from 'lib/get-product-data'
import {
	fetchIntegration,
	fetchIntegrationRelease,
} from 'lib/integrations-api-client'
import { withTiming } from 'lib/with-timing'
import ProductIntegration from 'views/product-integration'

const _getServerSideProps = async ({ params }) => {
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
		integrationResponse.result.versions[0]
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

const label = '[productSlug]/integrations/[integrationSlug]'
export const getServerSideProps = async (ctx) => {
	return withTiming(label, () => _getServerSideProps(ctx))
}
export default ProductIntegration
