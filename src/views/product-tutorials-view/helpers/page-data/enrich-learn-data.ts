/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	ProductPageBlock as LearnClientProductPageBlock,
	ProductPageBlockBrandedCallout,
	ProductPageBlockCardList,
	ProductPageBlockCollectionsStack,
	ProductPageBlockFeaturedStack,
	ProductPageBlockLogoCard,
	ProductPageBlockTutorialsStack,
} from 'lib/learn-client/types'
import { InlineCollections, InlineTutorials } from '../get-inline-content'
import { formatCollectionCard } from 'components/collection-card/helpers'
import { CollectionCardPropsWithId } from 'components/collection-card'
import { TutorialCardPropsWithId } from 'components/tutorial-card'
import { formatTutorialCard } from 'components/tutorial-card/helpers'

/**
 * Enriched product page blocks contain specific tutorial & collection data,
 * rather than slugs. Data is specifically formatted for the props needs
 * of each block component.
 */
export type LearnClientProductPageBlockEnriched =
	| FeaturedStackEnriched
	| ProductPageBlockBrandedCallout
	| CardListEnriched
	| TutorialsStackEnriched
	| CollectionsStackEnriched
// Individual types
type CardListEnriched = Omit<ProductPageBlockCardList, 'items'> & {
	collectionCards: CollectionCardPropsWithId[]
}
type FeaturedStackEnriched = Omit<ProductPageBlockFeaturedStack, 'blocks'> & {
	blocks: CardListEnriched[]
}
type TutorialsStackEnriched = Omit<
	ProductPageBlockTutorialsStack,
	'tutorialSlugs'
> & {
	tutorialCards: TutorialCardPropsWithId[]
}
type CollectionsStackEnriched = Omit<
	ProductPageBlockCollectionsStack,
	'collectionSlugs'
> & {
	collectionCards: CollectionCardPropsWithId[]
}

/**
 * Format any referenced collection and tutorial slugs,
 * adding in the full complete data using provided
 * inlineCollection and inlineTutorial objects.
 */
export function enrichLearnData(
	blocks: LearnClientProductPageBlock[],
	inlineCollections: InlineCollections,
	inlineTutorials: InlineTutorials
): LearnClientProductPageBlockEnriched[] {
	return blocks.map((block: LearnClientProductPageBlock) => {
		if (block.type === 'FeaturedStack') {
			/**
			 * Recurse and enrich child blocks.
			 *
			 * Note: we could remove this recursion, FeaturedStack is only ever
			 * used with ProductPageBlockCardList. Asana task:
			 * https://app.asana.com/0/0/1202182325935208/f
			 */
			return {
				...block,
				blocks: enrichLearnData(
					block.blocks,
					inlineCollections,
					inlineTutorials
				) as CardListEnriched[],
			}
		} else if (block.type === 'CardList') {
			/**
			 * Add collection cards with logos to `CardsList`
			 */
			const { items, ...restBlock } = block
			const collectionCards = items.map((item: ProductPageBlockLogoCard) => {
				const { collectionSlug, logo } = item
				const collection = inlineCollections[collectionSlug]
				return { ...formatCollectionCard(collection), logo }
			}) as CollectionCardPropsWithId[]
			return { ...restBlock, collectionCards }
		} else if (block.type === 'CollectionsStack') {
			/**
			 * Add collection card data to `CollectionsStack`
			 */
			const { collectionSlugs, ...restBlock } = block
			const collectionCards = block.collectionSlugs.map((slug: string) => {
				return formatCollectionCard(inlineCollections[slug])
			})
			return { ...restBlock, collectionCards }
		} else if (block.type === 'TutorialsStack') {
			/**
			 * Add tutorial card data to `TutorialsStack`
			 */
			const { tutorialSlugs, ...restBlock } = block
			const tutorialCards = block.tutorialSlugs.map((slug: string) => {
				const tutorial = inlineTutorials[slug]
				const defaultContext = tutorial.collectionCtx.default
				const tutorialLiteCompat = { ...tutorial, defaultContext }
				return formatTutorialCard(tutorialLiteCompat)
			})
			return { ...restBlock, tutorialCards }
		} else {
			// By default, return the block unchanged
			return block
		}
	})
}
