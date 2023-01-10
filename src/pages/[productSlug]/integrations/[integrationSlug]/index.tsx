import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { cachedGetProductData } from 'lib/get-product-data'
import {
	Integration,
	fetchIntegration,
} from 'lib/integrations-api-client/integration'
import { fetchIntegrationRelease } from 'lib/integrations-api-client/release'
import serializeIntegrationMarkdown from 'lib/serialize-integration-markdown'
import { withTiming } from 'lib/with-timing'
import { ProductData, ProductSlug } from 'types/products'
import ProductIntegrationReadmeView from 'views/product-integration/readme-view'

interface PathParams {
	productSlug: ProductSlug
	integrationSlug: string
}

async function _getServerSideProps({
	params: { productSlug, integrationSlug },
}: {
	params: PathParams
}) {
	// Pull out the Product Config
	const product = cachedGetProductData(productSlug)

	// 404 early if the product is not enabled for integrations
	if (!product.integrationsConfig.enabled) {
		return {
			notFound: true,
		}
	}

	// Fetch the Integration
	const integrationResponse = await fetchIntegration(
		product.slug,
		integrationSlug
	)
	if (integrationResponse.meta.status_code != 200) {
		console.warn('Could not fetch Integration', integrationResponse)
		return { notFound: true }
	}
	const integration = integrationResponse.result

	// If the integration is external only, we shouldn't render this page
	if (integration.external_only) {
		return {
			notFound: true,
		}
	}

	// Fetch the Latest Release
	const activeReleaseResponse = await fetchIntegrationRelease(
		product.slug,
		integrationSlug,
		integrationResponse.result.versions[0] // Always the latest release
	)
	if (activeReleaseResponse.meta.status_code != 200) {
		console.warn('Could not fetch Release', activeReleaseResponse)
		return { notFound: true }
	}
	const activeRelease = activeReleaseResponse.result

	return {
		props: {
			metadata: {
				title: `${integration.name} | Integrations`,
				description: integration.description,
			},
			product,
			integration,
			activeRelease,
			breadcrumbLinks: integrationBreadcrumbLinks(product, integration, true),
			serializedREADME: await serializeIntegrationMarkdown(
				activeRelease.readme
			),
		},
	}
}

export function integrationBreadcrumbLinks(
	product: ProductData,
	integration: Integration,
	finalBreadcrumbSegments: boolean
): Array<BreadcrumbLink> {
	return [
		{
			title: 'Developer',
			url: '/',
		},
		{
			title: product.name,
			url: `/${product.slug}`,
		},
		{
			title: 'Integrations',
			url: `/${product.slug}/integrations`,
		},
		{
			title: integration.name,
			url: `/${product.slug}/integrations/${integration.slug}`,
			isCurrentPage: finalBreadcrumbSegments,
		},
	]
}

const label = '[productSlug]/integrations/[integrationSlug]'
export const getServerSideProps = async (ctx) => {
	return withTiming(label, () => _getServerSideProps(ctx))
}
export default ProductIntegrationReadmeView
