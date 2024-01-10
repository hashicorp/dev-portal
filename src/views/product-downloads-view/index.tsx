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
	ProductDownloadsViewContentProps,
	ProductDownloadsViewProps,
} from './types'
import {
	initializeBreadcrumbLinks,
	initializeVersionSwitcherOptions,
	prettyOs,
	sortPlatforms,
} from './helpers'
import { CurrentVersionProvider, useCurrentVersion } from './contexts'
import {
	DownloadsSection,
	FeaturedLearnCardsSection,
	PageHeader,
	ReleaseInformationSection,
	SidecarMarketingCard,
} from './components'
import s from './product-downloads-view.module.css'
import { ContentWithPermalink } from 'views/open-api-docs-view/components/content-with-permalink'
import Heading from 'components/heading'
import viewStyles from 'views/product-downloads-view/product-downloads-view.module.css'
import { MenuItem, SidebarProps } from 'components/sidebar/types'

/**
 * We need certain heading data, such as "Release information" & "Next Steps",
 * to be consistent between the headings themselves and the sidebar links
 * that point to them. This content could be lifted out to an authorable
 * interface at some point, if there's demand, but for now, we hard-code it.
 */
const SHARED_HEADINGS = {
	releaseInfo: {
		id: 'release-information',
		text: 'Release information',
	},
	featured: {
		id: 'next-steps',
		text: 'Next steps',
	},
}

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
		sidebarMenuItems = [],
		installName,
		additionalDownloadItems = [],
	} = pageContent
	const currentProduct = useCurrentProduct()
	const { currentVersion } = useCurrentVersion()
	const { pathname } = useRouter()
	const breadcrumbLinks = useMemo(
		() => initializeBreadcrumbLinks(currentProduct, isEnterpriseMode, pathname),
		[currentProduct, isEnterpriseMode, pathname]
	)

	// Group the selected release downloads by OS, for use in multiple places
	const selectedRelease = releases.versions[currentVersion]
	const downloadsByOS = useMemo(
		() => sortPlatforms(selectedRelease),
		[selectedRelease]
	)

	// Build download sidebar menu items, which vary with the selected release.
	const downloadMenuItems = Object.keys(downloadsByOS).map(
		(osKey: string): MenuItem => ({
			title: prettyOs(osKey),
			fullPath: `#${osKey}`,
		})
	)
	/**
	 * If we have featured content, we'll conditionally render that content,
	 * and add a heading to our sidebar as well.
	 */
	const hasCollectionCards = featuredCollectionCards?.length > 0
	const hasTutorialCards = featuredTutorialCards?.length > 0
	const hasFeaturedContent = hasCollectionCards || hasTutorialCards
	const featuredItems = hasFeaturedContent
		? [
				{
					title: SHARED_HEADINGS.featured.text,
					fullPath: `#${SHARED_HEADINGS.featured.id}`,
				},
		  ]
		: []

	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(currentProduct.name),
		generateProductLandingSidebarNavData(currentProduct),
		generateInstallViewNavItems(
			currentProduct,
			[
				{ divider: true },
				{ heading: 'Operating Systems' },
				...downloadMenuItems,
				...additionalDownloadItems, // Used for the Boundary Desktop client
				{ divider: true },
				{
					title: SHARED_HEADINGS.releaseInfo.text,
					fullPath: `#${SHARED_HEADINGS.releaseInfo.id}`,
				},
				...featuredItems,
				...sidebarMenuItems,
			],
			isEnterpriseMode
		),
	]

	return (
		<SidebarSidecarLayout
			sidebarNavDataLevels={sidebarNavDataLevels as SidebarProps[]}
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
				selectedRelease={selectedRelease}
				downloadsByOS={downloadsByOS}
			/>
			{merchandisingSlot?.position === 'middle' ? merchandisingSlot.slot : null}
			<ReleaseInformationSection
				releaseHeading={SHARED_HEADINGS.releaseInfo}
				selectedRelease={selectedRelease}
				isEnterpriseMode={isEnterpriseMode}
			/>
			{merchandisingSlot?.position === 'below' ? merchandisingSlot.slot : null}
			{hasFeaturedContent ? (
				<ContentWithPermalink
					className={s.nextStepsHeading}
					id={SHARED_HEADINGS.featured.id}
					ariaLabel={SHARED_HEADINGS.featured.text}
				>
					<Heading
						className={viewStyles.scrollHeading}
						level={2}
						id={SHARED_HEADINGS.featured.id}
						size={500}
						weight="bold"
					>
						{SHARED_HEADINGS.featured.text}
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
