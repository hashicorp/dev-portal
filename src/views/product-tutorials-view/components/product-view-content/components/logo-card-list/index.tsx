import CardsGridList from 'components/cards-grid-list'
import {
	CollectionCardPropsWithId,
	CollectionCardWithAuthElements,
} from 'components/collection-card'
import { LogoCardListProps, LogoCardListItem } from './types'

function LogoCardList({ collectionCards }: LogoCardListProps): JSX.Element {
	return (
		<CardsGridList>
			{collectionCards.map((cardPropsWithId: CollectionCardPropsWithId) => {
				return (
					<CollectionCardWithAuthElements
						key={cardPropsWithId.id}
						{...cardPropsWithId}
					/>
				)
			})}
		</CardsGridList>
	)
}

export type { LogoCardListProps, LogoCardListItem }
export { LogoCardList }
