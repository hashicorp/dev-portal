import { ReactElement } from 'react'
import { FeaturedLearnCard } from 'views/product-downloads-view/types'
import viewStyles from 'views/product-downloads-view/product-downloads-view.module.css'
import { TutorialCardsGridList } from 'components/cards-grid-list'
import Heading from 'components/heading'

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
			<TutorialCardsGridList tutorials={featuredLearnCards} />
		</>
	)
}

export default FeaturedTutorialsSection
