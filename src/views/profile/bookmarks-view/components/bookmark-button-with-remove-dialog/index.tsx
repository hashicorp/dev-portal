import { useCallback, useState } from 'react'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import { BookmarkButtonIconOnly } from 'components/bookmark-button'
import Dialog from 'components/dialog'
import Heading from 'components/heading'
import Text from 'components/text'
import Button from 'components/button'
import s from './bookmark-button-with-remove-dialog.module.css'
import { ApiBookmark } from 'lib/learn-client/api/api-types'

export function BookmarkButtonWithRemoveDialog({
	tutorial,
}: {
	tutorial: Pick<ApiBookmark['tutorial'], 'name' | 'id'>
}) {
	const [showDialog, setShowDialog] = useState(false)
	const openDialog = () => setShowDialog(true)
	const closeDialog = () => setShowDialog(false)

	const removeBookmark = useCallback(() => {
		console.log('remove ', tutorial.id)
	}, [])

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
						<Button text="Remove" color="critical" onClick={removeBookmark} />
						<Button text="Cancel" color="secondary" onClick={closeDialog} />
					</div>
				</>
			</Dialog>
		</>
	)
}
