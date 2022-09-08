import queryString from 'query-string'
import { get, toError } from 'lib/learn-client'
import { Tutorial, Collection } from 'lib/learn-client/types'
import { SessionData } from 'types/auth'
import { PROGRESS_API_ROUTE } from '.'
import { ApiCollectionTutorialProgress } from '../api-types'

interface GetProgressOptions {
	accessToken: SessionData['accessToken']
	tutorialIds?: Tutorial['id'][]
	collectionIds?: Collection['id'][]
}

type GetProgressResult = ApiCollectionTutorialProgress[]

/**
 * Fetches tutorial progress records for the current user.
 * If successful, returns an array of progress objects.
 * Otherwise throws an error.
 *
 * Accepts optional arrays of `tutorialIds` and `collectionIds`.
 * When either of these are provided, we return all progress records
 * that match either:
 * - any one of the provided `tutorialIds`
 * - any one of the provided `collectionIds`
 *
 * https://digital-api-specs.vercel.app/learn#tag/Progress/paths/~1progress/get
 */
const getProgress = async ({
	accessToken,
	tutorialIds,
	collectionIds,
}: GetProgressOptions): Promise<GetProgressResult> => {
	// Add query params to the URL, if applicable
	let url = PROGRESS_API_ROUTE
	const qs = queryString.stringify(
		{ tutorialIds, collectionIds },
		{ arrayFormat: 'comma' }
	)
	if (qs !== '') {
		url += `?${qs}`
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

export type { GetProgressOptions, GetProgressResult }
export { getProgress }
