/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Collection as ApiCollection } from 'lib/learn-client/types'
import { EnrichedNavItem } from 'components/sidebar/types'
import { NextPreviousProps } from 'views/tutorial-view/components'
import { SidebarProps } from 'components/sidebar/types'
import { SidebarSidecarWithTocProps } from 'layouts/sidebar-sidecar-with-toc'
import { HeroHeadingVisualProps } from 'views/product-landing/components/hero-heading-visual/types'
import { OverviewCtaProps } from 'views/product-landing/components/overview-cta/types'
import { ProductViewBlock } from 'views/product-tutorials-view/components/product-view-content'
import { TutorialData } from 'views/tutorial-view'

export interface WellArchitectedFrameworkLandingProps {
	metadata: {
		title: string
		name: string
		slug: string
	}
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
		breadcrumbLinks: SidebarSidecarWithTocProps['breadcrumbLinks']
		headings: SidebarSidecarWithTocProps['headings']
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
		breadcrumbLinks: SidebarSidecarWithTocProps['breadcrumbLinks']
		sidebarSections: EnrichedNavItem[]
	}
}

export interface WafTutorialViewProps {
	tutorial: TutorialData & {
		nextPreviousData: NextPreviousProps
	}
	layoutProps: {
		headings: SidebarSidecarWithTocProps['headings']
		breadcrumbLinks: SidebarSidecarWithTocProps['breadcrumbLinks']
		navLevels: SidebarProps[]
	}
}
