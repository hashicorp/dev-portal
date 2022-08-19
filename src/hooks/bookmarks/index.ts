import { useAllBookmarks, UseAllBookmarksResult } from './use-all-bookmarks'
import {
	useBookmarkMutations,
	UseBookmarkMutationsResult,
} from './use-bookmark-mutations'
import {
	useBookmarksByTutorialIds,
	UseBookmarksByTutorialIdsOptions,
	UseBookmarksByTutorialIdsResult,
} from './use-bookmarks-by-tutorial-ids'
import {
	useIsBookmarked,
	UseIsBookmarkedOptions,
	UseIsBookmarkedResult,
} from './use-is-bookmarked'

export type {
	UseAllBookmarksResult,
	UseBookmarkMutationsResult,
	UseBookmarksByTutorialIdsOptions,
	UseBookmarksByTutorialIdsResult,
	UseIsBookmarkedOptions,
	UseIsBookmarkedResult,
}
export {
	useAllBookmarks,
	useBookmarkMutations,
	useBookmarksByTutorialIds,
	useIsBookmarked,
}
