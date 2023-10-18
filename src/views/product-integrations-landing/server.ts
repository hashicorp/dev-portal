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
	const enabledProductSlugs =
		__config.dev_dot.product_slugs_with_integrations.filter(
			(slug) => slug !== 'waypoint'
		)
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

	const integrations: Integration[] = await fetchAllProductIntegrations(
		params.productSlug
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
			metadata: {
				title: `Integrations`,
				// description: `TODO`,
			},
			product,
			integrations,
			sidebarNavDataLevels,
			breadcrumbLinks,
		},
	}
}
