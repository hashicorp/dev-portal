import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import useAuthentication from 'hooks/use-authentication'
import { getProgress, GetProgressResult } from 'lib/learn-client/api/progress'
import { Collection, Tutorial } from 'lib/learn-client/types'
import {
	COLLECTION_PROGRESS_SINGLE_QUERY_ID,
	TUTORIAL_PROGRESS_SINGLE_QUERY_ID,
	PROGRESS_BATCH_QUERY_ID,
} from '../'

type QueryDataType = GetProgressResult

interface UseProgressBatchQueryOptions {
	tutorials?: {
		tutorialId: Tutorial['id']
		collectionId: Collection['id']
	}[]
	collections?: Collection['id'][]
}

interface UseProgressBatchQueryResult
	extends Omit<UseQueryResult<QueryDataType>, 'data'> {
	data: UseQueryResult<QueryDataType>['data']
}

/**
 * Fetches progress records for:
 * - any provided `tutorials` (specific `{ tutorialId, collectionId }` records)
 * - any provided `collections` (any matching `collectionId` records)
 *
 * Uses these records to set query data for:
 * - the provided `tutorials`
 * - the provided `collections`
 *
 * Intended for use at the view level, to prime all known progress queries
 * within a specific view.
 */
function useProgressBatchQuery({
	tutorials = [],
	collections = [],
}: UseProgressBatchQueryOptions): UseProgressBatchQueryResult {
	/**
	 * Get unique tutorial IDs, these will be used to fetch records.
	 *
	 * Note that the API supports fetching in batch by tutorialId OR collectionId.
	 * We aren't able to fetch only specific tutorialId + collectionId
	 * combinations, even though that's often what we want.
	 */
	const tutorialIds = Array.from(
		new Set(tutorials.map((entry) => entry.tutorialId))
	)

	/**
	 * Get unique requested collection IDs
	 */
	const collectionIds = Array.from(new Set(collections))

	// Get the current Query Client
	const queryClient = useQueryClient()

	// Get the current user's access token
	const { session } = useAuthentication()
	const accessToken = session?.accessToken

	/**
	 * After a successful query, prime the requested
	 * tutorial & collection progress queries.
	 */
	const onSuccess = (data: QueryDataType) => {
		/**
		 * Iterate over the requested tutorial entries, setting query data for each.
		 *
		 * Iterating this way allows us to set `null` for tutorial queries where
		 * we know we don't have progress data. If we only set query data for
		 * returned `data` (ie tutorials with progress records), then we'd see
		 * redundant 404 re-fetching when querying those tutorials individually.
		 */
		tutorials.forEach((entry) => {
			const { tutorialId, collectionId } = entry
			const matchedRecords = data.filter(
				(record) =>
					record.tutorial_id == tutorialId &&
					record.collection_id == collectionId
			)
			const matchedRecord = matchedRecords.length > 0 ? matchedRecords[0] : null
			queryClient.setQueryData(
				[TUTORIAL_PROGRESS_SINGLE_QUERY_ID, tutorialId, collectionId],
				matchedRecord // Note: may be null, for tutorials with no progress
			)
		})
		/**
		 * Iterate over the requested collection entries,
		 * setting query data for each.
		 */
		collections.forEach((collectionId) => {
			const matchedRecords = data.filter(
				(record) => record.collection_id == collectionId
			)
			queryClient.setQueryData(
				[COLLECTION_PROGRESS_SINGLE_QUERY_ID, collectionId],
				matchedRecords // Note: may be [], for collections with no progress
			)
		})
	}

	/**
	 * Fetch all progress records.
	 *
	 * Note that filtering will return any record that matches
	 * any provided `tutorialId`, OR any provided `collectionId`.
	 */
	const { data, ...restQueryResult } = useQuery<QueryDataType>(
		[PROGRESS_BATCH_QUERY_ID, { tutorialIds }],
		() => getProgress({ accessToken, tutorialIds, collectionIds }),
		{ enabled: !!accessToken, onSuccess }
	)

	/**
	 * Return the queried data.
	 *
	 * Note: it may not be practical to use data from this query, as passing
	 * it to the necessary components would likely require prop drilling.
	 *
	 * Instead, the intent is for this query to be used at the view level
	 * to prime query data with a single API request. Then, when components
	 * in the view make individual queries, they'll hit the cache rather
	 * than causing a deluge of individual requests.
	 */
	return {
		data,
		...restQueryResult,
	}
}

export type { UseProgressBatchQueryOptions, UseProgressBatchQueryResult }
export { useProgressBatchQuery }
