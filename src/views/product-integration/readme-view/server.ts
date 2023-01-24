import { HeadMetadataProps } from 'components/head-metadata/types'
import { cachedGetProductData } from 'lib/get-product-data'
import {
	Integration,
	fetchIntegration,
} from 'lib/integrations-api-client/integration'
import { fetchIntegrationRelease } from 'lib/integrations-api-client/release'
import serializeIntegrationMarkdown from 'lib/serialize-integration-markdown'
import {
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next'
import { ProductSlug } from 'types/products'
import { ProductIntegrationReadmeViewProps } from '.'
import { getProductSlugsWithIntegrations } from './get-product-slugs-with-integrations'
import {
	fetchAllIntegrationsForProducts,
	ProductSlugWithIntegrations,
} from './fetch-all-integrations-for-products'
import { integrationBreadcrumbLinks } from './integration-breadcrumb-links'

/**
 * We expect the same static param types to be returned from getStaticPaths,
 * and provided to getStaticProps context.
 */
type PathParams = {
	productSlug: ProductSlug
	integrationSlug: string
}

/**
 * Build an array of { productSlug, integrationSlug }
 * path parameters for all integrations across all enabled products.
 */
async function getStaticPaths(): Promise<GetStaticPathsResult<PathParams>> {
	// Get products slug where integrations is enabled
	const enabledProductSlugs = getProductSlugsWithIntegrations()
	// Fetch integrations for all products
	const allIntegrations = await fetchAllIntegrationsForProducts(
		enabledProductSlugs
	)
	// Build a flat array of path parameters for each integration
	const paths = allIntegrations
		.map(({ productSlug, integrations }: ProductSlugWithIntegrations) => {
			return (
				integrations
					// We don't render pages for external_only integrations
					.filter((i: Integration) => !i.external_only)
					.map((i: Integration) => ({
						productSlug,
						integrationSlug: i.slug,
					}))
			)
		})
		.flat()
		.map((params: PathParams) => ({ params }))

	// Return static paths
	return { paths, fallback: false }
}

/**
 * Get static props for the "readme" view of a specific product integration.
 */
async function getStaticProps({
	params,
}: GetStaticPropsContext<PathParams>): Promise<
	GetStaticPropsResult<
		ProductIntegrationReadmeViewProps & { metadata: HeadMetadataProps }
	>
> {
	const { productSlug, integrationSlug } = params
	// Pull out the Product Config
	const productData = cachedGetProductData(productSlug)
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
	const activeReleaseResponse = await fetchIntegrationRelease(
		productData.slug,
		integrationSlug,
		integration.versions[0] // Always the latest release
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
			product: productData,
			integration,
			activeRelease,
			breadcrumbLinks: integrationBreadcrumbLinks(
				productData,
				integration,
				true
			),
			serializedREADME: await serializeIntegrationMarkdown(
				activeRelease.readme
			),
		},
	}
}

export { getStaticPaths, getStaticProps }
