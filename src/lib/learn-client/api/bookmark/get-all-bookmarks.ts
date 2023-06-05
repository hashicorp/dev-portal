/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Session } from 'next-auth'
import { get, toError } from 'lib/learn-client'
import { BOOKMARK_API_ROUTE } from '.'
import { ApiBookmark } from '../api-types'

interface GetAllBookmarksOptions {
	accessToken: Session['accessToken']
}

type GetAllBookmarksResult = ApiBookmark[]

/**
 * Fetches all bookmarks for the current user. If successful, returns an array
 * of bookmark objects. Otherwise throws an error.
 *
 * https://digital-api-specs.vercel.app/learn#tag/Bookmarks/paths/~1bookmarks/get
 */
const getAllBookmarks = async ({
	accessToken,
}: GetAllBookmarksOptions): Promise<GetAllBookmarksResult> => {
	// Make the GET request
	const requestResult = await get(BOOKMARK_API_ROUTE, accessToken)

	// Return data as JSON if result is OK
	if (requestResult.ok) {
		const { result } = await requestResult.json()
		return result
	}

	// Throw an error if result is not OK
	const error = await toError(requestResult)
	throw error
}

export type { GetAllBookmarksOptions, GetAllBookmarksResult }
export { getAllBookmarks }
