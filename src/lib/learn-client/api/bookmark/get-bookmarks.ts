import { get, toError } from 'lib/learn-client'
import { SessionData } from 'types/auth'
import { BOOKMARK_API_ROUTE } from '.'
import { ApiBookmark, ApiTutorial } from '../api-types'

interface GetBookmarksOptions {
	accessToken: SessionData['accessToken']
	tutorialIds?: ApiTutorial['id'][]
}

type GetBookmarksResult = ApiBookmark[]

/**
 * Fetches bookmarks based on given `tutorialIds`. If none are provided, then
 * all bookmarks will be fetched. If some `tutorialIds` are provided, then they
 * will be passed in the comma-separated `tutorialIds` query parameter.
 *
 * If successful, then an array of bookmark objects is returned. Otherwise
 * throws an error.
 *
 * https://digital-api-specs.vercel.app/learn#tag/Bookmarks/paths/~1bookmarks/get
 */
const getBookmarks = async ({
	accessToken,
	tutorialIds,
}: GetBookmarksOptions): Promise<GetBookmarksResult> => {
	// Build the API route to make a request to
	let requestRoute = BOOKMARK_API_ROUTE
	if (tutorialIds && tutorialIds.length > 0) {
		const commaSeparatedIds = tutorialIds?.join(',')
		requestRoute = `${requestRoute}?tutorialIds=${commaSeparatedIds}`
	}

	// Make the GET request
	const requestResult = await get(requestRoute, accessToken)

	// Return data as JSON if result is OK
	if (requestResult.ok) {
		const { result } = await requestResult.json()
		return result
	}

	// Throw an error if result is not OK
	const error = await toError(requestResult)
	console.log(error)
	// throw error
}

export type { GetBookmarksOptions, GetBookmarksResult }
export { getBookmarks }
