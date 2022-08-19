import CardsGridList from 'components/cards-grid-list'
import { TutorialCardPropsWithId } from 'components/tutorial-card/types'
import { ConnectedTutorialCard } from 'components/tutorial-card/connected-tutorial-card'
import { CollectionTutorialListProps } from './types'
import s from './collection-tutorial-list.module.css'

function CollectionTutorialList({
	tutorials,
	isOrdered,
}: CollectionTutorialListProps) {
	return (
		<div className={s.root}>
			<CardsGridList isOrdered={isOrdered} fixedColumns={isOrdered ? 1 : null}>
				{tutorials.map((tutorial: TutorialCardPropsWithId) => {
					return (
						<li key={tutorial.id}>
							<ConnectedTutorialCard {...tutorial} />
						</li>
					)
				})}
			</CardsGridList>
		</div>
	)
}

export default CollectionTutorialList
