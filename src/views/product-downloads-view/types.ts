/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import {
	ReleasesAPIResponse,
	GeneratedProps,
	ReleaseVersion,
} from 'lib/fetch-release-data'
import { CollectionCardPropsWithId } from 'components/collection-card'
import { MenuItem } from 'components/sidebar'
import { SidecarMarketingCardProps } from './components/sidecar-marketing-card'
import { TutorialCardPropsWithId } from 'components/tutorial-card'
import { VersionContextSwitcherProps } from 'components/version-context-switcher'
import { TryHcpCalloutCompactProps } from 'components/try-hcp-callout/types'

/**
 * Raw page content, as structured in .json files
 */
export type FeaturedLearnContent =
	| {
			collectionSlug: string
			tutorialSlug?: never
	  }
	| {
			collectionSlug?: never
			tutorialSlug: string
	  }

export interface PackageManager {
	label: string
	commands: string[]
	os: string
	installCodeHtml?: string
}

export interface RawProductDownloadsViewContent {
	doesNotHavePackageManagers?: boolean
	featuredCollectionsSlugs?: string[]
	featuredTutorialsSlugs?: string[]
	packageManagerOverrides?: PackageManager[]
	sidebarMenuItems?: MenuItem[]
	sidecarMarketingCard: SidecarMarketingCardProps
	sidecarHcpCallout?: Omit<TryHcpCalloutCompactProps, 'productSlug'>
}

export type FeaturedCollectionCard = CollectionCardPropsWithId

export type FeaturedTutorialCard = TutorialCardPropsWithId

export interface ProductDownloadsViewProps {
	isEnterpriseMode: boolean
	latestVersion: string
	merchandisingSlot?: {
		position: 'above' | 'middle' | 'below'
		slot: ReactElement
	}
	pageContent: {
		featuredCollectionCards?: FeaturedCollectionCard[]
		featuredTutorialCards?: FeaturedTutorialCard[]
		sidecarMarketingCard: SidecarMarketingCardProps
		sidecarHcpCallout?: TryHcpCalloutCompactProps
		sidebarMenuItems?: MenuItem[]
		additionalDownloadItems?: MenuItem[]
		installName?: string
	}
	releases: ReleasesAPIResponse
	sortedAndFilteredVersions: ReleaseVersion[]
	packageManagers: PackageManager[]
}

/**
 * Type for inner content component, with version switcher options
 */
export interface ProductDownloadsViewContentProps {
	isEnterpriseMode: ProductDownloadsViewProps['isEnterpriseMode']
	merchandisingSlot?: ProductDownloadsViewProps['merchandisingSlot']
	pageContent: ProductDownloadsViewProps['pageContent']
	releases: ProductDownloadsViewProps['releases']
	packageManagers: ProductDownloadsViewProps['packageManagers']
	versionSwitcherOptions: VersionContextSwitcherProps['options']
}

/**
 * Type for static props returned from generateStaticProps
 */
export interface ProductDownloadsViewStaticProps extends GeneratedProps {
	pageContent: ProductDownloadsViewProps['pageContent']
}

/**
 * Other types
 */

export interface GroupedPackageManagers {
	[os: string]: PackageManager[]
}
export interface SortedReleases {
	[os: string]: {
		[arch: string]: string
	}
}
