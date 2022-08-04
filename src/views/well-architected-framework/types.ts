import {
	Collection as ApiCollection,
	Tutorial as ApiTutorial,
} from 'lib/learn-client/types'
import { EnrichedNavItem } from 'components/sidebar/types'
import { NextPreviousProps } from 'views/tutorial-view/components'
import { SidebarProps } from 'components/sidebar/types'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import { HeroHeadingVisualProps } from 'views/product-landing/components/hero-heading-visual/types'
import { OverviewCtaProps } from 'views/product-landing/components/overview-cta/types'
import { ProductViewBlock } from 'views/product-tutorials-view/components/product-view-content'
import {
	InlineCollections,
	InlineTutorials,
} from 'views/product-tutorials-view/helpers/get-inline-content'

export interface WellArchitectedFrameworkLandingProps {
	metadata: {
		title: string
		name: string
		slug: string
	}
	data: {
		pageData: {
			hero: HeroHeadingVisualProps
			overview: OverviewCtaProps
			blocks: ProductViewBlock[]
		}
		inlineCollections: InlineCollections
		inlineTutorials: InlineTutorials
	}
	layoutProps: {
		breadcrumbLinks: SidebarSidecarLayoutProps['breadcrumbLinks']
		headings: SidebarSidecarLayoutProps['headings']
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
	tutorial: ApiTutorial & {
		nextPreviousData: NextPreviousProps
	}
	layoutProps: {
		headings: SidebarSidecarLayoutProps['headings']
		breadcrumbLinks: SidebarSidecarLayoutProps['breadcrumbLinks']
		navLavels: SidebarProps[]
	}
}
