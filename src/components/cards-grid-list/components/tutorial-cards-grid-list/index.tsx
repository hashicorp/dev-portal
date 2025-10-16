/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useBookmarksByTutorialIds } from 'hooks/bookmarks'
import CardsGridList, { CardsGridListProps } from 'components/cards-grid-list'
import {
	TutorialCardPropsWithId,
	TutorialCardWithAuthElements,
} from 'components/tutorial-card'
import s from './tutorial-cards.module.css'
import compactStyles from 'components/tutorial-card/tutorial-card-compact.module.css'

interface TutorialCardsGridListProps extends CardsGridListProps {
	tutorials: TutorialCardPropsWithId[]
	compact?: boolean
}

const TutorialCardsGridList = ({
	tutorials,
	compact = false,
	...restProps
}) => {
	const tutorialIds = []
	const cardsGridListItems = []
	tutorials.forEach((tutorial: TutorialCardPropsWithId) => {
		tutorialIds.push(tutorial.id)
		cardsGridListItems.push(
			<div
				className={`${s.tutorialCardBox} ${
					compact ? compactStyles.compactTutorialCard : ''
				}`}
				key={tutorial.id}
			>
				<TutorialCardWithAuthElements {...tutorial} hasBookmark={false} />
			</div>
		)
	})

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
