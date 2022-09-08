import { Collection as ApiCollection } from 'lib/learn-client/types'
import { EnrichedNavItem } from 'components/sidebar/types'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import { SidebarProps } from 'components/sidebar/types'
import { NextPreviousProps } from 'views/tutorial-view/components'
import { TutorialData } from 'views/tutorial-view'

export interface OnboardingCollectionViewProps {
	metadata: {
		onboardingName: string
		onboardingSlug: string
	}
	collection: ApiCollection
	layoutProps: {
		breadcrumbLinks: SidebarSidecarLayoutProps['breadcrumbLinks']
		sidebarSections: EnrichedNavItem[]
	}
}

export interface OnboardingTutorialViewProps {
	tutorial: TutorialData & {
		nextPreviousData: NextPreviousProps
	}
	layoutProps: {
		headings: SidebarSidecarLayoutProps['headings']
		breadcrumbLinks: SidebarSidecarLayoutProps['breadcrumbLinks']
		navLevels: SidebarProps[]
	}
}
