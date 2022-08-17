import { AUTH_ENABLED } from 'hooks/use-authentication'
import { RemoveBookmarkIcon, AddBookmarkIcon } from './icons'
import makeBookmarkToast from './toast/make-bookmark-toast'
import s from './bookmark-button.module.css'

/**
 * TODO
 * - create a 'plugged' in HOC that can render modals, update bookmark state etc.
 * This HOC will be used by this button and the one in tutorial meta
 */

interface BookmarkButtonProps {
	isBookmarked: boolean
}

export default function BookmarkButton({ isBookmarked }: BookmarkButtonProps) {
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
				// also, link the toast notification with the successful API post/ delete response
				const toastAction = isBookmarked ? 'remove' : 'add'
				makeBookmarkToast(toastAction) // TODO, pass tutorialName as second arg
			}}
			aria-label={helpText}
			className={s.button}
		>
			{isBookmarked ? <RemoveBookmarkIcon /> : <AddBookmarkIcon />}
		</button>
	)
}
