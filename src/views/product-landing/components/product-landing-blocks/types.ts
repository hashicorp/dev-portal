/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CalloutCardProps } from 'components/callout-card/types'
import {
	HeadingBlockProps,
	TutorialCardsProps,
	CollectionCardsProps,
	LinkedCardsProps,
} from './blocks'

export type ProductLandingBlock =
	| ({ type: 'tutorial_cards' } & TutorialCardsProps)
	| ({ type: 'collection_cards' } & CollectionCardsProps)
	| ({ type: 'linked_cards' } & LinkedCardsProps)
	| ({ type: 'heading' } & HeadingBlockProps)
	| ({ type: 'callout' } & CalloutCardProps)

export interface ProductLandingBlocksProps {
	blocks: ProductLandingBlock[]
}
