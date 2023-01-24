import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { HeadMetadataProps } from 'components/head-metadata/types'
import { cachedGetProductData } from 'lib/get-product-data'
import {
	Integration,
	fetchIntegration,
	fetchAllProductIntegrations,
} from 'lib/integrations-api-client/integration'
import { fetchIntegrationRelease } from 'lib/integrations-api-client/release'
import serializeIntegrationMarkdown from 'lib/serialize-integration-markdown'
import {
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next'
import { ProductData, ProductSlug } from 'types/products'
import { ProductIntegrationReadmeViewProps } from '.'
import { getProductSlugsWithIntegrations } from './get-product-slugs-with-integrations'

/**
 * We expect the same static param types to be returned from getStaticPaths,
 * and provided to getStaticProps context.
 */
type PathParams = {
	productSlug: ProductSlug
	integrationSlug: string
}

/**
 * An array of productSlugs, each with their full array of
 * corresponding integrations.
 */
type ProductSlugWithIntegrations = {
	productSlug: ProductSlug
	integrations: Integration[]
}

async function fetchAllIntegrationsForProducts(
	productSlugs: ProductSlug[]
): Promise<ProductSlugWithIntegrations[]> {
	return await Promise.all(
		productSlugs.map(async (productSlug: ProductSlug) => {
			return {
				productSlug,
				integrations: await fetchAllProductIntegrations(productSlug),
			}
		})
	)
}

/**
 * Build an array of { productSlug, integrationSlug } path parameters
 * for all integrations across all enabled products.
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
			return integrations.map((i: Integration) => ({
				productSlug,
				integrationSlug: i.slug,
			}))
		})
		.flat()
		.map((params: PathParams) => ({ params }))
	// Return static paths
	return { paths, fallback: false }
}

/**
 * Get static props for the "readme" view of specific product integration.
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

export { getStaticPaths, getStaticProps }
