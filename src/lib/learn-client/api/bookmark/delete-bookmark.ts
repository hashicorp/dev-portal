import { ApiTutorial } from 'lib/learn-client/api/api-types'
import { destroy, toError } from 'lib/learn-client'
import { BOOKMARK_API_ROUTE } from '.'
import { SessionData } from 'types/auth'

interface DeleteBookmarkOptions {
	accessToken: SessionData['accessToken']
	tutorialId: ApiTutorial['id']
}

type DeleteBookmarkResult = void

/**
 * @TODO document
 */
const deleteBookmark = async ({
	accessToken,
	tutorialId,
}: DeleteBookmarkOptions): Promise<DeleteBookmarkResult> => {
	// Build the API route to make a request to
	const requestRoute = `${BOOKMARK_API_ROUTE}/${tutorialId}`

	// Make the GET request
	const requestResult = await destroy(requestRoute, accessToken)

	// Return if result is OK
	if (requestResult.ok) {
		return
	}

	// Throw an error if result is not OK
	const error = await toError(requestResult)
	throw error
}

export type { DeleteBookmarkOptions, DeleteBookmarkResult }
export { deleteBookmark }
