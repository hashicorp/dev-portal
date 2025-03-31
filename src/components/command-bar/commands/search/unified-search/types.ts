/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { Hit } from 'instantsearch.js'
import {
	CollectionLevelOption,
	ProductOption,
	TutorialLite,
} from 'lib/learn-client/types'

export type TutorialHitObject = Hit<{
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

export enum SearchContentTypes {
	GLOBAL = 'global',
	DOCS = 'docs',
	INTEGRATION = 'integration',
	TUTORIAL = 'tutorial',
	KNOWLEDGEBASE = 'knowledgebase',
}

export type UnifiedSearchResults = Record<
	SearchContentTypes,
	{
		searchQuery?: string
		hits: Hit[]
	}
>
