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
	IntegrationComponent,
	Flag,
	Tier,
} from 'lib/integrations-api-client/integration'
import { generateProductIntegrationLibrarySidebarNavData } from 'lib/integrations'
import { ViewProps } from 'views/product-integrations-landing'

/**
 * We expect the same static param types to be returned from getStaticPaths,
 * and provided to getStaticProps context.
 */
type StaticParams = { productSlug: ProductSlug }

// Returns logical sort ordering of a Tier
const getTierSortValue = (tier: Tier): number => {
	switch (tier) {
		case Tier.OFFICIAL:
			return 1
		case Tier.PARTNER:
			return 2
		case Tier.COMMUNITY:
		default:
			return 3
	}
}

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

	const integrations: Integration[] = await fetchAllProductIntegrations(
		params.productSlug
	)

	/**
	 * Get each facet's unique set of values.
	 */
	const componentsById: Record<
		IntegrationComponent['id'],
		IntegrationComponent
	> = {}
	const flagsById: Record<Flag['id'], Flag> = {}
	const tiersSet = new Set<Tier>()
	integrations.forEach((integration: Integration) => {
		integration.components.forEach((component: IntegrationComponent) => {
			if (!componentsById[component.id]) {
				componentsById[component.id] = component
			}
		})
		integration.flags.forEach((flag: Flag) => {
			if (!flagsById[flag.id]) {
				flagsById[flag.id] = flag
			}
		})
		tiersSet.add(integration.tier)
	})

	/**
	 * Create flat, sorted arrays of objects for each facet.
	 *
	 * @TODO is the `occurances` property needed on each `IntegrationComponent`?
	 */
	const allComponents = Object.values(componentsById).sort(
		(a: IntegrationComponent, b: IntegrationComponent) => {
			const aName = a.name.toLowerCase()
			const bName = b.name.toLowerCase()
			if (aName < bName) {
				return -1
			}
			if (aName > bName) {
				return 1
			}
			return 0
		}
	)
	const allFlags = Object.values(flagsById).sort((a: Flag, b: Flag) => {
		const aName = a.name.toLowerCase()
		const bName = b.name.toLowerCase()
		if (aName < bName) {
			return -1
		}
		if (aName > bName) {
			return 1
		}
		return 0
	})
	const allTiers = Array.from(tiersSet).sort((a: Tier, b: Tier) => {
		const aTierSortValue = getTierSortValue(a)
		const bTierSortValue = getTierSortValue(b)
		if (aTierSortValue < bTierSortValue) {
			return -1
		}
		if (aTierSortValue > bTierSortValue) {
			return 1
		}
		return 0
	})

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
			allComponents,
			allFlags,
			allTiers,
			breadcrumbLinks,
			integrations,
			metadata: {
				title: `Integrations`,
				// description: `TODO`,
			},
			product,
			sidebarNavDataLevels,
		},
	}
}
