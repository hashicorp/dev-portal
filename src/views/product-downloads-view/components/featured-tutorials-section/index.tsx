import { ReactElement } from 'react'
import { FeaturedLearnCard } from 'views/product-downloads-view/types'
import Heading from 'components/heading'
import CardsGridList from 'components/cards-grid-list'
import CollectionCard from 'components/collection-card'
import { ConnectedTutorialCard } from 'components/tutorial-card'
import viewStyles from 'views/product-downloads-view/product-downloads-view.module.css'

interface FeaturedTutorialsSectionProps {
	featuredLearnCards: FeaturedLearnCard[]
}

const FeaturedTutorialsSection = ({
	featuredLearnCards,
}: FeaturedTutorialsSectionProps): ReactElement => {
	return (
		<>
			<Heading
				className={viewStyles.heading2}
				id="featured-tutorials"
				level={2}
				size={300}
				weight="bold"
			>
				Featured Tutorials
			</Heading>
			<CardsGridList>
				{featuredLearnCards.map((cardProps: FeaturedLearnCard) => {
					const { id, type } = cardProps
					if (type == 'collection') {
						return (
							<li key={id}>
								<CollectionCard {...cardProps} />
							</li>
						)
					} else if (type == 'tutorial') {
						return (
							<li key={id}>
								<ConnectedTutorialCard {...cardProps} />
							</li>
						)
					}
				})}
			</CardsGridList>
		</>
	)
}

export default FeaturedTutorialsSection
