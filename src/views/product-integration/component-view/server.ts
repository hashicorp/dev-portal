// Third-party imports
import {
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next'

// Global imports
import { HeadMetadataProps } from 'components/head-metadata/types'
import { cachedGetProductData } from 'lib/get-product-data'
import { ProductSlug } from 'types/products'

// Integrations-related imports
import {
	Integration,
	fetchIntegration,
	IntegrationComponent,
} from 'lib/integrations-api-client/integration'
import {
	ReleaseComponent,
	fetchIntegrationRelease,
} from 'lib/integrations-api-client/release'
import serializeIntegrationMarkdown from 'lib/serialize-integration-markdown'
import ProductIntegrationComponentView, {
	ProductIntegrationComponentViewProps,
} from 'views/product-integration/component-view'
import {
	fetchAllIntegrations,
	getIntegrationComponentUrl,
	getTargetVersion,
	integrationComponentBreadcrumbLinks,
} from 'lib/integrations'
import { getProcessedVariablesMarkdown } from './helpers/get-processed-variables-markdown'
import { getIsEnabledProductIntegrations } from 'lib/integrations/get-is-enabled-product-integrations'

/**
 * We expect the same static param types to be returned from getStaticPaths,
 * and provided to getStaticProps context.
 */
type PathParams = {
	productSlug: ProductSlug
	integrationSlug: string
	integrationVersion: string
	organizationSlug: string
	componentSlug: string
}

/**
 * Build an array of { productSlug, integrationSlug, integrationVersion }
 * path parameters for all integrations across all enabled products.
 *
 * Note: currently returning only the "latest" version URLs as static paths.
 * All other URLs will be loaded with `fallback: "blocking"`.
 */
async function getStaticPaths(): Promise<GetStaticPathsResult<PathParams>> {
	// Get products slug where integrations is enabled
	const enabledProductSlugs = __config.dev_dot.product_slugs_with_integrations
	// Fetch integrations for all products
	const allIntegrations = await fetchAllIntegrations(enabledProductSlugs)
	// Build a flat array of path parameters for each component view
	// We statically render every component view for every integration,
	// but only for the latest version of each integration.
	const paths = allIntegrations
		.filter((i: Integration) => !i.external_only)
		.map((i: Integration) => {
			return i.components.map((component: IntegrationComponent) => {
				return {
					productSlug: i.product.slug,
					integrationSlug: i.slug,
					integrationVersion: 'latest', // only statically render latest
					organizationSlug: i.organization.slug,
					componentSlug: component.slug,
				}
			})
		})
		.flat()
		.map((params: PathParams) => ({ params }))
	return { paths, fallback: 'blocking' }
}

/**
 * Get static props for the "component" view of a specific product integration.
 */
async function getStaticProps({
	params: {
		productSlug,
		integrationSlug,
		organizationSlug,
		integrationVersion,
		componentSlug,
	},
}: GetStaticPropsContext<PathParams>): Promise<
	GetStaticPropsResult<
		ProductIntegrationComponentViewProps & { metadata: HeadMetadataProps }
	>
> {
	// Pull out the Product Config
	const productData = cachedGetProductData(productSlug)
	// 404 early if the product is not enabled for integrations
	if (!getIsEnabledProductIntegrations(productSlug)) {
		return {
			notFound: true,
		}
	}

	const integrationResponse = await fetchIntegration(
		productSlug,
		organizationSlug,
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

	const [targetVersion] = getTargetVersion({
		versionSlug: integrationVersion,
		latestVersion: integration.versions[0],
	})

	// if the version slug is not prefix with 'v', return 404
	if (targetVersion === null) {
		return { notFound: true }
	}

	// Fetch the Release
	const activeReleaseResponse = await fetchIntegrationRelease(
		productData.slug,
		organizationSlug,
		integrationSlug,
		targetVersion
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
				destination: getIntegrationComponentUrl(
					integration,
					releaseComponent,
					'latest'
				),
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

	const processedVariablesMarkdown = await getProcessedVariablesMarkdown(
		releaseComponent
	)

	return {
		props: {
			metadata: {
				title: `${integration.name} ${releaseComponent.component.name}${titleVersion} | Integrations`,
			},
			product: productData,
			integration,
			activeRelease,
			component: releaseComponent,
			processedVariablesMarkdown,
			serializedREADME: releaseComponent.readme
				? await serializeIntegrationMarkdown(releaseComponent.readme)
				: undefined,
			breadcrumbLinks: integrationComponentBreadcrumbLinks(
				productData,
				integration,
				activeRelease,
				releaseComponent,
				true
			),
		},
	}
}

export { getStaticPaths, getStaticProps }
export default ProductIntegrationComponentView
