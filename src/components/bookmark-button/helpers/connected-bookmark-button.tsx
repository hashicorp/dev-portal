import { useCallback, useState } from 'react'
import { Tutorial } from 'lib/learn-client/types'
import useAuthentication from 'hooks/use-authentication'
import { useBookmarkMutations, useIsBookmarked } from 'hooks/bookmarks'
import Dialog from 'components/dialog'
import { BookmarkButtonProps } from '../types'
import BookmarkSignInPrompt from '../sign-in-dialog'
import makeBookmarkToast from '../toast/make-bookmark-toast'

/**
 * This HOC serves as a 'controller'
 * for rendering the various state of bookmark
 * interaction. It accepts a UI component to render and
 * fetches the tutorial bookmark state.
 *
 * When clicked, it renders a dialog if unauthenticated,
 * and updates data when authenticated.
 */

export function Connected(BookmarkComponent: React.FC<BookmarkButtonProps>) {
	return function ConnectedBookmarkComponent({
		tutorialId,
	}: {
		tutorialId: Tutorial['id']
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
					isBookmarked={isBookmarked}
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
