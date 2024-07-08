/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import CardsGridList from 'components/cards-grid-list'
import {
	CollectionCardPropsWithId,
	CollectionCardWithAuthElements,
} from 'components/collection-card'
import { FeaturedStack } from '../featured-stack'
import { CollectionsStackProps } from './types'

function CollectionsStack({
	collectionCards,
	heading,
	headingSlug,
	subheading,
}: CollectionsStackProps): JSX.Element {
	return (
		<FeaturedStack
			heading={heading}
			headingSlug={headingSlug}
			subheading={subheading}
		>
			<CardsGridList>
				{collectionCards.map((cardPropsWithId: CollectionCardPropsWithId) => {
					return (
						<CollectionCardWithAuthElements
							key={cardPropsWithId.id}
							{...cardPropsWithId}
						/>
					)
				})}
			</CardsGridList>
		</FeaturedStack>
	)
}

export type { CollectionsStackProps }
export { CollectionsStack }
