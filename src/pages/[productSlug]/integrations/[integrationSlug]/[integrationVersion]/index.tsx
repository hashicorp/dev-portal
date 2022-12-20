import { ENABLED_INTEGRATION_PRODUCTS } from 'lib/enabled-integration-products'
import { cachedGetProductData } from 'lib/get-product-data'
import { fetchIntegration } from 'lib/integrations-api-client/integration'
import { fetchIntegrationRelease } from 'lib/integrations-api-client/release'
import serializeIntegrationMarkdown from 'lib/serialize-integration-markdown'
import { ProductSlug } from 'types/products'
import ProductIntegrationReadmeView from 'views/product-integration/readme-view'

interface PathParams {
	productSlug: ProductSlug
	integrationSlug: string
	integrationVersion: string
}

export async function getServerSideProps({
	params: { productSlug, integrationSlug, integrationVersion },
}: {
	params: PathParams
}) {
	// Pull out the Product Config
	const product = cachedGetProductData(productSlug)

	// 404 early if the product is not enabled for integrations
	if (!ENABLED_INTEGRATION_PRODUCTS.includes(product.slug)) {
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

	// Fetch the Latest Release
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
			product,
			integration,
			activeRelease,
			breadcrumbLinks: [
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
				},
				{
					title: activeRelease.version,
					url: `/${product.slug}/integrations/${integration.slug}/${activeRelease.version}`,
					isCurrentPage: true,
				},
			],
			serializedREADME: await serializeIntegrationMarkdown(
				activeRelease.readme
			),
		},
	}
}

export default ProductIntegrationReadmeView
