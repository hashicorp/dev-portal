import { useQueries, useQuery, UseQueryResult } from '@tanstack/react-query'
import { ApiBookmark } from 'lib/learn-client/api/api-types'
import { getAllBookmarks } from 'lib/learn-client/api/bookmark'
import useAuthentication from 'hooks/use-authentication'

interface UseAllBookmarksResult extends Omit<UseQueryResult, 'data'> {
	bookmarks: undefined | ApiBookmark[]
}

/**
 * @TODO document
 */
const useAllBookmarks = (): UseAllBookmarksResult => {
	// Get the current user's access token
	const { session } = useAuthentication()
	const accessToken = session?.accessToken

	// Fetch all bookmarks with the access token
	const { data: bookmarks, ...restQueryResult } = useQuery(
		['bookmarks'],
		() => getAllBookmarks({ accessToken }),
		{ enabled: !!accessToken }
	)

	return {
		bookmarks,
		...restQueryResult,
	}
}

export type { UseAllBookmarksResult }
export { useAllBookmarks }
