import { TutorialCardsProps } from './types'
import CardsGridList from 'components/cards-grid-list'
import TutorialCard, { TutorialCardPropsWithId } from 'components/tutorial-card'

function TutorialCards({ tutorialCards }: TutorialCardsProps) {
  return (
    <CardsGridList>
      {tutorialCards.map((cardPropsWithId: TutorialCardPropsWithId) => {
        const { id, ...cardProps } = cardPropsWithId
        return <TutorialCard key={id} {...cardProps} />
      })}
    </CardsGridList>
  )
}

export type { TutorialCardsProps }
export { TutorialCards }
