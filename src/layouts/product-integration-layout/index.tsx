/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconGithub16 } from '@hashicorp/flight-icons/svg-react/github-16'
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
import Head from 'next/head'

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

	// Map the components into groupings of their component type
	interface ComponentCategory {
		pluralName: string
		components: Array<ReleaseComponent>
	}
	const componentSidebarCategories: Map<string, ComponentCategory> = new Map<
		string,
		ComponentCategory
	>()
	for (let i = 0; i < componentsWithPages.length; i++) {
		const component = componentsWithPages[i]
		if (componentSidebarCategories[component.component.slug] === undefined) {
			componentSidebarCategories[component.component.slug] = {
				pluralName: component.component.plural_name,
				components: [],
			}
		}
		componentSidebarCategories[component.component.slug].components.push(
			component
		)
	}

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
			menuItems: [
				{
					title: integration.name,
					fullPath: onLatestVersion
						? getIntegrationUrl(integration)
						: getIntegrationUrl(integration, activeRelease.version),
					theme: currentProduct.slug,
					isActive: true,
				},
				...Object.keys(componentSidebarCategories)
					.map((key: string) => componentSidebarCategories[key])
					.map((category: ComponentCategory) => {
						return {
							title: category.pluralName,
							isOpen: true,
							routes: category.components.map((rc: ReleaseComponent) => {
								return {
									title: rc.name,
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
					}),
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
				<Head>
					<meta name="robots" content="noindex, nofollow" key="robots" />
				</Head>
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
							? `${
									integration.repo_url
							  }/tree/main${integration.subdirectory.replace(
									// Some Packer Plugins have an exception where we compile their
									// `docs` folder to `.web-docs` to be integrations-format-compliant.
									// The directory in which we want to redirect users here is actually
									// simply just `docs`, as that's where users would go to make edits.
									'.web-docs',
									'docs'
							  )}`
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
