import { useRef, useEffect } from 'react'
import { useInstantSearch } from 'react-instantsearch-hooks-web'

/**
 * Scrolls to the top of the page when results have meaningfully changed from user action.
 * We do this by ignoring the query for initial results, and only scrolling ony subsequent searches.
 *
 * @TODO handle focus management on scroll
 */
export const useScrollToTopOnResultsChange = () => {
	const shouldScroll = useRef<boolean>(false)
	const { results } = useInstantSearch()

	useEffect(() => {
		if (!shouldScroll.current) {
			return
		}

		window.scrollTo(0, 0)
	}, [results])

	useEffect(() => {
		if (
			results?.__isArtificial ||
			results?.nbHits === 0 ||
			shouldScroll.current
		) {
			return
		}

		shouldScroll.current = true
	}, [results])
}
