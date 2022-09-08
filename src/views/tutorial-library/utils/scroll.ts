import { useRef, useEffect } from 'react'
import { useInstantSearch } from 'react-instantsearch-hooks-web'
import { searchStateToRouteState } from './router-state'

/**
 * Scrolls to the top of the page when results have meaningfully changed from user action.
 * We do this by ignoring the query for initial results, and only scrolling ony subsequent searches.
 */
export const useScrollToTopOnResultsChange = () => {
	const shouldScroll = useRef<boolean>(false)
	const { results, uiState } = useInstantSearch()

	useEffect(() => {
		if (!shouldScroll.current) {
			return
		}

		window.scrollTo(0, 0)
	}, [results])

	useEffect(() => {
		const currentFilters = searchStateToRouteState(uiState)
		const hasCurrentFilters = Object.keys(currentFilters).length > 0

		if (
			results.__isArtificial ||
			results.nbHits === 0 ||
			!hasCurrentFilters ||
			shouldScroll.current
		) {
			return
		}

		shouldScroll.current = true
	}, [results, uiState])
}
