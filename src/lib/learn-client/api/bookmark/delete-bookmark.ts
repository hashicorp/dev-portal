/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Session } from 'next-auth'
import { Tutorial } from 'lib/learn-client/types'
import { destroy, toError } from 'lib/learn-client'
import { BOOKMARK_API_ROUTE } from '.'

interface DeleteBookmarkOptions {
	accessToken: Session['accessToken']
	tutorialId: Tutorial['id']
}

type DeleteBookmarkResult = void

/**
 * Deletes the bookmark for the given `tutorialId`. If successful, returns
 * nothing. Otherwise throws an error.
 *
 * https://digital-api-specs.vercel.app/learn#tag/Bookmarks/paths/~1bookmarks~1{tutorial_id}/delete
 */
const deleteBookmark = async ({
	accessToken,
	tutorialId,
}: DeleteBookmarkOptions): Promise<DeleteBookmarkResult> => {
	// Build the API route to make a request to
	const requestRoute = `${BOOKMARK_API_ROUTE}/${tutorialId}`

	// Make the DELETE request
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
