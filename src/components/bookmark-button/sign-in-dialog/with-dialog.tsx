import React, { useState } from 'react'
import Dialog from 'components/dialog'
import { BookmarkButtonProps } from '..'
import BookmarkSignInPrompt from './'

// TODO - use with the tutorial meta component also
export function withDialog(BookmarkComponent: React.FC<BookmarkButtonProps>) {
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
