import { ReactElement } from 'react'
import {
	FeaturedCollectionCard,
	FeaturedTutorialCard,
} from 'views/product-downloads-view/types'
import viewStyles from 'views/product-downloads-view/product-downloads-view.module.css'
import CardsGridList, {
	TutorialCardsGridList,
} from 'components/cards-grid-list'
import Heading from 'components/heading'
import CollectionCard from 'components/collection-card'

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
				className={viewStyles.heading2}
				id="featured-tutorials"
				level={2}
				size={300}
				weight="bold"
			>
				{cardType === 'tutorial'
					? 'Featured Tutorials'
					: 'Featured Collections'}
			</Heading>
			{cardType === 'tutorial' ? (
				<TutorialCardsGridList tutorials={cards} />
			) : (
				<CardsGridList>
					{(cards as FeaturedCollectionCard[]).map(
						(collectionCardProps: FeaturedCollectionCard) => {
							return (
								<li key={collectionCardProps.id}>
									<CollectionCard {...collectionCardProps} />
								</li>
							)
						}
					)}
				</CardsGridList>
			)}
		</>
	)
}

export default FeaturedLearnCardsSection
