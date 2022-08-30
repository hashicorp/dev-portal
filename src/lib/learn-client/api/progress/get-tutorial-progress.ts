import { get, toError } from 'lib/learn-client'
import { Collection, Tutorial } from 'lib/learn-client/types'
import { SessionData } from 'types/auth'
import { TUTORIAL_PROGRESS_ROUTE } from '.'
import { ApiCollectionTutorialProgress } from '../api-types'

interface GetTutorialProgressOptions {
	accessToken: SessionData['accessToken']
	tutorialId: Tutorial['id']
	collectionId: Collection['id']
}

type GetTutorialProgressResult = null | ApiCollectionTutorialProgress

/**
 * Fetches a tutorial progress record
 */
const getTutorialProgress = async ({
	accessToken,
	tutorialId,
	collectionId,
}: GetTutorialProgressOptions): Promise<GetTutorialProgressResult> => {
	// Build the API route to make a request to
	const requestRoute = TUTORIAL_PROGRESS_ROUTE({ collectionId, tutorialId })

	// Make the GET request
	const requestResult = await get(requestRoute, accessToken)

	// Return null if the request status is 404
	if (requestResult.status === 404) {
		return null
	}

	// Return data as JSON if result is OK
	if (requestResult.ok) {
		const { result } = await requestResult.json()
		return result
	}

	// Throw an error if result is not OK
	const error = await toError(requestResult)
	throw error
}

export type { GetTutorialProgressOptions, GetTutorialProgressResult }
export { getTutorialProgress }
