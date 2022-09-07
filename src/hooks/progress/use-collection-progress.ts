import { useQuery, UseQueryResult } from '@tanstack/react-query'
import useAuthentication from 'hooks/use-authentication'
import {
	getAllProgress,
	GetAllProgressResult,
} from 'lib/learn-client/api/progress'
import { Collection } from 'lib/learn-client/types'
import {
	PROGRESS_BATCH_QUERY_ID,
	COLLECTION_PROGRESS_SINGLE_QUERY_ID,
} from './'
import { useHasWaitedForQuery } from 'hooks/use-has-waited-for-query'

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
	/**
	 * Get the current user's access token, and the batch query status.
	 * We enable the query only if:
	 * - an accessToken is present
	 * - a batch query, if one exists, has been attempted
	 */
	const { session } = useAuthentication()
	const accessToken = session?.accessToken
	const hasBatchQueryAttempt = useHasWaitedForQuery([PROGRESS_BATCH_QUERY_ID])
	const enabled = !!accessToken && hasBatchQueryAttempt

	// Fetch progress records by `collectionId`
	const { data, ...restQueryResult } = useQuery<QueryDataType>(
		[COLLECTION_PROGRESS_SINGLE_QUERY_ID, collectionId],
		() => getAllProgress({ accessToken, collectionIds: [collectionId] }),
		{ enabled }
	)

	return {
		data,
		...restQueryResult,
	}
}

export type { UseCollectionProgressOptions, UseCollectionProgressResult }
export { useCollectionProgress }
