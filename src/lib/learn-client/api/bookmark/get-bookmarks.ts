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
 * @TODO document
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
	throw error
}

export type { GetBookmarksOptions, GetBookmarksResult }
export { getBookmarks }
