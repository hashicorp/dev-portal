import { cachedGetProductData } from 'lib/get-product-data'
import {
	Integration,
	fetchIntegration,
} from 'lib/integrations-api-client/integration'
import { fetchIntegrationRelease } from 'lib/integrations-api-client/release'
import serializeIntegrationMarkdown from 'lib/serialize-integration-markdown'
import { ProductSlug } from 'types/products'
import { integrationVersionBreadcrumbLinks } from './integration-version-breadcrumb-links'
import { getProductSlugsWithIntegrations } from './get-product-slugs-with-integrations'
import {
	fetchAllIntegrationsForProducts,
	ProductSlugWithIntegrations,
} from './fetch-all-integrations-for-products'
import {
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next'
import { ProductIntegrationReadmeViewProps } from '.'
import { HeadMetadataProps } from 'components/head-metadata/types'
import { getLatestRedirect } from './get-latest-redirect'

/**
 * We expect the same static param types to be returned from getStaticPaths,
 * and provided to getStaticProps context.
 */
type PathParams = {
	productSlug: ProductSlug
	integrationSlug: string
	integrationVersion: string
}

/**
 * Build an array of { productSlug, integrationSlug, integrationVersion }
 * path parameters for all integrations across all enabled products.
 *
 * Note: currently returning all found versions as static paths.
 * Could instead return only `latest`, and enable fallbacks.
 * TODO: consider which versions should be statically rendered,
 * and determine confirm fallback strategy.
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
					.map((i: Integration) => {
						// TODO: return separate items for each version?
						// TODO: or maybe return no static paths for versioned pages?
						// (I think we could use the same getStaticProps for both cases)
						// const versions = i.versions.length > 0 ? i.versions : ["latest"]
						return {
							productSlug,
							integrationSlug: i.slug,
							integrationVersion: 'latest',
						}
					})
			)
		})
		.flat()
		.map((params: PathParams) => ({ params }))
	return { paths, fallback: 'blocking' }
}

/**
 * Get static props for a versioned "readme" view of specific product integration.
 */
async function getStaticProps({
	params,
}: GetStaticPropsContext<PathParams>): Promise<
	GetStaticPropsResult<
		ProductIntegrationReadmeViewProps & { metadata: HeadMetadataProps }
	>
> {
	// Destructure the params we'll want
	const { productSlug, integrationSlug, integrationVersion } = params
	console.log({ productSlug, integrationSlug, integrationVersion })
	// Build a latest version redirect, this is useful in several cases
	// If the version is `"latest"`, we should redirect
	if (integrationVersion === 'latest') {
		return getLatestRedirect({ productSlug, integrationSlug })
	}
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
	// 404 if we're unable to fetch the integration for any reason
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
	// If the integrationVersion param is equivalent to the latest version,
	// then redirect to the latest (non-versioned) URL
	const isEquivalentToLatest = integrationVersion === integration.versions[0]
	if (isEquivalentToLatest) {
		return getLatestRedirect({ productSlug, integrationSlug })
	}
	// Fetch the release specified by the integrationVersion param
	const activeReleaseResponse = await fetchIntegrationRelease(
		productData.slug,
		integrationSlug,
		integrationVersion
	)
	// We may be trying to access a version that doesn't exist, in which case, 404
	if (activeReleaseResponse.meta.status_code != 200) {
		console.warn('Could not fetch Release', activeReleaseResponse)
		return { notFound: true }
	}
	const activeRelease = activeReleaseResponse.result
	// Return static props
	return {
		props: {
			metadata: {
				title: `${integration.name} (v${activeRelease.version}) | Integrations`,
				description: integration.description,
			},
			product: productData,
			integration,
			activeRelease,
			breadcrumbLinks: integrationVersionBreadcrumbLinks(
				productData,
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

export { getStaticPaths, getStaticProps }
