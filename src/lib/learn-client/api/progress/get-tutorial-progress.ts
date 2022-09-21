import { get, toError } from 'lib/learn-client'
import { Collection, Tutorial } from 'lib/learn-client/types'
import { SessionData } from 'types/auth'
import { ApiCollectionTutorialProgress } from '../api-types'
import { getTutorialProgressRoute } from './util'

interface GetTutorialProgressOptions {
	accessToken: SessionData['accessToken']
	tutorialId: Tutorial['id']
	collectionId: Collection['id']
}

type GetTutorialProgressResult = null | ApiCollectionTutorialProgress

/**
 * Fetches progress on a single tutorial.
 *
 * https://digital-api-specs.vercel.app/learn#tag/Collection-Tutorial-Progress/paths/~1collections~1{collection_id}~1tutorials~1{tutorial_id}~1progress/get
 */
const getTutorialProgress = async ({
	accessToken,
	tutorialId,
	collectionId,
}: GetTutorialProgressOptions): Promise<GetTutorialProgressResult> => {
	// Build the API route to make a request to
	const requestRoute = getTutorialProgressRoute({ collectionId, tutorialId })

	// Make the request
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
