import CollectionCard, {
	CollectionCardPropsWithId,
	CollectionCardWithAuthElements,
} from 'components/collection-card'
import { FeaturedInCollectionsProps } from './types'
import s from './featured-in-collections.module.css'
import CardsGridList from 'components/cards-grid-list'

// This should render the eventual `CollectionCard` component (doesn't exist yet)
// which will be used on many other views
export function FeaturedInCollections({
	className,
	collections,
}: FeaturedInCollectionsProps): React.ReactElement {
	if (collections.length === 0) {
		return null
	}

	return (
		<div className={className}>
			<h2 className={s.heading}>This tutorial also appears in:</h2>
			<div className={s.cards}>
				<CardsGridList fixedColumns={collections.length == 1 ? 2 : null}>
					{collections.map((cardPropsWithId: CollectionCardPropsWithId) => {
						return (
							<li key={cardPropsWithId.id} className={s.listItem}>
								<CollectionCardWithAuthElements {...cardPropsWithId} />
							</li>
						)
					})}
				</CardsGridList>
			</div>
		</div>
	)
}

export default FeaturedInCollections
