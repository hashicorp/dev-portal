import { useCallback, useState } from 'react'
import Dialog from 'components/dialog'
import useAuthentication from 'hooks/use-authentication'
import { BookmarkButtonProps } from '../types'
import BookmarkSignInPrompt from '../sign-in-dialog'

/**
 * This HOC serves as a 'controller'
 * for rendering the various state of bookmark
 * interaction. It accepts a UI component to render,
 * and renders a dialog if unauthenticed
 *
 * Eventually this could be extended to
 * post / delete based on interactions and
 * trigger toast notifications based on the result.
 */

export function withDialog(BookmarkComponent: React.FC<BookmarkButtonProps>) {
	return function BookmarkComponentWithDialog({
		isBookmarked,
	}: Pick<BookmarkButtonProps, 'isBookmarked'>) {
		const { isAuthenticated, signIn } = useAuthentication()
		const [showDialog, setShowDialog] = useState(false)
		const openDialog = () => setShowDialog(true)
		const closeDialog = () => setShowDialog(false)
		const handleOnClick = useCallback(() => {
			if (!isAuthenticated) {
				// prompt login if not authenticated
				openDialog()
			} else {
				/**
				 * TODO: hook up data state here
				 * or via a passed handler
				 * 	if (isBookmarked) {
				 * 	//remove the bookmark
				 * } else {
				 *	//create the bookmark
				 * }
				 *
				 * And upon success creating or deleting,
				 * make toast!
				 */
			}
		}, [isAuthenticated])

		return (
			<>
				<BookmarkComponent
					isBookmarked={isBookmarked}
					handleOnClick={handleOnClick}
				/>
				{showDialog ? (
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
				) : null}
			</>
		)
	}
}
