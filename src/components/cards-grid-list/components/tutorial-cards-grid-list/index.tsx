import { useBookmarksByTutorialIds } from 'hooks/bookmarks'
import CardsGridList, { CardsGridListProps } from 'components/cards-grid-list'
import {
	TutorialCardPropsWithId,
	TutorialCardWithAuthElements,
} from 'components/tutorial-card'

interface TutorialCardsGridListProps extends CardsGridListProps {
	tutorials: TutorialCardPropsWithId[]
}

/**
 * Handles rendering a grid of Tutorial cards, and pre-fetching the
 * `isBookmarked` state for each card.
 */
const TutorialCardsGridList = ({ tutorials, ...restProps }) => {
	/**
	 * Collect the `tutorialIds` and React elements to render in separate arrays
	 * at the same time (to save on iterating over the same data twice).
	 */
	const tutorialIds = []
	const cardsGridListItems = []
	tutorials.forEach((tutorial: TutorialCardPropsWithId) => {
		tutorialIds.push(tutorial.id)
		cardsGridListItems.push(
			<li key={tutorial.id}>
				<TutorialCardWithAuthElements {...tutorial} />
			</li>
		)
	})

	/**
	 * Prime the `isBookmarked` queries for the tutorial cards we know we need to
	 * render via collected `tutorialIds` array.
	 */
	const { isFetching, isRefetching } = useBookmarksByTutorialIds({
		tutorialIds,
	})

	/**
	 * @TODO handle first load state. Do not need to show loading state if data is
	 * refetching. That can occur in the background.
	 *
	 * We also do not want to block this component from rendering content, so that
	 * is why `isLoading` is not being used.
	 *
	 * The bookmark queries are disabled
	 * when is auth is disabled or no user is authenticated. When queries are
	 * `disabled`, `isLoading` is `true` forever.
	 */
	const isFirstLoad = isFetching && !isRefetching
	if (isFirstLoad) {
		return null
	}

	return <CardsGridList {...restProps}>{cardsGridListItems}</CardsGridList>
}

export type { TutorialCardsGridListProps }
export default TutorialCardsGridList
