import { post, toError } from 'lib/learn-client'
import {
	Collection,
	Tutorial,
	TutorialProgressPercent,
} from 'lib/learn-client/types'
import { SessionData } from 'types/auth'
import { ApiCollectionTutorialProgress } from '../api-types'
import { getTutorialProgressRoute } from './util'

interface CreateTutorialProgressOptions {
	accessToken: SessionData['accessToken']
	tutorialId: Tutorial['id']
	collectionId: Collection['id']
	completePercent: TutorialProgressPercent
}

type CreateTutorialProgressResult = null | ApiCollectionTutorialProgress

/**
 * Creates a tutorial progress record.
 *
 * https://digital-api-specs.vercel.app/learn#tag/Collection-Tutorial-Progress/paths/~1collections~1{collection_id}~1tutorials~1{tutorial_id}~1progress/post
 */
const createTutorialProgress = async ({
	accessToken,
	tutorialId,
	collectionId,
	completePercent,
}: CreateTutorialProgressOptions): Promise<CreateTutorialProgressResult> => {
	// Build the API route to make a request to
	const requestRoute = getTutorialProgressRoute({ collectionId, tutorialId })

	// Make the request
	const requestResult = await post(requestRoute, accessToken, {
		complete_percent: completePercent,
	})

	// Return data as JSON if result is OK
	if (requestResult.ok) {
		const { result } = await requestResult.json()
		return result
	}

	// Throw an error if result is not OK
	const error = await toError(requestResult)
	throw error
}

export type { CreateTutorialProgressOptions, CreateTutorialProgressResult }
export { createTutorialProgress }
