/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPropsContext, GetStaticPathsResult } from 'next'
import { fetchAllProductIntegrations } from 'lib/integrations-api-client/integration'
import { ProductIntegrationReadmeViewProps } from 'views/product-integration/readme-view'
import {
	getStaticProps as _getStaticProps,
	PathParams,
} from 'views/product-integration/readme-view/server'
import { Integration } from 'lib/integrations-api-client/integration'
import { ProductSlug } from 'types/products'
import DevDotContent from 'components/dev-dot-content'
import { TryHcpCalloutSidecarPlacement } from 'components/try-hcp-callout/components'
import VersionAlertBanner from 'components/version-alert-banner'
import ProductIntegrationLayout from 'layouts/product-integration-layout'
import useUserContentAnchorLinks from 'lib/hooks/use-user-content-anchor-links'
import { getIntegrationUrl } from 'lib/integrations'
import { OutlineNavWithActive } from 'components/outline-nav/components'
import type { AnchorLinkItem } from 'lib/remark-plugins/remark-plugin-anchor-link-data'
import s from './integration-readme.module.css'
import InlineAlert from 'components/inline-alert'

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

/**
 * Duplicated from /src/views/product-integration/readme-view/index.tsx
 * To add a custome inline alert to notice that archive status.
 *
 * Decided to duplicate instead of modifying the original view since this
 * page will likely be deleted at some point.
 */
function WaypointIntegrationReadmeView({
	product,
	integration,
	activeRelease,
	breadcrumbLinks,
	serializedREADME,
	anchorLinks,
}: ProductIntegrationReadmeViewProps) {
	// We expect user content here, so we need to handle `#user-content-` links
	useUserContentAnchorLinks()

	/**
	 * Grab the current version string from the activeRelease.
	 */
	const currentVersion = activeRelease.version
	const isLatestVersion = currentVersion === integration.versions[0]

	return (
		<ProductIntegrationLayout
			title={integration.name}
			breadcrumbLinks={breadcrumbLinks}
			currentProduct={product}
			className={s.readmeView}
			integration={integration}
			activeRelease={activeRelease}
			getVersionChangedURL={(version: string) => {
				const isLatest = version === integration.versions[0]
				return isLatest
					? getIntegrationUrl(integration)
					: getIntegrationUrl(integration, version)
			}}
			sidecarSlot={
				<div className={s.sidecarContents}>
					<OutlineNavWithActive
						items={anchorLinks.map(({ title, id }: AnchorLinkItem) => {
							return { title, url: `#${id}` }
						})}
					/>
					<TryHcpCalloutSidecarPlacement productSlug={product.slug} />
				</div>
			}
			alertBannerSlot={
				isLatestVersion ? null : (
					<VersionAlertBanner
						currentVersion={currentVersion}
						latestVersionUrl={getIntegrationUrl(integration)}
					/>
				)
			}
		>
			<InlineAlert
				title="Archive Notice"
				description="This integration relates to a legacy version of Waypoint and is no longer actively maintained."
				color="highlight"
				className={s.alert}
				ctaSlot={
					<a
						href="https://www.hashicorp.com/blog/a-new-vision-for-hcp-waypoint"
						target="_blank"
					>
						For more information, read this blog post
					</a>
				}
			/>
			<DevDotContent mdxRemoteProps={serializedREADME} />
		</ProductIntegrationLayout>
	)
}

export { getStaticPaths, getStaticProps }

export default WaypointIntegrationReadmeView
