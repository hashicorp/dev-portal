import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import {
	getAllBookmarks,
	GetAllBookmarksResult,
} from 'lib/learn-client/api/bookmark'
import useAuthentication from 'hooks/use-authentication'

type QueryDataType = GetAllBookmarksResult

interface UseAllBookmarksOptions {
	enabled?: boolean
}

interface UseAllBookmarksResult
	extends Omit<UseQueryResult<QueryDataType>, 'data'> {
	bookmarks: UseQueryResult<QueryDataType>['data']
}

/**
 * Handles fetching and storing all bookmarks with React Query.
 */
const useAllBookmarks = ({
	enabled,
}: UseAllBookmarksOptions): UseAllBookmarksResult => {
	// Get the current Query Client
	const queryClient = useQueryClient()

	// Get the current user's access token
	const { session } = useAuthentication()
	const accessToken = session?.accessToken

	// Set up the `onSuccess` callback
	const onSuccess = (data: QueryDataType) => {
		// Prime each individual bookmark query by tutorial id
		data.forEach((bookmark) => {
			queryClient.setQueryData(['isBookmarked', bookmark.tutorial_id], true)
		})
	}

	// Fetch all bookmarks with the access token
	const { data: bookmarks, ...restQueryResult } = useQuery<QueryDataType>(
		['bookmarks'],
		() => getAllBookmarks({ accessToken }),
		{
			enabled: enabled && !!accessToken,
			onSuccess,
		}
	)

	return {
		bookmarks,
		...restQueryResult,
	}
}

export type { UseAllBookmarksOptions, UseAllBookmarksResult }
export { useAllBookmarks }
