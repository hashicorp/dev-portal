/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

// HashiCorp imports
import HashiHead from '@hashicorp/react-head'

// Global imports
import { useCurrentProduct } from 'contexts'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { TryHcpCalloutCompact } from 'components/try-hcp-callout/components/try-hcp-callout-compact'
import {
	generateInstallViewNavItems,
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'

// Local imports
import {
	ProductDownloadsViewContentProps,
	ProductDownloadsViewProps,
} from './types'
import {
	initializeBreadcrumbLinks,
	initializeVersionSwitcherOptions,
	generateSideMenuItemsByVersion,
} from './helpers'
import { CurrentVersionProvider, useCurrentVersion } from './contexts'
import {
	DownloadsSection,
	FeaturedLearnCardsSection,
	PageHeader,
	ReleaseInformationSection,
	SidecarMarketingCard,
} from './components'
import { MenuItem } from 'components/sidebar'
import s from './product-downloads-view.module.css'
import { ContentWithPermalink } from 'views/open-api-docs-view/components/content-with-permalink'
import Heading from 'components/heading'
import viewStyles from 'views/product-downloads-view/product-downloads-view.module.css'

/**
 * This component is used to make it possible to consume the `useCurrentVersion`
 * hook in this view. `ProductDownloadsView` renders `CurrentVersionProvider`
 * and passes this component as the child.
 */
const ProductDownloadsViewContent = ({
	isEnterpriseMode = false,
	merchandisingSlot,
	pageContent,
	releases,
	versionSwitcherOptions,
	packageManagers,
}: ProductDownloadsViewContentProps) => {
	const {
		featuredCollectionCards,
		featuredTutorialCards,
		sidecarMarketingCard,
		sidecarHcpCallout,
		sidebarMenuItems,
		installName,
	} = pageContent
	const currentProduct = useCurrentProduct()
	const { currentVersion } = useCurrentVersion()
	const { pathname } = useRouter()
	const dynamicSidebarMenuItems = generateSideMenuItemsByVersion(
		releases,
		currentVersion
	)
	const breadcrumbLinks = useMemo(
		() => initializeBreadcrumbLinks(currentProduct, isEnterpriseMode, pathname),
		[currentProduct, isEnterpriseMode, pathname]
	)
	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(currentProduct.name),
		generateProductLandingSidebarNavData(currentProduct),
		generateInstallViewNavItems(
			currentProduct,
			[...(dynamicSidebarMenuItems as MenuItem[]), ...sidebarMenuItems],
			isEnterpriseMode
		),
	]

	return (
		<SidebarSidecarLayout
			/**
			 * @TODO remove casting to `any`. Will require refactoring both
			 * `generateTopLevelSidebarNavData` and
			 * `generateInstallViewNavItems` to set up `menuItems` with the
			 * correct types. This will require chaning many files, so deferring for
			 * a follow-up PR since this is functional for the time being.
			 */
			sidebarNavDataLevels={sidebarNavDataLevels as any}
			breadcrumbLinks={breadcrumbLinks}
			sidecarSlot={
				<>
					<SidecarMarketingCard {...sidecarMarketingCard} />
					{sidecarHcpCallout ? (
						<div className={s.sidecarTryHcpCallout}>
							<TryHcpCalloutCompact
								productSlug={sidecarHcpCallout.productSlug}
								heading={sidecarHcpCallout.heading}
								description={sidecarHcpCallout.description}
								ctaText={sidecarHcpCallout.ctaText}
								ctaUrl={sidecarHcpCallout.ctaUrl}
							/>
						</div>
					) : null}
				</>
			}
		>
			{/**
			 * Legal has requested that we make the enterprise downloads page public
			 * but not search engine indexable
			 */}
			{isEnterpriseMode ? (
				<HashiHead>
					<meta name="robots" key="robots" content="noindex, nofollow" />
				</HashiHead>
			) : null}
			<PageHeader
				isEnterpriseMode={isEnterpriseMode}
				product={{
					name: installName || currentProduct.name,
					slug: currentProduct.slug,
				}}
				versionSwitcherOptions={versionSwitcherOptions}
			/>
			{merchandisingSlot?.position === 'above' ? merchandisingSlot.slot : null}
			<DownloadsSection
				packageManagers={packageManagers}
				selectedRelease={releases.versions[currentVersion]}
			/>
			{merchandisingSlot?.position === 'middle' ? merchandisingSlot.slot : null}
			<ReleaseInformationSection
				selectedRelease={releases.versions[currentVersion]}
				isEnterpriseMode={isEnterpriseMode}
			/>
			{merchandisingSlot?.position === 'below' ? merchandisingSlot.slot : null}
			{featuredCollectionCards?.length || featuredTutorialCards?.length ? (
				<ContentWithPermalink
					className={s.nextStepsHeading}
					id="next-steps"
					ariaLabel="Next steps"
				>
					<Heading
						className={viewStyles.scrollHeading}
						id="next-steps"
						level={2}
						size={500}
						weight="bold"
					>
						Next steps
					</Heading>
				</ContentWithPermalink>
			) : null}
			<FeaturedLearnCardsSection
				cards={featuredCollectionCards}
				cardType="collection"
			/>
			<FeaturedLearnCardsSection
				cards={featuredTutorialCards}
				cardType="tutorial"
			/>
		</SidebarSidecarLayout>
	)
}

/**
 * Handles rendering and initializing `CurrentVersionProvider`.
 */
const ProductDownloadsView = ({
	isEnterpriseMode = false,
	latestVersion,
	merchandisingSlot,
	pageContent,
	releases,
	sortedAndFilteredVersions,
	packageManagers,
}: ProductDownloadsViewProps): ReactElement => {
	const versionSwitcherOptions = useMemo(
		() =>
			initializeVersionSwitcherOptions({
				latestVersion,
				releaseVersions: sortedAndFilteredVersions,
			}),
		[latestVersion, sortedAndFilteredVersions]
	)

	return (
		<CurrentVersionProvider
			initialValue={latestVersion}
			latestVersion={latestVersion}
		>
			<ProductDownloadsViewContent
				isEnterpriseMode={isEnterpriseMode}
				merchandisingSlot={merchandisingSlot}
				pageContent={pageContent}
				releases={releases}
				versionSwitcherOptions={versionSwitcherOptions}
				packageManagers={packageManagers}
			/>
		</CurrentVersionProvider>
	)
}

export default ProductDownloadsView
