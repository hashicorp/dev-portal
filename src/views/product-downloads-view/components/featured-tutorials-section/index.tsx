import { ReactElement } from 'react'
import { FeaturedTutorialCard } from 'views/product-downloads-view/types'
import Heading from 'components/heading'
import CardsGridList from 'components/cards-grid-list'
import CollectionCard from 'components/collection-card'
import TutorialCard from 'components/tutorial-card'
import s from './featured-tutorials-section.module.css'

interface FeaturedTutorialsSectionProps {
  featuredTutorialCards: FeaturedTutorialCard[]
}

const FeaturedTutorialsSection = ({
  featuredTutorialCards,
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
          {featuredTutorialCards.map((cardProps: FeaturedTutorialCard) => {
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
