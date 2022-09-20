import { useHits, useInstantSearch } from 'react-instantsearch-hooks-web'

import CardsGridList from 'components/cards-grid-list'
import { TutorialCardWithAuthElements } from 'components/tutorial-card'
import { getTutorialCardPropsFromHit } from '../../utils/get-tutorial-card-props-from-hit'
import EmptyState from 'components/empty-state'
import { ClearFiltersButton } from '../clear-filters-button'
import { Pagination } from '../pagination'
import { searchStateToRouteState } from 'views/tutorial-library/utils/router-state'
import { Tutorial } from 'lib/learn-client/types'
import { formatTutorialCard } from 'components/tutorial-card/helpers'

interface TutorialLibraryResultsProps {
	defaultTutorials: Omit<Tutorial, 'content'>[]
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
			<>
				<span aria-live="polite" className="g-screen-reader-only">
					Search returned no results.
				</span>
				<EmptyState
					heading="No results"
					subheading="Try adjusting your selected filters or using different keywords"
					callToAction={<ClearFiltersButton color="secondary" />}
				/>
			</>
		)
	}

	let itemsToRender = null
	if (hasFiltersApplied) {
		itemsToRender = hits.map((hit) => (
			<TutorialCardWithAuthElements
				key={hit.objectID}
				{...getTutorialCardPropsFromHit(hit)}
			/>
		))
	} else {
		itemsToRender = defaultTutorials.map((tutorial) => (
			<TutorialCardWithAuthElements
				key={tutorial.id}
				{...formatTutorialCard({
					...tutorial,
					defaultContext: tutorial.collectionCtx.default,
				})}
			/>
		))
	}

	const resultsLowerBound = results.hitsPerPage * results.page + 1
	const resultsUpperBound = Math.min(
		results.hitsPerPage * (results.page + 1),
		results.nbHits
	)

	return (
		<>
			<span aria-live="polite" className="g-screen-reader-only">
				{hasFiltersApplied
					? `Search returned ${results.nbHits} results. Displaying ${resultsLowerBound} through ${resultsUpperBound}.`
					: 'Apply filters to search.'}
			</span>
			<CardsGridList fixedColumns={3}>{itemsToRender}</CardsGridList>
			{hasFiltersApplied && <Pagination />}
		</>
	)
}
