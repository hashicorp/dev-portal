import { ReactElement } from 'react'
import { FeaturedTutorialCard as FeaturedLearnCard } from 'views/product-downloads-view/types'
import Heading from 'components/heading'
import CardsGridList from 'components/cards-grid-list'
import CollectionCard from 'components/collection-card'
import TutorialCard from 'components/tutorial-card'
import s from './featured-tutorials-section.module.css'

interface FeaturedTutorialsSectionProps {
  featuredLearnCards: FeaturedLearnCard[]
}

const FeaturedTutorialsSection = ({
  featuredLearnCards,
}: FeaturedTutorialsSectionProps): ReactElement => {
  return (
    <>
      <Heading
        className={s.sectionHeading}
        level={2}
        size={300}
        id="featured-tutorials"
        weight="bold"
      >
        Featured Tutorials
      </Heading>
      <div className={s.cardGrid}>
        <CardsGridList>
          {featuredLearnCards.map((cardProps: FeaturedLearnCard) => {
            const { id, type } = cardProps
            if (type == 'collection') {
              return <CollectionCard key={id} {...cardProps} />
            } else if (type == 'tutorial') {
              return <TutorialCard key={id} {...cardProps} />
            }
          })}
        </CardsGridList>
      </div>
    </>
  )
}

export default FeaturedTutorialsSection
