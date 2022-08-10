import { ApiBookmark } from 'lib/learn-client/api/api-types'
import { get, toError } from 'lib/learn-client'
import { errorDevelopmentToast } from 'components/toast'
import { BOOKMARK_API_ROUTE } from '.'
import { SessionData } from 'types/auth'

/**
 * Fetches all bookmarks using the /bookmarks GET endpoint.
 */
const getBookmarks = async (
	accessToken: SessionData['accessToken']
): Promise<ApiBookmark[]> => {
	// Make the GET request
	const requestResult = await get(BOOKMARK_API_ROUTE, accessToken)

	// Return the result as JSON if the request status is OK
	if (requestResult.ok) {
		const { result } = await requestResult.json()
		return result
	}

	// Render an error development toast request status is not OK
	// TODO - log to Datadog
	const error = await toError(requestResult)
	errorDevelopmentToast('Error in `getBookmarks`', error.toString())
}

export { getBookmarks }
