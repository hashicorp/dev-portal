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
	integrationBreadcrumbLinks,
	integrationVersionBreadcrumbLinks,
} from 'lib/integrations'
import { getProductSlugsWithIntegrations } from 'lib/integrations/get-product-slugs-with-integrations'

/**
 * We expect the same static param types to be returned from getStaticPaths,
 * and provided to getStaticProps context.
 */
type PathParams = {
	productSlug: ProductSlug
	integrationSlug: string
	/**
	 * Note: the version string is passed for versioned "readme" views,
	 * but not for the latest "readme" views.
	 * - Latest URLs: `/<product>/integration/<integrationSlug>`
	 * - Versioned URLs: `/<product>/integration/<integrationSlug>`
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
 */
async function getStaticPaths(): Promise<GetStaticPathsResult<PathParams>> {
	// Get products slug where integrations is enabled
	const enabledProductSlugs = getProductSlugsWithIntegrations()
	// Fetch integrations for all products
	const allIntegrations = await fetchAllIntegrations(enabledProductSlugs)
	// Build a flat array of path parameters for each integration
	const paths = allIntegrations
		// We don't render pages for external_only integrations
		.filter((i: Integration) => !i.external_only)
		.map((i: Integration) => ({
			productSlug: i.product.slug,
			integrationSlug: i.slug,
		}))
		.flat()
		.map((params: PathParams) => ({ params }))

	// Return static paths
	return { paths, fallback: false }
}

/**
 * Get static props for the "readme" view of a specific product integration.
 */
async function getStaticProps({
	params: { productSlug, integrationSlug, integrationVersion },
}: GetStaticPropsContext<PathParams>): Promise<
	GetStaticPropsResult<
		ProductIntegrationReadmeViewProps & { metadata: HeadMetadataProps }
	>
> {
	// Pull out the Product Config
	// If the product is not enabled for integrations, return a 404 page
	const productData = cachedGetProductData(productSlug)
	if (!productData.integrationsConfig.enabled) {
		return {
			notFound: true,
		}
	}
	// Fetch the Integration
	const integrationResponse = await fetchIntegration(
		productSlug,
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
	const isLatest = !integrationVersion || integrationVersion === 'latest'
	const targetVersion = isLatest ? integration.versions[0] : integrationVersion
	const activeReleaseResponse = await fetchIntegrationRelease(
		productData.slug,
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
			serializedREADME: await serializeIntegrationMarkdown(
				activeRelease.readme
			),
		},
	}
}

export { getStaticPaths, getStaticProps, getStaticPathsWithVersion }
