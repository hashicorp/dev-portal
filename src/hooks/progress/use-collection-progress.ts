import { useQuery, UseQueryResult } from '@tanstack/react-query'
import useAuthentication from 'hooks/use-authentication'
import { getAllProgress } from 'lib/learn-client/api/progress'
import { Collection } from 'lib/learn-client/types'
import { parseCollectionProgress } from 'lib/learn-client/api/progress/formatting'

type CollectionProgress = number
type QueryDataType = CollectionProgress

interface UseCollectionProgressOptions {
	collectionId: Collection['id']
}

interface UseCollectionProgressResult
	extends Omit<UseQueryResult<QueryDataType>, 'data'> {
	completedTutorialCount: UseQueryResult<QueryDataType>['data']
}

/**
 * Handles checking if there is progress for the given `collectionId`.
 */
const useCollectionProgress = ({
	collectionId,
}: UseCollectionProgressOptions): UseCollectionProgressResult => {
	// Get the current user's access token
	const { session } = useAuthentication()
	const accessToken = session?.accessToken

	// Fetch progress records by `collectionId`
	const { data: completedTutorialCount, ...restQueryResult } =
		useQuery<QueryDataType>(
			['collectionProgress', collectionId],
			() =>
				getAllProgress({ accessToken, collectionIds: [collectionId] }).then(
					(data) => {
						return parseCollectionProgress(data)
					}
				),
			{ enabled: !!accessToken }
		)

	return {
		completedTutorialCount,
		...restQueryResult,
	}
}

export type { UseCollectionProgressOptions, UseCollectionProgressResult }
export { useCollectionProgress }
