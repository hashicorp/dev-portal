import { ReactElement } from 'react'
import { ReleasesAPIResponse, GeneratedProps } from 'lib/fetch-release-data'
import { VersionContextSwitcherProps } from 'components/version-context-switcher'
import { SidecarMarketingCardProps } from './components/sidecar-marketing-card'
import { MenuItem } from 'components/sidebar'
import { CollectionCardPropsWithId } from 'components/collection-card'
import { TutorialCardPropsWithId } from 'components/tutorial-card'

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
}

export interface RawProductDownloadsViewContent {
	doesNotHavePackageManagers?: boolean
	featuredTutorialsSlugs: string[]
	packageManagerOverrides?: PackageManager[]
	sidebarMenuItems?: MenuItem[]
	sidecarMarketingCard: SidecarMarketingCardProps
}

/**
 * View prop types
 */

export type FeaturedLearnCard =
	| ({ type: 'collection' } & CollectionCardPropsWithId)
	| ({ type: 'tutorial' } & TutorialCardPropsWithId)

export interface ProductDownloadsViewProps {
	latestVersion: string
	merchandisingSlot?: ReactElement
	pageContent: {
		doesNotHavePackageManagers?: boolean
		featuredLearnCards?: FeaturedLearnCard[]
		packageManagerOverrides?: PackageManager[]
		sidecarMarketingCard: SidecarMarketingCardProps
		sidebarMenuItems?: MenuItem[]
	}
	releases: ReleasesAPIResponse
}

/**
 * Type for inner content component, with version switcher options
 */
export interface ProductDownloadsViewContentProps {
	merchandisingSlot?: ProductDownloadsViewProps['merchandisingSlot']
	pageContent: ProductDownloadsViewProps['pageContent']
	releases: ProductDownloadsViewProps['releases']
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
