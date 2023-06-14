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
import { CollectionContext, TutorialViewProps } from 'views/tutorial-view'
import { NextPreviousProps } from 'views/tutorial-view/components'
import { OutlineLinkItem } from 'components/outline-nav/types'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

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
	tutorial: Omit<TutorialFullCollectionCtx, 'content' | 'collectionCtx'> & {
		content: MDXRemoteSerializeResult
		collectionCtx: CollectionContext
		nextPreviousData: NextPreviousProps
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
	metadata?: TutorialViewProps['metadata']
}
