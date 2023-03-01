/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Collection as ApiCollection } from 'lib/learn-client/types'
import { EnrichedNavItem } from 'components/sidebar/types'
import { SidebarSidecarWithTocProps } from 'layouts/sidebar-sidecar-with-toc'
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
		breadcrumbLinks: SidebarSidecarWithTocProps['breadcrumbLinks']
		sidebarSections: EnrichedNavItem[]
	}
}

export interface OnboardingTutorialViewProps {
	tutorial: TutorialData & {
		nextPreviousData: NextPreviousProps
	}
	layoutProps: {
		headings: SidebarSidecarWithTocProps['headings']
		breadcrumbLinks: SidebarSidecarWithTocProps['breadcrumbLinks']
		navLevels: SidebarProps[]
	}
}
