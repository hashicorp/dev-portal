import { ApiBookmark, ApiTutorial } from 'lib/learn-client/api/api-types'
import { post, toError } from 'lib/learn-client'
import { errorDevelopmentToast } from 'components/toast'
import { BOOKMARK_API_ROUTE } from '.'
import { SessionData } from 'types/auth'

interface CreateBookmarkArguments {
	tutorialId: ApiTutorial['id']
	accessToken: SessionData['accessToken']
}

type CreateBookmarkResult = ApiBookmark

/**
 * Creates a new bookmark using the /bookmarks/:tutorialId POST endpoint.
 */
const createBookmark = async ({
	tutorialId,
	accessToken,
}: CreateBookmarkArguments): Promise<CreateBookmarkResult> => {
	// Make the POST request
	const requestResult = await post(
		`${BOOKMARK_API_ROUTE}/${tutorialId}`,
		accessToken
	)

	// Return the result as JSON if the request status is OK
	if (requestResult.ok) {
		const { result } = await requestResult.json()
		return result
	}

	// Render an error development toast request status is not OK
	// TODO - log to Datadog
	const error = await toError(requestResult)
	errorDevelopmentToast('Error in `createBookmark`', error.toString())
}

export type { CreateBookmarkResult }
export { createBookmark }
