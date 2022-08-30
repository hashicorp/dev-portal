import { useQuery, UseQueryResult } from '@tanstack/react-query'
import useAuthentication from 'hooks/use-authentication'
import {
	getAllProgress,
	GetAllProgressResult,
} from 'lib/learn-client/api/progress'
import {
	TutorialIdCollectionId,
	TutorialProgressLabel,
} from 'lib/learn-client/types'
import { parseTutorialProgress } from 'lib/learn-client/api/progress/formatting'

type QueryDataType = TutorialProgressLabel | null

interface UseTutorialProgressResult
	extends Omit<UseQueryResult<QueryDataType>, 'data'> {
	tutorialProgressLabel: UseQueryResult<QueryDataType>['data']
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
	const { data: tutorialProgressLabel, ...restQueryResult } =
		useQuery<QueryDataType>(
			['tutorialProgressSpecificCollection', tutorialId, collectionId],
			() =>
				getAllProgress({ accessToken, tutorialIds: [tutorialId] }).then(
					(data: GetAllProgressResult) => {
						return parseTutorialProgress(data, tutorialId, collectionId)
					}
				),
			{ enabled: !!accessToken }
		)

	return {
		tutorialProgressLabel,
		...restQueryResult,
	}
}

export { useTutorialProgress }
