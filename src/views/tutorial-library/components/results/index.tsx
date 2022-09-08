import { useHits, useInstantSearch } from 'react-instantsearch-hooks-web'

import CardsGridList from 'components/cards-grid-list'
import { TutorialCardWithBookmark } from 'components/tutorial-card'
import { getTutorialCardPropsFromHit } from '../../utils/get-tutorial-card-props-from-hit'
import EmptyState from 'components/empty-state'
import { ClearFilters } from '../clear-filters'
import { Pagination } from '../pagination'
import { searchStateToRouteState } from 'views/tutorial-library/utils/router-state'
import { Tutorial } from 'lib/learn-client/types'
import { formatTutorialCard } from 'components/tutorial-card/helpers'

interface TutorialLibraryResultsProps {
	defaultTutorials: Tutorial[]
}

/**
 * Renders tutorial search results as a card grid
 */
export function TutorialLibraryResults({
	defaultTutorials,
}: TutorialLibraryResultsProps) {
	const { results, uiState } = useInstantSearch()
	const { hits } = useHits()

	const hasFiltersApplied =
		Object.keys(searchStateToRouteState(uiState)).length > 0

	if (!results?.__isArtificial && hits.length === 0) {
		return (
			<EmptyState
				heading="No results"
				subheading="Try adjusting your selected filters or using different keywords"
				callToAction={<ClearFilters color="secondary" />}
			/>
		)
	}

	let itemsToRender = null
	if (hasFiltersApplied) {
		itemsToRender = hits.map((hit) => (
			<TutorialCardWithBookmark
				key={hit.objectID}
				{...getTutorialCardPropsFromHit(hit)}
			/>
		))
	} else {
		itemsToRender = defaultTutorials.map((tutorial) => (
			<TutorialCardWithBookmark
				key={tutorial.id}
				{...formatTutorialCard({
					...tutorial,
					defaultContext: tutorial.collectionCtx.default,
				})}
			/>
		))
	}

	return (
		<>
			<CardsGridList fixedColumns={3}>{itemsToRender}</CardsGridList>
			{hasFiltersApplied && <Pagination />}
		</>
	)
}
