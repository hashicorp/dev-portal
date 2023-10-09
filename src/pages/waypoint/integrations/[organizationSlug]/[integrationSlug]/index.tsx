/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPropsContext, GetStaticPathsResult } from 'next'
import { fetchAllProductIntegrations } from 'lib/integrations-api-client/integration'
import ProductIntegrationReadmeView from 'views/product-integration/readme-view'
import {
	getStaticProps as _getStaticProps,
	PathParams,
} from 'views/product-integration/readme-view/server'
import { Integration } from 'lib/integrations-api-client/integration'
import { ProductSlug } from 'types/products'

const PRODUCT_SLUG = __config.dev_dot.product_slugs_with_integrations.find(
	(slug: ProductSlug) => slug === 'waypoint'
) as ProductSlug

/**
 * Build an array of { productSlug, integrationSlug }
 * path parameters for all integrations.
 */
async function getStaticPaths(): Promise<GetStaticPathsResult<PathParams>> {
	const allIntegrations = await fetchAllProductIntegrations(PRODUCT_SLUG)
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

// simulate the dynamic route props used by other integrations paths
const getStaticProps = ({
	params,
}: GetStaticPropsContext<Omit<PathParams, 'productSlug'>>) => {
	return _getStaticProps({ params: { productSlug: PRODUCT_SLUG, ...params } })
}

export { getStaticPaths, getStaticProps }
export default ProductIntegrationReadmeView
