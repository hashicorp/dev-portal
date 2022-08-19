import CardsGridList from 'components/cards-grid-list'
import { TutorialCardPropsWithId } from 'components/tutorial-card/types'
import { TutorialCardWithBookmark } from 'components/tutorial-card/helpers/with-bookmark'
import { CollectionTutorialListProps } from './types'
import s from './collection-tutorial-list.module.css'
import { ReactElement, ReactNode } from 'react'

function CollectionTutorialList({
	tutorials,
	isOrdered,
}: CollectionTutorialListProps) {
	return (
		<div className={s.root}>
			<CardsGridList isOrdered={isOrdered} fixedColumns={isOrdered ? 1 : null}>
				<ConnectedTutorialCards
					tutorials={tutorials}
					renderItem={(CardComponent, id) => {
						return <li key={id}>{CardComponent}</li>
					}}
				/>
			</CardsGridList>
		</div>
	)
}

export default CollectionTutorialList

function ConnectedTutorialCards({
	tutorials,
	renderItem,
}: {
	tutorials: any
	renderItem(Component: ReactElement, id: string): ReactNode
}) {
	/**
	 * TODO: fetch data here
	 *
	 * const tutorialBookmarks = useBookmarks(tutorials.map({id} => id))
	 * const tutorialsWithBookmarkData = // match bookmarks to tutorials
	 *
	 * then map over the tutorial data with the augmented bookmark data
	 */

	return (
		<>
			{tutorials.map((tutorial: TutorialCardPropsWithId) =>
				renderItem(
					<TutorialCardWithBookmark isBookmarked={false} {...tutorial} />,
					tutorial.id
				)
			)}
		</>
	)
}
