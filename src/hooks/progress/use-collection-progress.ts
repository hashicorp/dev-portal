import { useQuery, UseQueryResult } from '@tanstack/react-query'
import useAuthentication from 'hooks/use-authentication'
import {
	getAllProgress,
	GetAllProgressResult,
} from 'lib/learn-client/api/progress'
import { Collection } from 'lib/learn-client/types'

type QueryDataType = GetAllProgressResult

interface UseCollectionProgressOptions {
	collectionId: Collection['id']
}

interface UseCollectionProgressResult
	extends Omit<UseQueryResult<QueryDataType>, 'data'> {
	data: UseQueryResult<QueryDataType>['data']
}

/**
 * Handles checking if there is progress for the given `collectionId`.
 */
function useCollectionProgress({
	collectionId,
}: UseCollectionProgressOptions): UseCollectionProgressResult {
	// Get the current user's access token
	const { session } = useAuthentication()
	const accessToken = session?.accessToken

	// Fetch progress records by `collectionId`
	const { data, ...restQueryResult } = useQuery<QueryDataType>(
		['collectionProgress', collectionId],
		() => getAllProgress({ accessToken, collectionIds: [collectionId] }),
		{ enabled: !!accessToken }
	)

	return {
		data,
		...restQueryResult,
	}
}

export type { UseCollectionProgressOptions, UseCollectionProgressResult }
export { useCollectionProgress }
