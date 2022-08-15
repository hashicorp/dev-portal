import { ApiBookmark, ApiTutorial } from 'lib/learn-client/api/api-types'
import { post, toError } from 'lib/learn-client'
import { BOOKMARK_API_ROUTE } from '.'
import { SessionData } from 'types/auth'

interface CreateBookmarkOptions {
	accessToken: SessionData['accessToken']
	tutorialId: ApiTutorial['id']
}

type CreateBookmarkResult = ApiBookmark

/**
 * @TODO document
 */
const createBookmark = async ({
	accessToken,
	tutorialId,
}: CreateBookmarkOptions): Promise<CreateBookmarkResult> => {
	// Build the API route to make a request to
	const requestRoute = `${BOOKMARK_API_ROUTE}/${tutorialId}`

	// Make the POST request
	const requestResult = await post(requestRoute, accessToken)

	// Return data as JSON if result is OK
	if (requestResult.ok) {
		const { result } = await requestResult.json()
		return result
	}

	// Throw an error if result is not OK
	const error = await toError(requestResult)
	throw error
}

export type { CreateBookmarkOptions, CreateBookmarkResult }
export { createBookmark }
