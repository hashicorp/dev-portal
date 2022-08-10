import { useQueries, useQuery } from '@tanstack/react-query'
import { getBookmarks } from 'lib/learn-client/api/bookmark'
import useAuthentication from '../use-authentication'

const useBookmarks = () => {
	const { session } = useAuthentication()
	const token = session?.accessToken

	/**
	 * Fetch all bookmarks.
	 *
	 * https://tanstack.com/query/v4/docs/guides/dependent-queries
	 * https://tanstack.com/query/v4/docs/guides/initial-query-data#staletime-and-initialdataupdatedat
	 */
	const { data: bookmarks, ...restQueryResult } = useQuery(
		['bookmarks'],
		() => getBookmarks(token),
		{
			enabled: !!token,
			staleTime: Infinity,
		}
	)

	// Prime each individual bookmark queries, by tutorial id
	const followUpQueries = []
	bookmarks?.forEach((bookmark) => {
		const { tutorial_id } = bookmark
		followUpQueries.push({
			queryKey: ['bookmark', tutorial_id],
			queryFn: () => bookmark,
			staleTime: Infinity,
		})
	})
	useQueries({
		queries: followUpQueries,
	})

	return { bookmarks, ...restQueryResult }
}

export { useBookmarks }
