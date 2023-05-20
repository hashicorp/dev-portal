/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third party imports
import {
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next'
// Global imports
import { HeadMetadataProps } from 'components/head-metadata/types'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import { cachedGetProductData } from 'lib/get-product-data'
import { ProductSlug } from 'types/products'
// Integration-related imports
import {
	Integration,
	fetchAllProductIntegrations,
} from 'lib/integrations-api-client/integration'
import { generateProductIntegrationLibrarySidebarNavData } from 'lib/integrations'
import { ViewProps } from 'views/product-integrations-landing'

/**
 * We expect the same static param types to be returned from getStaticPaths,
 * and provided to getStaticProps context.
 */
type StaticParams = { productSlug: ProductSlug }

/**
 * Return a productSlug path for each product with integrations enabled.
 */
export async function getStaticPaths(): Promise<
	GetStaticPathsResult<StaticParams>
> {
	// Filter for products with integrations enabled
	const enabledProductSlugs = __config.dev_dot.product_slugs_with_integrations
	// Transform slugs into path params
	const paths = enabledProductSlugs.map((productSlug: ProductSlug) => ({
		params: { productSlug },
	}))
	return { paths, fallback: false }
}

/**
 * Given a productSlug parameter,
 * Return static props for an integrations landing view.
 */
export async function getStaticProps({
	params,
}: GetStaticPropsContext<StaticParams>): Promise<
	GetStaticPropsResult<ViewProps & { metadata: HeadMetadataProps }>
> {
	// Pull out the Product Config
	const product = cachedGetProductData(params.productSlug)

	/**
	 * Fetch, filter, and sort all integrations for the current product.
	 *
	 * Sort alphabetically. Right now this is our preferred way of sorting. In the
	 * event we want to add different sorting options in the future to this list,
	 * we'll need to support them client-side.
	 */
	const integrations: Integration[] = await fetchAllProductIntegrations(
		params.productSlug
	)
	const integrationsWithVersions = integrations.filter(
		(integration: Integration) => {
			return integration.versions.length > 0
		}
	)
	const sortedIntegrationsWithVersions = integrationsWithVersions.sort(
		(a: Integration, b: Integration): number => {
			const aName = a.name.toLowerCase()
			const bName = b.name.toLowerCase()
			if (aName < bName) {
				return -1
			} else if (aName > bName) {
				return 1
			} else {
				return 0
			}
		}
	)

	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(product.name),
		generateProductLandingSidebarNavData(product),
		generateProductIntegrationLibrarySidebarNavData(product),
	]

	const breadcrumbLinks = [
		{
			title: 'Developer',
			url: '/',
			isCurrentPage: false,
		},
		{
			title: product.name,
			url: `/${product.slug}`,
			isCurrentPage: false,
		},
		{
			title: 'Integrations',
			url: `/${product.slug}/integrations`,
			isCurrentPage: true,
		},
	]

	return {
		revalidate: __config.dev_dot.revalidate,
		props: {
			breadcrumbLinks,
			integrations: sortedIntegrationsWithVersions,
			metadata: {
				title: `Integrations`,
				// description: `TODO`,
			},
			product,
			sidebarNavDataLevels,
		},
	}
}
