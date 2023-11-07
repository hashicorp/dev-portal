/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { ReactElement, useMemo } from 'react'
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
	ProductInstallViewContentProps,
	ProductInstallViewProps,
} from './types'
import {
	initializeBreadcrumbLinks,
	initializeVersionSwitcherOptions,
} from './helpers'
import { CurrentVersionProvider, useCurrentVersion } from './contexts'
import {
	DownloadsSection,
	FeaturedLearnCardsSection,
	OfficialReleasesSection,
	PageHeader,
	SidecarMarketingCard,
} from './components'
import s from './product-install-view.module.css'

/**
 * This component is used to make it possible to consume the `useCurrentVersion`
 * hook in this view. `ProductInstallView` renders `CurrentVersionProvider`
 * and passes this component as the child.
 */
const ProductInstallViewContent = ({
	isEnterpriseMode = false,
	merchandisingSlot,
	pageContent,
	releases,
	versionSwitcherOptions,
	packageManagers,
}: ProductInstallViewContentProps) => {
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

	const breadcrumbLinks = useMemo(
		() => initializeBreadcrumbLinks(currentProduct, isEnterpriseMode, pathname),
		[currentProduct, isEnterpriseMode, pathname]
	)
	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(currentProduct.name),
		generateProductLandingSidebarNavData(currentProduct),
		generateInstallViewNavItems(
			currentProduct,
			sidebarMenuItems,
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
				isEnterpriseMode={isEnterpriseMode}
				packageManagers={packageManagers}
				selectedRelease={releases.versions[currentVersion]}
			/>
			{merchandisingSlot?.position === 'below' ? merchandisingSlot.slot : null}
			<OfficialReleasesSection />
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
const ProductInstallView = ({
	isEnterpriseMode = false,
	latestVersion,
	merchandisingSlot,
	pageContent,
	releases,
	sortedAndFilteredVersions,
	packageManagers,
}: ProductInstallViewProps): ReactElement => {
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
			<ProductInstallViewContent
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

export default ProductInstallView
