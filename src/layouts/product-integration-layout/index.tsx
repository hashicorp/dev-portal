/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconGithub16 } from '@hashicorp/flight-icons/svg-react/github-16'
import HashiHead from '@hashicorp/react-head'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import ContentHeaderCard from 'components/content-header-card'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import SidebarSidecarLayout, {
	SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'
import { getIntegrationBadges } from 'lib/get-integration-badges'
import {
	generateProductIntegrationLibrarySidebarNavData,
	getIntegrationComponentUrl,
	getIntegrationUrl,
} from 'lib/integrations'
import { Integration } from 'lib/integrations-api-client/integration'
import { Release, ReleaseComponent } from 'lib/integrations-api-client/release'
import { ProductData } from 'types/products'
import s from './style.module.css'
import { lastUpdatedString, versionString } from './utils'

interface ProductIntegrationLayoutProps {
	title: string
	className?: string
	currentProduct: ProductData
	integration: Integration
	activeRelease: Release
	breadcrumbLinks: BreadcrumbLink[]
	// When the version is changed on a page using this layout,
	// this function should calculate the new URL that we
	// should be redirected to.
	getVersionChangedURL: (version: string) => string
	children: React.ReactNode
	sidecarSlot?: SidebarSidecarLayoutProps['sidecarSlot']
	alertBannerSlot?: SidebarSidecarLayoutProps['alertBannerSlot']
}

/**
 * This is a layout component that manages the SidebarSidecarLayout of an integration
 * page. This layout is coupled to the URL structure, and assumes this integration
 * page is rendering in the `/{product}/integrations/{integration}` context.
 */
export default function ProductIntegrationLayout({
	className,
	title,
	currentProduct,
	integration,
	activeRelease,
	breadcrumbLinks,
	getVersionChangedURL,
	children,
	sidecarSlot,
	alertBannerSlot,
}: ProductIntegrationLayoutProps) {
	// Determine if we're on the latest version, as that will slightly adjust the URLs
	const onLatestVersion = integration.versions[0] === activeRelease.version

	// Components that have READMEs or Variable Groups get a page
	const componentsWithPages: Array<ReleaseComponent> =
		activeRelease.components.filter((rc: ReleaseComponent) => {
			return rc.readme || rc.variable_groups.length
		})

	// Calculate the Sidebar
	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(currentProduct.name),
		generateProductLandingSidebarNavData(currentProduct),
		generateProductIntegrationLibrarySidebarNavData(currentProduct),
		{
			backToLinkProps: {
				text: `${currentProduct.name} Integrations`,
				href: `/${currentProduct.slug}/integrations`,
			},
			levelButtonProps: {
				levelUpButtonText: `${currentProduct.name} Integrations`,
				levelDownButtonText: 'Previous',
			},
			showFilterInput: false,
			title: integration.name,
			menuItems: [
				{
					title: 'Overview',
					fullPath: onLatestVersion
						? getIntegrationUrl(integration)
						: getIntegrationUrl(integration, activeRelease.version),
				},
				componentsWithPages.length
					? {
							title: 'Components',
							isOpen: true,
							routes: componentsWithPages.map((rc: ReleaseComponent) => {
								return {
									title: rc.component.name,
									fullPath: onLatestVersion
										? getIntegrationComponentUrl(integration, rc)
										: getIntegrationComponentUrl(
												integration,
												rc,
												activeRelease.version
										  ),
								}
							}),
					  }
					: undefined,
			],
		},
	]

	return (
		<SidebarSidecarLayout
			// TODO: see if we can fix the navDataLevels type
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			sidebarNavDataLevels={sidebarNavDataLevels}
			breadcrumbLinks={breadcrumbLinks}
			sidecarSlot={sidecarSlot}
			alertBannerSlot={alertBannerSlot}
		>
			{!onLatestVersion && (
				<HashiHead>
					<meta name="robots" content="noindex, nofollow" />
				</HashiHead>
			)}

			<ContentHeaderCard
				className={s.header}
				icon={currentProduct.slug !== 'sentinel' ? currentProduct.slug : null}
				title={integration.name}
				attribution={`@${integration.organization.slug}`}
				description={integration.description}
				note={lastUpdatedString(integration.updated_at)}
				badges={getIntegrationBadges(integration, true)}
				dropdown={
					integration.versions.length > 1
						? {
								text: versionString(
									activeRelease.version,
									integration.versions
								),
								items: integration.versions
									.filter((e: string) => e !== activeRelease.version)
									.map((version: string) => {
										return {
											text: versionString(version, integration.versions),
											href: getVersionChangedURL(version),
										}
									}),
						  }
						: undefined
				}
				links={[
					{
						text: 'GitHub',
						href: integration.subdirectory
							? `${integration.repo_url}/tree/main${integration.subdirectory}`
							: integration.repo_url,
						icon: <IconGithub16 />,
					},
				]}
			/>

			<h1>{title}</h1>
			<div className={className}>{children}</div>
		</SidebarSidecarLayout>
	)
}
