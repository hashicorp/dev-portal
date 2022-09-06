import { get, toError } from 'lib/learn-client'
import { Collection, Tutorial } from 'lib/learn-client/types'
import { SessionData } from 'types/auth'
import { PROGRESS_API_ROUTE } from '.'
import { ApiCollectionTutorialProgress } from '../api-types'

interface GetAllProgressOptions {
	accessToken: SessionData['accessToken']
	tutorialIds?: Tutorial['id'][]
	collectionIds?: Collection['id'][]
}

type GetAllProgressResult = ApiCollectionTutorialProgress[]

/**
 * Fetches all bookmarks for the current user. If successful, returns an array
 * of bookmark objects. Otherwise throws an error.
 *
 * https://digital-api-specs.vercel.app/learn#tag/Bookmarks/paths/~1bookmarks/get
 */
const getAllProgress = async ({
	accessToken,
	tutorialIds,
	collectionIds,
}: GetAllProgressOptions): Promise<GetAllProgressResult> => {
	// Add query params to the URL, if applicable
	let url = PROGRESS_API_ROUTE
	const addQueryParams = tutorialIds || collectionIds
	if (addQueryParams) {
		url += '?'
		const params = []
		if (tutorialIds) {
			params.push(`tutorialIds=${tutorialIds.join(',')}`)
		}
		if (collectionIds) {
			params.push(`collectionIds=${collectionIds.join(',')}`)
		}
		url += '?' + params.join('&')
	}
	// Make the GET request
	const requestResult = await get(url, accessToken)

	// Return data as JSON if result is OK
	if (requestResult.ok) {
		const { result } = await requestResult.json()
		return result
	}

	// Throw an error if result is not OK
	const error = await toError(requestResult)
	throw error
}

export type { GetAllProgressOptions, GetAllProgressResult }
export { getAllProgress }
