/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
	fetchAllIntegrations,
	getIntegrationComponentUrl,
	getLatestIntegrationVersion,
	getTargetVersion,
	integrationComponentBreadcrumbLinks,
} from 'lib/integrations'
import { fetchIntegration } from 'lib/integrations-api-client/integration'
import {
	ReleaseComponent,
	fetchIntegrationRelease,
} from 'lib/integrations-api-client/release'
import { getIsEnabledProductIntegrations } from 'lib/integrations/get-is-enabled-product-integrations'
import serializeIntegrationMarkdown from 'lib/serialize-integration-markdown'
import ProductIntegrationComponentView, {
	ProductIntegrationComponentViewProps,
} from 'views/product-integration/component-view'
import { getProcessedVariablesMarkdown } from './helpers/get-processed-variables-markdown'

/**
 * We expect the same static param types to be returned from getStaticPaths,
 * and provided to getStaticProps context.
 */
export type PathParams = {
	productSlug: ProductSlug
	integrationSlug: string
	integrationVersion: string
	organizationSlug: string
	componentType: string
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
	const enabledProductSlugs =
		__config.dev_dot.product_slugs_with_integrations.filter(
			(slug) => slug !== 'waypoint'
		) as Omit<ProductSlug, 'waypoint'>[]
	// Fetch integrations for all products
	const allIntegrations = await fetchAllIntegrations(enabledProductSlugs)

	// Build a flat array of path parameters for each component view
	// We statically render every component view for every integration,
	// but only for the latest version of each integration.
	const allPaths: Array<PathParams> = []
	for (let i = 0; i < allIntegrations.length; i++) {
		const currentIntegration = allIntegrations[i]

		// Compute the latest version, as this is the page that we
		// will statically build
		const latestVersion = getLatestIntegrationVersion(
			currentIntegration.versions
		)

		// If the integration is 'external_only' or does not have a latest
		// version, it should not build a page
		if (currentIntegration.external_only || latestVersion === null) {
			continue
		}

		// Fetch the latest release, as we are going to generate the
		// component pages from this set of components
		const latestRelease = await fetchIntegrationRelease(
			currentIntegration.product.slug,
			currentIntegration.organization.slug,
			currentIntegration.slug,
			latestVersion
		)

		// Add a Path for each ReleaseComponent
		latestRelease.result.components.forEach(
			(releaseComponent: ReleaseComponent) => {
				allPaths.push({
					productSlug: currentIntegration.product.slug,
					integrationSlug: currentIntegration.slug,
					integrationVersion: 'latest',
					organizationSlug: currentIntegration.organization.slug,
					componentType: releaseComponent.component.slug,
					componentSlug: releaseComponent.slug,
				})
			}
		)
	}

	return {
		paths: allPaths.map((params: PathParams) => ({ params })),
		fallback: 'blocking',
	}
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
		componentType,
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

	const latestVersion = getLatestIntegrationVersion(integration.versions)
	const [targetVersion] = getTargetVersion({
		versionSlug: integrationVersion,
		latestVersion,
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
			return rc.component.slug === componentType && rc.slug === componentSlug
		})
	if (!releaseComponent) {
		return { notFound: true }
	}

	// If the integration version is the latest version, redirect using `latest`
	if (integrationVersion === 'v' + latestVersion) {
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

	/**
	 * Serialize the README, extracting anchor links as we do
	 */
	const { serializeResult: serializedREADME, anchorLinks } =
		releaseComponent.readme
			? await serializeIntegrationMarkdown(releaseComponent.readme)
			: { serializeResult: undefined, anchorLinks: [] }

	return {
		revalidate: __config.dev_dot.revalidate,
		props: {
			metadata: {
				title: `${integration.name} ${releaseComponent.component.name}${titleVersion} | Integrations`,
			},
			product: productData,
			integration,
			activeRelease,
			component: releaseComponent,
			processedVariablesMarkdown,
			anchorLinks,
			serializedREADME,
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
