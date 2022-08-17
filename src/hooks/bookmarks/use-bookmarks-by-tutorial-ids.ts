import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ApiBookmark, ApiTutorial } from 'lib/learn-client/api/api-types'
import { getBookmarksByTutorialIds } from 'lib/learn-client/api/bookmark'
import useAuthentication from 'hooks/use-authentication'

interface UseBookmarksByTutorialIdsOptions {
	tutorialIds: ApiTutorial['id'][]
}

interface UseBookmarksByTutorialIdsResult extends Omit<UseQueryResult, 'data'> {
	bookmarks: undefined | ApiBookmark[]
}

/**
 * Handles fetching and storing bookmarks with React Query for the given
 * `tutorialIds`.
 */
const useBookmarksByTutorialIds = ({
	tutorialIds,
}: UseBookmarksByTutorialIdsOptions): UseBookmarksByTutorialIdsResult => {
	// Get the current user's access token
	const { session } = useAuthentication()
	const accessToken = session?.accessToken

	// Fetch all bookmarks with the access token
	const { data: bookmarks, ...restQueryResult } = useQuery(
		['bookmarks'],
		() => getBookmarksByTutorialIds({ accessToken, tutorialIds }),
		{ enabled: !!accessToken }
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
