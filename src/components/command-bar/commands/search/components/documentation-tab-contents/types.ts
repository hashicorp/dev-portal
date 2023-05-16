/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Hit } from '@algolia/client-search'
import { CommandBarTag } from 'components/command-bar/types'
import { ProductSlug } from 'types/products'
import { SuggestedPagesProps } from '../suggested-pages/types'

interface DocumentationTabContentsProps {
	currentProductTag?: CommandBarTag
	suggestedPages: SuggestedPagesProps['pages']
	activeTabIndex: number
	setActiveTabIndex: (index: number) => void
	handleKeyUp: (event: $TSFixMe, idx: number) => void
	tabData: $TSFixMe
}

type DocumentationHitObject = Hit<{
	page_title: string
	description: string
	headings?: string[]
}> & {
	product: ProductSlug
}

interface DocumentationHitProps {
	hit: DocumentationHitObject
}

export type {
	DocumentationHitObject,
	DocumentationHitProps,
	DocumentationTabContentsProps,
}
