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
	Integration,
	fetchIntegration,
} from 'lib/integrations-api-client/integration'
import { fetchIntegrationRelease } from 'lib/integrations-api-client/release'
import serializeIntegrationMarkdown from 'lib/serialize-integration-markdown'
import { ProductIntegrationReadmeViewProps } from '.'
import {
	fetchAllIntegrations,
	getTargetVersion,
	integrationBreadcrumbLinks,
	integrationVersionBreadcrumbLinks,
} from 'lib/integrations'
import { getIsEnabledProductIntegrations } from 'lib/integrations/get-is-enabled-product-integrations'

/**
 * We expect the same static param types to be returned from getStaticPaths,
 * and provided to getStaticProps context.
 */
export type PathParams = {
	productSlug: ProductSlug
	integrationSlug: string
	organizationSlug: string
	/**
	 * Note: the version string is passed for versioned "readme" views,
	 * but not for the latest "readme" views.
	 * - Latest URLs: `/<product>/integrations/<orgSlug>/<integrationSlug>`
	 * - Versioned URLs: `/<product>/integrations/<orgSlug>/<integrationSlug>`
	 */
	integrationVersion?: string
}

/**
 * Build an array of { productSlug, integrationSlug, integrationVersion }
 * path parameters for all integrations across all enabled products.
 *
 * Note: currently returning an empty array. Latest versions of "readme"
 * views are rendered through the "canonical" latest URL:
 * - `/<productSlug>/integrations/<integrationSlug>`
 *
 * It doesn't seem feasible to statically render all versions, so we
 * statically render only the latest version at the URL above.
 * This happens through the page file `[integrationSlug]/index.tsx`.
 *
 * All non-latest versioned content is rendered with `fallback: "blocking"`.
 */
async function getStaticPathsWithVersion(): Promise<
	GetStaticPathsResult<PathParams>
> {
	return { paths: [], fallback: 'blocking' }
}

/**
 * Build an array of { productSlug, integrationSlug }
 * path parameters for all integrations across all enabled products.
 *
 * Builds paths dynamically for all products except waypoint.
 * See /pages/waypoint/integrations/... for more context
 */
async function getStaticPaths(): Promise<GetStaticPathsResult<PathParams>> {
	// Get products slug where integrations is enabled
	const enabledProductSlugs = __config.dev_dot.product_slugs_with_integrations
	// Fetch integrations for all products
	const allIntegrations = await fetchAllIntegrations(enabledProductSlugs)
	// Build a flat array of path parameters for each integration
	const paths = allIntegrations
		// We don't render pages for external_only integrations
		.filter((i: Integration) => !i.external_only)
		.map((i: Integration) => ({
			productSlug: i.product.slug,
			integrationSlug: i.slug,
			organizationSlug: i.organization.slug,
		}))
		.flat()
		.map((params: PathParams) => ({ params }))
	// Return static paths
	return { paths, fallback: 'blocking' }
}

/**
 * Get static props for the "readme" view of a specific product integration.
 */
async function getStaticProps({
	params: {
		productSlug,
		integrationSlug,
		organizationSlug,
		integrationVersion,
	},
}: GetStaticPropsContext<PathParams>): Promise<
	GetStaticPropsResult<
		ProductIntegrationReadmeViewProps & { metadata: HeadMetadataProps }
	>
> {
	// Pull out the Product Config
	// If the product is not enabled for integrations, return a 404 page
	const productData = cachedGetProductData(productSlug)
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

	const [targetVersion, isLatest] = getTargetVersion({
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
	// Title and breadcrumb links vary if we're on the latest version or not
	const metadataTitle = isLatest
		? `${integration.name} | Integrations`
		: `${integration.name} (v${activeRelease.version}) | Integrations`
	const breadcrumbLinks = isLatest
		? integrationBreadcrumbLinks(productData, integration, true)
		: integrationVersionBreadcrumbLinks(
				productData,
				integration,
				activeRelease,
				true
		  )

	/**
	 * Serialize the README, extracting anchor links as we do
	 */
	const { serializeResult: serializedREADME, anchorLinks } =
		await serializeIntegrationMarkdown(activeRelease.readme)

	// Return static props
	return {
		revalidate: __config.dev_dot.revalidate,
		props: {
			metadata: {
				title: metadataTitle,
				description: integration.description,
			},
			product: productData,
			integration,
			activeRelease,
			breadcrumbLinks,
			anchorLinks,
			serializedREADME,
		},
	}
}

export { getStaticPaths, getStaticProps, getStaticPathsWithVersion }
