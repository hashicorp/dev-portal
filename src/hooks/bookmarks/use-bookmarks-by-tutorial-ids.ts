import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { Tutorial } from 'lib/learn-client/types'
import {
	getBookmarksByTutorialIds,
	GetBookmarksByTutorialIdsResult,
} from 'lib/learn-client/api/bookmark'
import useAuthentication from 'hooks/use-authentication'

type QueryDataType = GetBookmarksByTutorialIdsResult

interface UseBookmarksByTutorialIdsOptions {
	enabled?: boolean
	tutorialIds: Tutorial['id'][]
}

interface UseBookmarksByTutorialIdsResult
	extends Omit<UseQueryResult<QueryDataType>, 'data'> {
	bookmarks: UseQueryResult<QueryDataType>['data']
}

/**
 * Handles fetching and storing bookmarks with React Query for the given
 * `tutorialIds`.
 */
const useBookmarksByTutorialIds = ({
	enabled = true,
	tutorialIds,
}: UseBookmarksByTutorialIdsOptions): UseBookmarksByTutorialIdsResult => {
	// Get the current Query Client
	const queryClient = useQueryClient()

	// Get the current user's access token
	const { isAuthenticated, accessToken } = useAuthentication()

	// Set up the `onSuccess` callback
	const onSuccess = (data: QueryDataType) => {
		// Prime each individual `isBookmarked` query by tutorial id
		tutorialIds.forEach((tutorialId) => {
			const isBookmarked = !!data.find(
				(bookmark) => bookmark.tutorial_id === tutorialId
			)
			queryClient.setQueryData(['isBookmarked', tutorialId], isBookmarked)
		})
	}

	// Fetch bookmarks for the given tutorial ids with the access token
	const { data: bookmarks, ...restQueryResult } = useQuery<QueryDataType>(
		['bookmarks', { tutorialIds }],
		() => getBookmarksByTutorialIds({ accessToken, tutorialIds }),
		{
			enabled: enabled && isAuthenticated && !!accessToken,
			onSuccess,
		}
	)

	return {
		bookmarks,
		...restQueryResult,
	}
}

export type {
	UseBookmarksByTutorialIdsOptions,
	UseBookmarksByTutorialIdsResult,
}
export { useBookmarksByTutorialIds }
