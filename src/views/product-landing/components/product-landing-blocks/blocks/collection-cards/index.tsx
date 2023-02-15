/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CollectionCardsProps } from './types'
import CardsGridList from 'components/cards-grid-list'
import CollectionCard, {
	CollectionCardWithAuthElements,
	CollectionCardPropsWithId,
} from 'components/collection-card'

function CollectionCards({ collectionCards }: CollectionCardsProps) {
	return (
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
	)
}

export type { CollectionCardsProps }
export { CollectionCards }
