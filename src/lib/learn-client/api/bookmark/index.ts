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
	getBookmark,
	GetBookmarkOptions,
	GetBookmarkResult,
} from './get-bookmark'
import {
	getBookmarks,
	GetBookmarksOptions,
	GetBookmarksResult,
} from './get-bookmarks'

export const BOOKMARK_API_ROUTE = '/bookmarks'

export type {
	CreateBookmarkOptions,
	CreateBookmarkResult,
	DeleteBookmarkOptions,
	DeleteBookmarkResult,
	GetBookmarkOptions,
	GetBookmarkResult,
	GetBookmarksOptions,
	GetBookmarksResult,
}
export { createBookmark, deleteBookmark, getBookmark, getBookmarks }
