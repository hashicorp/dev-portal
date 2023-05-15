/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Hit } from '@algolia/client-search'
import {
	CollectionLevelOption,
	ProductOption,
	TutorialLite,
} from 'lib/learn-client/types'
import { CommandBarTag } from 'components/command-bar/types'

interface TutorialsTabContentsProps {
	currentProductTag?: CommandBarTag
	tutorialLibraryCta: {
		href: string
		text: string
	}
	activeTabIndex: number
	setActiveTabIndex: (index: number) => void
	tabData: $TSFixMe
}

type TutorialHitObject = Hit<{
	description: string
	page_title: string
	headings: string[]
}> &
	Pick<
		TutorialLite,
		| 'defaultContext'
		| 'id'
		| 'name'
		| 'slug'
		| 'description'
		| 'readTime'
		| 'edition'
	> & {
		hasVideo: boolean
		isInteractive: boolean
		products: ProductOption[]
		level: CollectionLevelOption
	}

interface TutorialHitProps {
	hit: TutorialHitObject
}

export type { TutorialHitObject, TutorialHitProps, TutorialsTabContentsProps }
