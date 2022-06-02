import { CollectionCardsProps } from './types'
import CardsGridList from 'components/cards-grid-list'
import CollectionCard, {
  CollectionCardPropsWithId,
} from 'components/collection-card'

function CollectionCards({ collectionCards }: CollectionCardsProps) {
  return (
    <CardsGridList>
      {collectionCards.map((cardPropsWithId: CollectionCardPropsWithId) => {
        const { id, ...cardProps } = cardPropsWithId
        return (
          <li key={id}>
            <CollectionCard {...cardProps} />
          </li>
        )
      })}
    </CardsGridList>
  )
}

export type { CollectionCardsProps }
export { CollectionCards }
