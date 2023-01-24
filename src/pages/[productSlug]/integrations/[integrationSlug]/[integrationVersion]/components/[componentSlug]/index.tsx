import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { cachedGetProductData } from 'lib/get-product-data'
import {
	Integration,
	fetchIntegration,
} from 'lib/integrations-api-client/integration'
import {
	Release,
	ReleaseComponent,
	fetchIntegrationRelease,
} from 'lib/integrations-api-client/release'
import serializeIntegrationMarkdown from 'lib/serialize-integration-markdown'
import { withTiming } from 'lib/with-timing'
import { ProductData, ProductSlug } from 'types/products'
import ProductIntegrationComponentView from 'views/product-integration/component-view'
import { integrationVersionBreadcrumbLinks } from 'views/product-integration/readme-view/integration-version-breadcrumb-links'

interface PathParams {
	productSlug: ProductSlug
	integrationSlug: string
	integrationVersion: string
	componentSlug: string
}

async function _getServerSideProps({
	params: { productSlug, integrationSlug, integrationVersion, componentSlug },
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

	// Fetch the Release
	const activeReleaseResponse = await fetchIntegrationRelease(
		product.slug,
		integrationSlug,
		integrationVersion === 'latest'
			? integration.versions[0]
			: integrationVersion
	)
	if (activeReleaseResponse.meta.status_code != 200) {
		console.warn('Could not fetch Release', activeReleaseResponse)
		return { notFound: true }
	}
	const activeRelease = activeReleaseResponse.result

	// Grab the specific release component
	const releaseComponent: ReleaseComponent = activeRelease.components
		.filter((rc: ReleaseComponent) => {
			// Only release components w/ either a README or variable groups get a page
			return rc.readme || rc.variable_groups.length
		})
		.find((rc: ReleaseComponent) => {
			return rc.component.slug === componentSlug
		})
	if (!releaseComponent) {
		return { notFound: true }
	}

	// If the integration version is the latest version, redirect using `latest`
	if (integrationVersion === integration.versions[0]) {
		return {
			redirect: {
				destination: `/${product.slug}/integrations/${integration.slug}/latest/components/${releaseComponent.component.slug}`,
				// Not permanent as a new release in the future will turn the
				// latest release into an older release which should render!
				permanent: false,
			},
		}
	}

	// Compute the string for the inclusion of the version in the title
	const titleVersion =
		activeRelease.version === integration.versions[0]
			? ''
			: ` (${activeRelease.version})`

	return {
		props: {
			metadata: {
				title: `${integration.name} ${releaseComponent.component.name}${titleVersion} | Integrations`,
			},
			product,
			integration,
			activeRelease,
			component: releaseComponent,
			serializedREADME: releaseComponent.readme
				? await serializeIntegrationMarkdown(releaseComponent.readme)
				: undefined,
			breadcrumbLinks: integrationComponentBreadcrumbLinks(
				product,
				integration,
				activeRelease,
				releaseComponent,
				true
			),
		},
	}
}

function integrationComponentBreadcrumbLinks(
	product: ProductData,
	integration: Integration,
	activeRelease: Release,
	releaseComponent: ReleaseComponent,
	finalBreadcrumbSegments: boolean
): Array<BreadcrumbLink> {
	const versionSlug =
		activeRelease.version === integration.versions[0]
			? 'latest'
			: activeRelease.version

	return [
		...integrationVersionBreadcrumbLinks(
			product,
			integration,
			activeRelease,
			false
		),
		{
			title: 'Components',
		},
		{
			title: releaseComponent.component.name,
			url: `/${product.slug}/integrations/${integration.slug}/${versionSlug}/components/${releaseComponent.component.slug}`,
			isCurrentPage: finalBreadcrumbSegments,
		},
	]
}

const label =
	'[productSlug]/integrations/[integrationSlug]/[integrationVersion]/components/[component]'
export const getServerSideProps = async (ctx) => {
	return withTiming(label, () => _getServerSideProps(ctx))
}
export default ProductIntegrationComponentView
