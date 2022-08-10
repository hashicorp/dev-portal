import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ApiBookmark, ApiTutorial } from 'lib/learn-client/api/api-types'
import { getBookmark } from 'lib/learn-client/api/bookmark'
import useAuthentication from '../use-authentication'

interface UseIsBookmarkedOptions {
	enabled?: boolean
}

type UseIsBookmarkedResult = Omit<
	UseQueryResult<ApiBookmark | null>,
	'data'
> & {
	isBookmarked: null | boolean
}

const useIsBookmarked = (
	tutorialId: ApiTutorial['id'],
	options?: UseIsBookmarkedOptions
): UseIsBookmarkedResult => {
	const { enabled = true } = options
	const { session } = useAuthentication()

	const accessToken = session?.accessToken
	const queryEnabled = enabled && !!accessToken

	const { data: bookmark, ...restQueryResult } = useQuery(
		['bookmark', tutorialId],
		() => getBookmark({ tutorialId, accessToken }),
		{
			enabled: queryEnabled,
			staleTime: Infinity,
		}
	)

	const isBookmarked = restQueryResult.isFetching ? null : !!bookmark
	return { isBookmarked, ...restQueryResult }
}

export { useIsBookmarked }
