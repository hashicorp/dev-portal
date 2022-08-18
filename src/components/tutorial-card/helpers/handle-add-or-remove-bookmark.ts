import makeBookmarkToast from 'components/bookmark-button/toast/make-bookmark-toast'

export function handleAddOrRemoveBookmark(
	isBookmarked: boolean,
	tutorialId: string
) {
	if (isBookmarked) {
		// removeBookmark(tutorialId, token)
		console.log(`removing bookmark for tutorial: ${tutorialId}`)
		// if successful, make toast
		makeBookmarkToast('remove')
	} else {
		// createBookmark(tutorialId, token)
		console.log(`adding bookmark for tutorial: ${tutorialId}`)
		// if successful, make toast
		makeBookmarkToast('add')
	}
}
