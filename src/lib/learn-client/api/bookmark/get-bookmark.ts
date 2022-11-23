import { get, toError } from 'lib/learn-client'
import { Tutorial } from 'lib/learn-client/types'
import { Session } from 'next-auth'
import { BOOKMARK_API_ROUTE } from '.'
import { ApiBookmark } from '../api-types'

interface GetBookmarkOptions {
	accessToken: Session['accessToken']
	tutorialId: Tutorial['id']
}

type GetBookmarkResult = null | ApiBookmark

/**
 * Fetches a bookmark for the given `tutorialId`. If a bookmark is found, then
 * it is returned. If no bookmark is found, then `null` is returned. Otherwise
 * throws an error.
 *
 * https://digital-api-specs.vercel.app/learn#tag/Bookmarks/paths/~1bookmarks~1{tutorial_id}/get
 */
const getBookmark = async ({
	accessToken,
	tutorialId,
}: GetBookmarkOptions): Promise<GetBookmarkResult> => {
	// Build the API route to make a request to
	const requestRoute = `${BOOKMARK_API_ROUTE}/${tutorialId}`

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

export type { GetBookmarkOptions, GetBookmarkResult }
export { getBookmark }
