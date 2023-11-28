/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import {
	FeaturedCollectionCard,
	FeaturedTutorialCard,
} from 'views/product-downloads-view/types'
import CardsGridList, {
	TutorialCardsGridList,
} from 'components/cards-grid-list'
import Heading from 'components/heading'
import { CollectionCardWithAuthElements } from 'components/collection-card'
import s from './featured-learn-cards-section.module.css'

interface FeaturedTutorialsSectionProps {
	cards: FeaturedTutorialCard[] | FeaturedCollectionCard[]
	cardType: 'tutorial' | 'collection'
}

const FeaturedLearnCardsSection = ({
	cards = [],
	cardType = 'tutorial',
}: FeaturedTutorialsSectionProps): ReactElement => {
	if (cards.length <= 0) {
		return null
	}

	return (
		<>
			<Heading
				id="featured-tutorials"
				className={s.heading}
				level={2}
				size={500}
				weight="bold"
			>
				Next steps
			</Heading>
			{cardType === 'tutorial' ? (
				<TutorialCardsGridList tutorials={cards} />
			) : (
				<CardsGridList>
					{(cards as FeaturedCollectionCard[]).map(
						(collectionCardProps: FeaturedCollectionCard) => {
							return (
								<CollectionCardWithAuthElements
									key={collectionCardProps.id}
									{...collectionCardProps}
								/>
							)
						}
					)}
				</CardsGridList>
			)}
		</>
	)
}

export default FeaturedLearnCardsSection
