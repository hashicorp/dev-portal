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
 * TODO: this could likely be merged with server.ts,
 * such that rather than separate server-versioned.ts and server.ts
 * for the same readme view getStaticProps, we have one getStaticProps
 * function that can handle both.
 *
 * getStaticPaths may differ in the future. For now, we could export
 * getStaticParams and getStaticParamsWithVersion, with the latter
 * being a straightforward thing to return an empty array.
 */

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
 * Note: currently returning an empty array. Latest versions of "readme"
 * views are rendered through the "canonical" latest URL:
 * - `/<productSlug>/integrations/<integrationSlug>`
 *
 * It doesn't seem feasible to statically render all versions, so we
 * statically render only the latest version at the URL above.
 * This happens through the page file `[integrationSlug]/index.tsx`.
 *
 * All non-latest versioned content is rendered with `fallback: "blocking"`.
 *
 * TODO: determine what rehydration strategy we might want.
 */
async function getStaticPaths(): Promise<GetStaticPathsResult<PathParams>> {
	return { paths: [], fallback: 'blocking' }
}

/**
 * Get static props for a versioned "readme" view of a
 * specific product integration.
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
