import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { cachedGetProductData } from 'lib/get-product-data'
import {
	Integration,
	fetchIntegration,
} from 'lib/integrations-api-client/integration'
import {
	Release,
	fetchIntegrationRelease,
} from 'lib/integrations-api-client/release'
import serializeIntegrationMarkdown from 'lib/serialize-integration-markdown'
import { withTiming } from 'lib/with-timing'
import { ProductData, ProductSlug } from 'types/products'
import ProductIntegrationReadmeView from 'views/product-integration/readme-view'
import { integrationBreadcrumbLinks } from 'views/product-integration/readme-view/server'

interface PathParams {
	productSlug: ProductSlug
	integrationSlug: string
	integrationVersion: string
}

async function _getServerSideProps({
	params: { productSlug, integrationSlug, integrationVersion },
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

	// If the integration version is the latest version, redirect
	if (
		integrationVersion === 'latest' ||
		integrationVersion === integration.versions[0]
	) {
		return {
			redirect: {
				destination: `/${product.slug}/integrations/${integration.slug}`,
				// Not permanent as a new release in the future will turn the
				// latest release into an older release which should render!
				permanent: false,
			},
		}
	}

	// Fetch the Release
	const activeReleaseResponse = await fetchIntegrationRelease(
		product.slug,
		integrationSlug,
		integrationVersion
	)
	if (activeReleaseResponse.meta.status_code != 200) {
		console.warn('Could not fetch Release', activeReleaseResponse)
		return { notFound: true }
	}
	const activeRelease = activeReleaseResponse.result

	return {
		props: {
			metadata: {
				title: `${integration.name} (v${activeRelease.version}) | Integrations`,
				description: integration.description,
			},
			product,
			integration,
			activeRelease,
			breadcrumbLinks: integrationVersionBreadcrumbLinks(
				product,
				integration,
				activeRelease,
				true
			),
			serializedREADME: await serializeIntegrationMarkdown(
				activeRelease.readme
			),
		},
	}
}

export function integrationVersionBreadcrumbLinks(
	product: ProductData,
	integration: Integration,
	activeRelease: Release,
	finalBreadcrumbSegments: boolean
): Array<BreadcrumbLink> {
	const versionTitle =
		activeRelease.version === integration.versions[0]
			? 'Latest'
			: 'v' + activeRelease.version
	return [
		...integrationBreadcrumbLinks(product, integration, false),
		{
			title: versionTitle,
			url:
				activeRelease.version === integration.versions[0]
					? null
					: `/${product.slug}/integrations/${integration.slug}/${activeRelease.version}`,
			isCurrentPage: finalBreadcrumbSegments,
		},
	]
}

const label =
	'[productSlug]/integrations/[integrationSlug]/[integrationVersion]'
export const getServerSideProps = async (ctx) => {
	return withTiming(label, () => _getServerSideProps(ctx))
}
export default ProductIntegrationReadmeView
