import { Session } from 'next-auth'
import { ApiBookmark } from 'lib/learn-client/api/api-types'
import { Tutorial } from 'lib/learn-client/types'
import { post, toError } from 'lib/learn-client'
import { BOOKMARK_API_ROUTE } from '.'

interface CreateBookmarkOptions {
	accessToken: Session['accessToken']
	tutorialId: Tutorial['id']
}

type CreateBookmarkResult = ApiBookmark

/**
 * Adds a new bookmark for the given `tutorialId`. If successful, returns the
 * newly created bookmark. Otherwise throws an error.
 *
 * https://digital-api-specs.vercel.app/learn#tag/Bookmarks/paths/~1bookmarks~1{tutorial_id}/post
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
