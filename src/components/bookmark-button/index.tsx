import { IconBookmarkAdd16 } from '@hashicorp/flight-icons/svg-react/bookmark-add-16'
import { IconBookmarkRemove16 } from '@hashicorp/flight-icons/svg-react/bookmark-remove-16'
import { AUTH_ENABLED } from 'hooks/use-authentication'
import Button from 'components/button'
import { withDialog } from './sign-in-dialog/with-dialog'
import { RemoveBookmarkIcon, AddBookmarkIcon } from './icons'
import s from './bookmark-button.module.css'

/**
 * TODO
 * - create a 'plugged' in HOC that can render modals, update bookmark state etc.
 * This HOC will be used by this button and the one in tutorial meta
 */

export interface BookmarkButtonProps {
	isBookmarked: boolean
	openDialog(): void
}

function BookmarkButtonIconOnly({
	isBookmarked,
	openDialog,
}: BookmarkButtonProps) {
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

function BookmarkButtonWithText({
	isBookmarked,
	openDialog,
}: BookmarkButtonProps) {
	// NOTE! - hiding this component from prod until auth is enabled
	if (!AUTH_ENABLED) {
		return null
	}
	return (
		<Button
			color="secondary"
			text={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
			icon={isBookmarked ? <IconBookmarkRemove16 /> : <IconBookmarkAdd16 />}
			onClick={() => {
				openDialog()
			}} // TODO hook up to real state mgmt, show dialog etc.
		/>
	)
}

export const TutorialCardBookmarkButton = withDialog(BookmarkButtonIconOnly)
export const TutorialMetaBookmarkButton = withDialog(BookmarkButtonWithText)
