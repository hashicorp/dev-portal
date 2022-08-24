import { useCallback, useState } from 'react'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import { BookmarkButtonIconOnly } from 'components/bookmark-button'
import { ApiBookmark } from 'lib/learn-client/api/api-types'
import { useBookmarkMutations } from 'hooks/bookmarks'
import makeBookmarkToast from 'components/bookmark-button/toast/make-bookmark-toast'
import Dialog from 'components/dialog'
import Heading from 'components/heading'
import Text from 'components/text'
import Button from 'components/button'
import s from './bookmark-button-with-remove-dialog.module.css'

/**
 * ✨ Future abstraction ✨
 * There's room to abstract these general dialog styles into
 * a shared component. This dialog content and layout shares
 * styles almost exactly with the 'BookmarkSignInPrompt' dialog
 */

interface BookmarkButtonRemoveDialogProps {
	tutorial: Pick<ApiBookmark['tutorial'], 'name' | 'id'>
}

export function BookmarkButtonWithRemoveDialog({
	tutorial,
}: BookmarkButtonRemoveDialogProps) {
	const [showDialog, setShowDialog] = useState(false)
	const openDialog = () => setShowDialog(true)
	const closeDialog = () => setShowDialog(false)
	const { removeBookmark } = useBookmarkMutations()
	const handleOnClick = useCallback(
		() =>
			removeBookmark(tutorial.id, {
				onSuccess: () => makeBookmarkToast('remove', tutorial.name),
			}),
		[tutorial.id, tutorial.name, removeBookmark]
	)

	return (
		<>
			<BookmarkButtonIconOnly isBookmarked={true} handleOnClick={openDialog} />
			<Dialog
				onDismiss={closeDialog}
				isOpen={showDialog}
				label="Confirm remove bookmark"
			>
				<>
					<div className={s.header}>
						<Heading
							level={1}
							size={300}
							weight="semibold"
							className={s.heading}
						>
							Are you sure you want to remove this bookmark?
						</Heading>
						<button
							onClick={closeDialog}
							aria-label="Cancel"
							type="button"
							className={s.exitIcon}
						>
							<IconX16 />
						</button>
					</div>
					<Text className={s.subheading}>
						{`Once the bookmark for  ${tutorial.name} is removed you will have to
						manually re-add it.`}
					</Text>
					<div className={s.buttonGroup}>
						<Button text="Remove" color="critical" onClick={handleOnClick} />
						<Button text="Cancel" color="secondary" onClick={closeDialog} />
					</div>
				</>
			</Dialog>
		</>
	)
}
