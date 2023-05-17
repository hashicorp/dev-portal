/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Hit } from '@algolia/client-search'
import { CommandBarTag } from 'components/command-bar/types'
import { ProductSlug } from 'types/products'
import { SuggestedPagesProps } from '../suggested-pages/types'
import { NoResultsMessageProps } from '../no-results-message'

interface DocumentationTabContentsProps {
	currentProductTag?: CommandBarTag
	suggestedPages: SuggestedPagesProps['pages']
	noResultsProps: NoResultsMessageProps
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
