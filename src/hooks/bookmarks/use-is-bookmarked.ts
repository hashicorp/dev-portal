import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ApiTutorial } from 'lib/learn-client/api/api-types'
import { useAllBookmarks } from './use-all-bookmarks'

interface UseIsBookmarkedOptions {
	tutorialId: ApiTutorial['id']
}

interface UseIsBookmarkedResult extends Omit<UseQueryResult, 'data'> {
	isBookmarked: null | boolean
}

/**
 * @TODO document
 */
const useIsBookmarked = ({
	tutorialId,
}: UseIsBookmarkedOptions): UseIsBookmarkedResult => {
	// Load up all bookmarks, since we know it primes queries & handles auth
	const { isFetched: bookmarksAreFetched } = useAllBookmarks()

	// After bookmarks are fetched, query for bookmark for the given `tutorialId`
	// Disable query until bookmarks have finished fetching
	const { data: bookmark, ...restQueryResult } = useQuery(
		['bookmark', tutorialId],
		{ enabled: bookmarksAreFetched }
	)

	// If `bookmark` is `undefined`, then it is still loading
	const isBookmarked = bookmark === undefined ? null : !!bookmark
	return {
		isBookmarked,
		...restQueryResult,
	}
}

export type { UseIsBookmarkedOptions, UseIsBookmarkedResult }
export { useIsBookmarked }
