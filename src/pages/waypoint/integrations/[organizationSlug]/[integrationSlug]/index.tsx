/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPropsContext, GetStaticPathsResult } from 'next'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import { fetchAllProductIntegrations } from 'lib/integrations-api-client/integration'
import ProductIntegrationReadmeView from 'views/product-integration/readme-view'
import {
	getStaticProps as _getStaticProps,
	PathParams,
} from 'views/product-integration/readme-view/server'
import { Integration } from 'lib/integrations-api-client/integration'
import InlineAlert from 'components/inline-alert'
import StandaloneLink from 'components/standalone-link'
import { ProductSlug } from 'types/products'
import s from './integration-readme.module.css'

export const PRODUCT_SLUG =
	__config.dev_dot.product_slugs_with_integrations.find(
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

function WaypointIntegrationReadmeView(props) {
	return (
		<ProductIntegrationReadmeView
			{...props}
			preContentSlot={
				<InlineAlert
					title="Archive Notice"
					description="This integration relates to a legacy version of Waypoint and is no longer actively maintained."
					color="highlight"
					className={s.alert}
					ctaSlot={
						<StandaloneLink
							href="https://www.hashicorp.com/blog/a-new-vision-for-hcp-waypoint"
							opensInNewTab
							text="Read the blog"
							color="secondary"
							icon={<IconExternalLink16 />}
							iconPosition="trailing"
						/>
					}
				/>
			}
		/>
	)
}

export { getStaticPaths, getStaticProps }

export default WaypointIntegrationReadmeView
