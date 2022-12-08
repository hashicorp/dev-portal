import { cachedGetProductData } from 'lib/get-product-data'
import { IntegrationsAPI } from 'lib/integrations-api-client'
import { withTiming } from 'lib/with-timing'
import ProductIntegration from 'views/product-integration'

export const integrationsApiClient = new IntegrationsAPI({
	BASE: process.env.NEXT_PUBLIC_INTEGRATIONS_API_BASE_URL,
})

const _getServerSideProps = async ({ params }) => {
	const integrationResponse = await integrationsApiClient.integrations
		.fetchIntegration(params.productSlug, params.integrationSlug)
		.catch(
			(err) =>
				err.body as ReturnType<
					IntegrationsAPI['integrations']['fetchIntegration']
				>
		)

	// 404
	if (integrationResponse.meta.status_code != 200) {
		return {
			notFound: true,
		}
	}

	// Just fetching the most recent release for now
	const latestReleaseResponse = await integrationsApiClient.integrationReleases
		.fetchRelease(
			params.productSlug,
			params.integrationSlug,
			integrationResponse.result.versions[0]
		)
		.catch(
			(err) =>
				err.body as ReturnType<
					IntegrationsAPI['integrationReleases']['fetchRelease']
				>
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
