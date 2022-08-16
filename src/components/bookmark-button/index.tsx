import { AUTH_ENABLED } from 'hooks/use-authentication'
import { RemoveBookmarkIcon, AddBookmarkIcon } from './icons'
import s from './bookmark-button.module.css'
import BookmarkSignInDialog from './sign-in-dialog'
import { useState } from 'react'
import Dialog from 'components/dialog'
import Heading from 'components/heading'
import OptOutForm from 'components/opt-in-out/components/opt-out-form'
import BookmarkSignInPrompt from './sign-in-dialog'

/**
 * TODO
 * - create a 'plugged' in HOC that can render modals, update bookmark state etc.
 * This HOC will be used by this button and the one in tutorial meta
 */

interface BookmarkButtonProps {
	isBookmarked: boolean
	openDialog(): void
}

function BookmarkButton({ isBookmarked, openDialog }: BookmarkButtonProps) {
	// NOTE! - hiding this component from prod until auth is enabled
	if (!AUTH_ENABLED) {
		return null
	}
	const helpText = isBookmarked ? `Remove bookmark` : `Add bookmark`
	return (
		<button
			aria-pressed={isBookmarked}
			onClick={() => {
				// TODO use the create / destroy methods in the client
				// or render dialog to prompt auth if not auth'd
				console.log('Bookmark clicked!')
				// if not auth'd, show dialog
				openDialog()
			}}
			aria-label={helpText}
			className={s.button}
		>
			{isBookmarked ? <RemoveBookmarkIcon /> : <AddBookmarkIcon />}
		</button>
	)
}

function withDialog(BookmarkComponent) {
	return function BookmarkWithDialog({
		isBookmarked,
	}: Pick<BookmarkButtonProps, 'isBookmarked'>) {
		const [showDialog, setShowDialog] = useState(false)
		const openDialog = () => setShowDialog(true)
		const closeDialog = () => setShowDialog(false)

		function handleOptOut() {
			console.log('opt ou')
		}

		return (
			<>
				<BookmarkComponent openDialog={openDialog} />
				{showDialog ? (
					<Dialog
						onDismiss={closeDialog}
						isOpen={showDialog}
						label="Opt out form"
					>
						<BookmarkSignInPrompt onDismiss={closeDialog} />
					</Dialog>
				) : null}
			</>
		)
	}
}

export default withDialog(BookmarkButton)
