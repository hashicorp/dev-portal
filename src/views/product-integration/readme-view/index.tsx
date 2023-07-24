/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { BreadcrumbLink } from 'components/breadcrumb-bar'
import DevDotContent from 'components/dev-dot-content'
import { TryHcpCalloutSidecarPlacement } from 'components/try-hcp-callout/components'
import VersionAlertBanner from 'components/version-alert-banner'
import ProductIntegrationLayout from 'layouts/product-integration-layout'
import useUserContentAnchorLinks from 'lib/hooks/use-user-content-anchor-links'
import { getIntegrationUrl } from 'lib/integrations'
import { Integration } from 'lib/integrations-api-client/integration'
import { Release } from 'lib/integrations-api-client/release'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ProductData } from 'types/products'
import { OutlineNavWithActive } from 'components/outline-nav/components'
// Types
import type { AnchorLinkItem } from 'lib/remark-plugins/remark-plugin-anchor-link-data'
// Styles
import s from './style.module.css'

export interface ProductIntegrationReadmeViewProps {
	anchorLinks: AnchorLinkItem[]
	product: ProductData
	integration: Integration
	activeRelease: Release
	serializedREADME: MDXRemoteSerializeResult
	breadcrumbLinks: BreadcrumbLink[]
}

export default function ProductIntegrationReadmeView({
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
			className={s.readmeView}
			breadcrumbLinks={breadcrumbLinks}
			currentProduct={product}
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
			<DevDotContent mdxRemoteProps={serializedREADME} />
		</ProductIntegrationLayout>
	)
}
