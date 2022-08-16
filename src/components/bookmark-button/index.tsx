import { AUTH_ENABLED } from 'hooks/use-authentication'
import React, { useState } from 'react'
import Dialog from 'components/dialog'
import BookmarkSignInPrompt from './sign-in-dialog'
import { RemoveBookmarkIcon, AddBookmarkIcon } from './icons'
import s from './bookmark-button.module.css'

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

// TODO - use with the tutorial meta component also
function withDialog(BookmarkComponent: React.FC<BookmarkButtonProps>) {
	return function BookmarkWithDialog({
		isBookmarked,
	}: Pick<BookmarkButtonProps, 'isBookmarked'>) {
		const [showDialog, setShowDialog] = useState(false)
		const openDialog = () => setShowDialog(true)
		const closeDialog = () => setShowDialog(false)

		return (
			<>
				<BookmarkComponent
					isBookmarked={isBookmarked}
					openDialog={openDialog}
				/>
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
