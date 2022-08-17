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
 * Handles checking if there is a bookmark for the given `tutorialId`.
 */
const useIsBookmarked = ({
	tutorialId,
}: UseIsBookmarkedOptions): UseIsBookmarkedResult => {
	// Load up all bookmarks
	const { bookmarks, isFetched: bookmarksAreFetched } = useAllBookmarks()

	/**
	 * After bookmarks are fetched, query for bookmark for the given `tutorialId`.
	 * Query is disabled until bookmarks have finished fetching.
	 *
	 * @TODO Optimize. Iterating over all bookmarks for every `tutorialId` is not
	 * efficient.
	 */
	const { data: isBookmarked, ...restQueryResult } = useQuery(
		['isBookmarked', tutorialId],
		() => !!bookmarks.find((bookmark) => bookmark.tutorial_id === tutorialId),
		{ enabled: bookmarksAreFetched }
	)

	return {
		isBookmarked,
		...restQueryResult,
	}
}

export type { UseIsBookmarkedOptions, UseIsBookmarkedResult }
export { useIsBookmarked }
