/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Collection as ApiCollection } from 'lib/learn-client/types'
import { EnrichedNavItem } from 'components/sidebar/types'
import { NextPreviousProps } from 'views/tutorial-view/components'
import { SidebarProps } from 'components/sidebar/types'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import { HeroHeadingVisualProps } from 'views/product-landing/components/hero-heading-visual/types'
import { OverviewCtaProps } from 'views/product-landing/components/overview-cta/types'
import { ProductViewBlock } from 'views/product-tutorials-view/components/product-view-content'
import { TutorialData } from 'views/tutorial-view'
import { OutlineLinkItem } from 'components/outline-nav/types'
import { TutorialViewProps } from 'views/tutorial-view'
import { HeadMetadataProps } from 'components/head-metadata/types'

export interface WellArchitectedFrameworkLandingProps {
	metadata: HeadMetadataProps & {
		name: string
		slug: string
	}
	outlineItems: OutlineLinkItem[]
	data: {
		pageData: {
			blocks: ProductViewBlock[]
		}
		wafContent: {
			hero: HeroHeadingVisualProps
			overview: OverviewCtaProps
		}
	}
	layoutProps: {
		breadcrumbLinks: SidebarSidecarLayoutProps['breadcrumbLinks']
		sidebarSections: EnrichedNavItem[]
	}
}

export interface WellArchitectedFrameworkCollectionViewProps {
	metadata: {
		wafName: string
		wafSlug: string
	}
	collection: ApiCollection
	layoutProps: {
		breadcrumbLinks: SidebarSidecarLayoutProps['breadcrumbLinks']
		sidebarSections: EnrichedNavItem[]
	}
}

export interface WafTutorialViewProps {
	metadata: HeadMetadataProps
	tutorial: TutorialData & {
		nextPreviousData: NextPreviousProps
		variant?: TutorialViewProps['metadata']['variant']
	}
	pageHeading: {
		slug: string
		text: string
	}
	outlineItems: OutlineLinkItem[]
	layoutProps: {
		breadcrumbLinks: SidebarSidecarLayoutProps['breadcrumbLinks']
		navLevels: SidebarProps[]
	}
}
