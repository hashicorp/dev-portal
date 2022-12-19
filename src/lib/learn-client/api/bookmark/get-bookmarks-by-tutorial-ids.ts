import { Session } from 'next-auth'
import { get, toError } from 'lib/learn-client'
import { Tutorial } from 'lib/learn-client/types'
import { BOOKMARK_API_ROUTE } from '.'
import { ApiBookmark } from '../api-types'

interface GetBookmarksByTutorialIdsOptions {
	accessToken: Session['accessToken']
	tutorialIds: Tutorial['id'][]
}

type GetBookmarksByTutorialIdsResult = ApiBookmark[]

/**
 * Fetches bookmarks for the given `tutorialIds`. If successful, returns an
 * array of bookmark objects. Otherwise throws an error.
 *
 * https://digital-api-specs.vercel.app/learn#tag/Bookmarks/paths/~1bookmarks/get
 */
const getBookmarksByTutorialIds = async ({
	accessToken,
	tutorialIds,
}: GetBookmarksByTutorialIdsOptions): Promise<GetBookmarksByTutorialIdsResult> => {
	// Build the API route to make a request to
	const commaSeparatedIds = tutorialIds.join(',')
	const requestRoute = `${BOOKMARK_API_ROUTE}?tutorialIds=${commaSeparatedIds}`

	// Make the GET request
	const requestResult = await get(requestRoute, accessToken)

	// Return data as JSON if result is OK
	if (requestResult.ok) {
		const { result } = await requestResult.json()
		return result
	}

	// Throw an error if result is not OK
	const error = await toError(requestResult)
	throw error
}

export type {
	GetBookmarksByTutorialIdsOptions,
	GetBookmarksByTutorialIdsResult,
}
export { getBookmarksByTutorialIds }
