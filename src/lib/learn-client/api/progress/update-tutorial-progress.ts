import { put, toError } from 'lib/learn-client'
import {
	Collection,
	Tutorial,
	TutorialProgressPercent,
} from 'lib/learn-client/types'
import { SessionData } from 'types/auth'
import { ApiCollectionTutorialProgress } from '../api-types'
import { getTutorialProgressRoute } from './util'

interface UpdateTutorialProgressOptions {
	accessToken: SessionData['accessToken']
	tutorialId: Tutorial['id']
	collectionId: Collection['id']
	completePercent: TutorialProgressPercent
}

type UpdateTutorialProgressResult = null | ApiCollectionTutorialProgress

/**
 * Updates a tutorial progress record.
 *
 * https://digital-api-specs.vercel.app/learn#tag/Collection-Tutorial-Progress/paths/~1collections~1{collection_id}~1tutorials~1{tutorial_id}~1progress/put
 */
const updateTutorialProgress = async ({
	accessToken,
	tutorialId,
	collectionId,
	completePercent,
}: UpdateTutorialProgressOptions): Promise<UpdateTutorialProgressResult> => {
	// Build the API route to make a request to
	const requestRoute = getTutorialProgressRoute({ collectionId, tutorialId })

	// Make the request
	const requestResult = await put(requestRoute, accessToken, {
		complete_percent: completePercent,
	})

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

export type { UpdateTutorialProgressOptions, UpdateTutorialProgressResult }
export { updateTutorialProgress }
