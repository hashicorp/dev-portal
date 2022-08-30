import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import useAuthentication from 'hooks/use-authentication'
import { ApiCollectionTutorialProgress } from 'lib/learn-client/api/api-types'
import {
	getAllProgress,
	GetAllProgressResult,
} from 'lib/learn-client/api/progress'
import {
	groupRecordsByKey,
	// parseTutorialProgressAnyCollection,
	parseCollectionProgress,
	progressPercentToLabel,
} from 'lib/learn-client/api/progress/formatting'

type QueryDataType = GetAllProgressResult

interface UseAllProgressOptions {
	enabled?: boolean
}

interface UseAllProgressResult
	extends Omit<UseQueryResult<QueryDataType>, 'data'> {
	progress: UseQueryResult<QueryDataType>['data']
}

/**
 * Handles fetching all progress with React Query.
 */
const useAllProgress = ({
	enabled = true,
}: UseAllProgressOptions): UseAllProgressResult => {
	// Get the current Query Client
	const queryClient = useQueryClient()

	// Get the current user's access token
	const { session } = useAuthentication()
	const accessToken = session?.accessToken

	// Set up the `onSuccess` callback
	// TODO: what to do on success for all progress?
	//
	// perhaps:
	// - prime each individual tutorialId+collectionId combination, like:
	// queryClient.setQueryData(['progress', tutorial_id, collection_id ], complete_percent)
	//
	// - prime each collectionId with "tutorials completed", perhaps?
	// or should processing the raw tutorialID + collectionID record results
	// into meaningful X / TOTAL collection progress be the concern of utility
	// functions? I feel like using util functions makes sense as a starting
	// point. Those util functions could be called here, as part of the
	// setQueryData, or not and they would have to be called after the
	// data is queried in any consuming components. Latter seems more flexible,
	// and important thing is we have cleanly separated utility functions.
	//
	// We should still prime each collection though.
	// Collect all records relevant to each collection (array of all records
	// becomes object by collectionID, each with array of relevant records),
	// and then setQueryData:
	// const relevantRecords = recordsToObjByCollectionId(data)
	// ... then iterate over object key-value, where key is collection_id
	// and relevant records value is ApiCollectionTutorialProgress[]
	// queryClient.setQueryData(['progress', collection_id], relevantRecords)
	//
	// We could do the same for tutorials, without collectionId.
	// Collect all records relevant to a tutorial (may be many if there
	// are different collection contexts) and set those on tutorial_id only.
	// No known use case for this at the moment though, i don't think?
	// const relevantRecords = recordsToObjByTutorialId(data)
	// ... then iterate over object key-value, where key is tutorial_id
	// and relevant records value is ApiCollectionTutorialProgress[]
	// queryClient.setQueryData(['progress', tutorial_id], relevantRecords)

	//
	const onSuccess = (data: QueryDataType) => {
		// Prime individual tutorial progress in specific collections
		data.forEach((record: ApiCollectionTutorialProgress) => {
			const { tutorial_id, collection_id, complete_percent } = record
			// Map the bestProgressPercent to a progress state we show in UI
			const tutorialProgressLabel = progressPercentToLabel(complete_percent)
			queryClient.setQueryData(
				['tutorialProgressSpecificCollection', tutorial_id, collection_id],
				tutorialProgressLabel
			)
		})

		// Prime collection progress, which are completed tutorial counts
		const recordsByCollectionId = groupRecordsByKey(data, 'collection_id')
		Object.keys(recordsByCollectionId).forEach((collectionId) => {
			// There may be multiple records
			const completedTutorialsCount = parseCollectionProgress(
				recordsByCollectionId[collectionId]
			)
			// Set the query data for each collectionId
			queryClient.setQueryData(
				['collectionProgress', collectionId],
				completedTutorialsCount
			)
		})
	}

	// Fetch all progress with the access token
	const { data: progress, ...restQueryResult } = useQuery<QueryDataType>(
		['allProgress'],
		() => getAllProgress({ accessToken }),
		{
			enabled: enabled && !!accessToken,
			onSuccess,
		}
	)

	return {
		progress,
		...restQueryResult,
	}
}

export type { UseAllProgressOptions, UseAllProgressResult }
export { useAllProgress }
