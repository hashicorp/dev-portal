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
import { TUTORIAL_PROGRESS_QUERY_ID } from './'

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
	// Get the current user's access token
	const { session } = useAuthentication()
	const accessToken = session?.accessToken

	// Fetch a progress records by `tutorialId`, then filter by `collectionId`
	const { data: tutorialProgressStatus, ...restQueryResult } = useQuery<
		GetTutorialProgressResult,
		unknown,
		TutorialProgressStatus
	>(
		[TUTORIAL_PROGRESS_QUERY_ID, tutorialId, collectionId],
		() => getTutorialProgress({ accessToken, tutorialId, collectionId }),
		{
			enabled: !!accessToken,
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
