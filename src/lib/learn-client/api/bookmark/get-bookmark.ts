import { SessionData } from 'types/auth'
import { ApiBookmark, ApiTutorial } from 'lib/learn-client/api/api-types'
import { get, toError } from 'lib/learn-client'
import { errorDevelopmentToast } from 'components/toast'
import { BOOKMARK_API_ROUTE } from '.'

interface GetBookmarkArguments {
	tutorialId: ApiTutorial['id']
	accessToken: SessionData['accessToken']
}

type GetBookmarkResult = null | ApiBookmark

/**
 * Fetches a single bookmark for the given tutorialId using the
 * /bookmarks/:tutorialId GET endpoint.
 */
const getBookmark = async ({
	tutorialId,
	accessToken,
}: GetBookmarkArguments): Promise<GetBookmarkResult> => {
	// Make the GET request
	const requestResult = await get(
		`${BOOKMARK_API_ROUTE}/${tutorialId}`,
		accessToken
	)

	// Return null if the request status is 404
	if (requestResult.status === 404) {
		return null
	}

	// Return the result as JSON if the request status is OK
	if (requestResult.ok) {
		const { result } = await requestResult.json()
		return result
	}

	// Render an error development toast request status is not OK
	// TODO - log to Datadog
	const error = await toError(requestResult)
	errorDevelopmentToast('Error in `getBookmark`', error.toString())
}

export type { GetBookmarkResult }
export { getBookmark }
