import CardsGridList from 'components/cards-grid-list'
import CollectionCard, {
  CollectionCardPropsWithId,
} from 'components/collection-card'
import { formatCollectionCard } from 'components/collection-card/helpers'
import { LogoCardListProps, LogoCardListItem } from './types'

function LogoCardList({ items }: LogoCardListProps): JSX.Element {
  /**
   * TODO: Instead of passing full ClientCollection data to frontend,
   * and trimming it down here to card data, it seems like we could
   * do this trimming server side, and end up with a much smaller
   * bundle of static props JSON.
   * Asana task: https://app.asana.com/0/0/1202182325935203/f
   */
  const collectionCards = items.map((item: LogoCardListItem) => {
    const { collection, logo } = item
    return { ...formatCollectionCard(collection), logo }
  }) as CollectionCardPropsWithId[]

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

export type { LogoCardListProps, LogoCardListItem }
export { LogoCardList }
