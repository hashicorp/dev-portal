import CardsGridList from 'components/cards-grid-list'
import TutorialCard from 'components/tutorial-card'
import { TutorialCardProps } from 'components/tutorial-card/types'
import { CollectionTutorialListProps } from './types'
import s from './collection-tutorial-list.module.css'

function CollectionTutorialList({
	tutorials,
	isOrdered,
}: CollectionTutorialListProps) {
	return (
		<div className={s.root}>
			<CardsGridList isOrdered={isOrdered} fixedColumns={isOrdered ? 1 : null}>
				{tutorials.map((tutorial: TutorialCardProps) => {
					return (
						<li key={tutorial.id}>
							<TutorialCard {...tutorial} />
						</li>
					)
				})}
			</CardsGridList>
		</div>
	)
}

export default CollectionTutorialList
