import { LinkedCard, LinkedCardsProps } from './types'
import CardsGridList from 'components/cards-grid-list'
import CardLink from 'components/card-link'
import { CardBody, CardHeading } from 'components/tutorial-collection-cards'

function LinkedCards({ cards }: LinkedCardsProps) {
  return (
    <CardsGridList>
      {cards.map((card: LinkedCard, idx: number) => {
        return (
          <CardLink key={idx} href={card.url}>
            <CardHeading level={3} text={card.heading} />
            <CardBody text={card.body} />
          </CardLink>
        )
      })}
    </CardsGridList>
  )
}

export type { LinkedCardsProps }
export { LinkedCards }
