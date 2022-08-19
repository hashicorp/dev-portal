import { useCallback, useState } from 'react'
import Dialog from 'components/dialog'
import useAuthentication from 'hooks/use-authentication'
import { BookmarkButtonProps } from '../types'
import BookmarkSignInPrompt from '../sign-in-dialog'
import { useBookmarkMutations, useIsBookmarked } from 'hooks/bookmarks'
import makeBookmarkToast from 'components/bookmark-button/toast/make-bookmark-toast'

/**
 * This HOC serves as a 'controller'
 * for rendering the various state of bookmark
 * interaction. It accepts a UI component to render,
 * and renders a dialog if unauthenticated.
 */

export function withDialog(BookmarkComponent: React.FC<BookmarkButtonProps>) {
	return function BookmarkComponentWithDialog({
		tutorialId,
	}: {
		tutorialId: BookmarkButtonProps['tutorialId']
	}) {
		const { isAuthenticated, signIn } = useAuthentication()
		const { isBookmarked } = useIsBookmarked({ tutorialId })
		const { addBookmark, removeBookmark } = useBookmarkMutations()
		const [showDialog, setShowDialog] = useState(false)
		const openDialog = () => setShowDialog(true)
		const closeDialog = () => setShowDialog(false)

		const handleOnClick = useCallback(() => {
			if (!isAuthenticated) {
				openDialog()
				return
			}

			if (isBookmarked) {
				removeBookmark(tutorialId, {
					onSuccess: () => makeBookmarkToast('remove'),
				})
			} else {
				addBookmark(tutorialId, {
					onSuccess: () => makeBookmarkToast('add'),
				})
			}
		}, [addBookmark, isAuthenticated, isBookmarked, removeBookmark, tutorialId])

		return (
			<>
				<BookmarkComponent
					handleOnClick={handleOnClick}
					tutorialId={tutorialId}
				/>
				<Dialog
					onDismiss={closeDialog}
					isOpen={showDialog}
					label="Opt out form"
				>
					<BookmarkSignInPrompt
						onDismiss={closeDialog}
						signIn={() => signIn()}
					/>
				</Dialog>
			</>
		)
	}
}
