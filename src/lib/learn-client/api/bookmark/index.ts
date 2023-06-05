/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	createBookmark,
	CreateBookmarkOptions,
	CreateBookmarkResult,
} from './create-bookmark'
import {
	deleteBookmark,
	DeleteBookmarkOptions,
	DeleteBookmarkResult,
} from './delete-bookmark'
import {
	getAllBookmarks,
	GetAllBookmarksOptions,
	GetAllBookmarksResult,
} from './get-all-bookmarks'
import {
	getBookmark,
	GetBookmarkOptions,
	GetBookmarkResult,
} from './get-bookmark'
import {
	getBookmarksByTutorialIds,
	GetBookmarksByTutorialIdsOptions,
	GetBookmarksByTutorialIdsResult,
} from './get-bookmarks-by-tutorial-ids'

export const BOOKMARK_API_ROUTE = '/bookmarks'

export type {
	CreateBookmarkOptions,
	CreateBookmarkResult,
	DeleteBookmarkOptions,
	DeleteBookmarkResult,
	GetAllBookmarksOptions,
	GetAllBookmarksResult,
	GetBookmarkOptions,
	GetBookmarkResult,
	GetBookmarksByTutorialIdsOptions,
	GetBookmarksByTutorialIdsResult,
}
export {
	createBookmark,
	deleteBookmark,
	getAllBookmarks,
	getBookmark,
	getBookmarksByTutorialIds,
}
