import { CollectionCardsProps } from './types'
import CardsGridList from 'components/cards-grid-list'
import CollectionCard, {
	CollectionCardWithAuthElements,
	CollectionCardPropsWithId,
} from 'components/collection-card'

function CollectionCards({ collectionCards }: CollectionCardsProps) {
	return (
		<CardsGridList>
			{collectionCards.map((cardPropsWithId: CollectionCardPropsWithId) => {
				return (
					<li key={cardPropsWithId.id}>
						<CollectionCardWithAuthElements {...cardPropsWithId} />
					</li>
				)
			})}
		</CardsGridList>
	)
}

export type { CollectionCardsProps }
export { CollectionCards }
