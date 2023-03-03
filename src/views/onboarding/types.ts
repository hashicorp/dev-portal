/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	Collection as ApiCollection,
	TutorialFullCollectionCtx,
} from 'lib/learn-client/types'
import { EnrichedNavItem } from 'components/sidebar/types'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import { SidebarProps } from 'components/sidebar/types'
import { NextPreviousProps } from 'views/tutorial-view/components'
import { TutorialData } from 'views/tutorial-view'
import { OutlineLinkItem } from 'components/outline-nav/types'

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
		full: TutorialFullCollectionCtx
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
