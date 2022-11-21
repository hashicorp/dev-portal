import { useQuery, UseQueryResult } from '@tanstack/react-query'
import useAuthentication from 'hooks/use-authentication'
import { getBookmark } from 'lib/learn-client/api/bookmark'
import { Tutorial } from 'lib/learn-client/types'

type QueryDataType = boolean

interface UseIsBookmarkedOptions {
	tutorialId: Tutorial['id']
}

interface UseIsBookmarkedResult
	extends Omit<UseQueryResult<QueryDataType>, 'data'> {
	isBookmarked: UseQueryResult<QueryDataType>['data']
}

/**
 * Handles checking if there is a bookmark for the given `tutorialId`.
 */
const useIsBookmarked = ({
	tutorialId,
}: UseIsBookmarkedOptions): UseIsBookmarkedResult => {
	// Get the current user's access token
	const { isAuthenticated, token: accessToken } = useAuthentication()

	// Fetch a single bookmark by tutorial id
	const { data: isBookmarked, ...restQueryResult } = useQuery<QueryDataType>(
		['isBookmarked', tutorialId],
		() =>
			getBookmark({ accessToken, tutorialId }).then((bookmark) => !!bookmark),
		{ enabled: isAuthenticated && !!accessToken }
	)

	return {
		isBookmarked,
		...restQueryResult,
	}
}

export type { UseIsBookmarkedOptions, UseIsBookmarkedResult }
export { useIsBookmarked }
