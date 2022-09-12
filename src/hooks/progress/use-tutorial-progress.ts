import { useCallback } from 'react'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import useAuthentication from 'hooks/use-authentication'
import { ApiCollectionTutorialProgress } from 'lib/learn-client/api/api-types'
import {
	getTutorialProgress,
	GetTutorialProgressResult,
	progressPercentToStatus,
} from 'lib/learn-client/api/progress'
import {
	TutorialIdCollectionId,
	TutorialProgressStatus,
} from 'lib/learn-client/types'
import { PROGRESS_BATCH_QUERY_ID, TUTORIAL_PROGRESS_SINGLE_QUERY_ID } from './'
import { useHasWaitedForQuery } from 'hooks/use-has-waited-for-query'

interface UseTutorialProgressResult
	extends Omit<UseQueryResult<TutorialProgressStatus>, 'data'> {
	tutorialProgressStatus: UseQueryResult<TutorialProgressStatus>['data']
}

/**
 * Handles checking if there is a progress for the given
 * `tutorialId` & `collectionId` combination.
 */
const useTutorialProgress = ({
	tutorialId,
	collectionId,
}: TutorialIdCollectionId): UseTutorialProgressResult => {
	/**
	 * Get the current user's access token, and the batch query status.
	 * We enable the query only if:
	 * - an accessToken is present
	 * - a batch query, if one exists, has been attempted
	 */
	const { session } = useAuthentication()
	const accessToken = session?.accessToken
	const hasWaitedForBatchQuery = useHasWaitedForQuery([PROGRESS_BATCH_QUERY_ID])
	const enabled = !!accessToken && hasWaitedForBatchQuery

	/**
	 * Fetch the progress record, if any, for the specified tutorialId
	 * in the specific collectionId context.
	 */
	const { data: tutorialProgressStatus, ...restQueryResult } = useQuery<
		GetTutorialProgressResult,
		unknown,
		TutorialProgressStatus
	>(
		[TUTORIAL_PROGRESS_SINGLE_QUERY_ID, tutorialId, collectionId],
		useCallback(
			() => getTutorialProgress({ accessToken, tutorialId, collectionId }),
			[accessToken, tutorialId, collectionId]
		),
		{
			enabled,
			select: (data: ApiCollectionTutorialProgress) => {
				/**
				 * Data may be null, if a progress record does not exist
				 * for this tutorialId + collectionId combination.
				 *
				 * We pass this on to the query consumer, as they may need
				 * to know whether the record exists or not.
				 */
				if (data == null) {
					return null
				}
				return progressPercentToStatus(data.complete_percent)
			},
		}
	)

	return {
		tutorialProgressStatus,
		...restQueryResult,
	}
}

export { useTutorialProgress }
