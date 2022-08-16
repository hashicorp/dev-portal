import { IconBookmarkAdd24 } from '@hashicorp/flight-icons/svg-react/bookmark-add-24'
import { toast } from 'components/toast'
import { AUTH_ENABLED } from 'hooks/use-authentication'
import { RemoveBookmarkIcon, AddBookmarkIcon } from './icons'
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
				toast({
					title: `Bookmark Added`,
					description: 'This tutorial has been added to your bookmarks.', // TODO update to use the tutorial name here
					autoDismiss: 15000,
					icon: <IconBookmarkAdd24 className={s.toastIcon} />,
				})
			}}
			aria-label={helpText}
			className={s.button}
		>
			{isBookmarked ? <RemoveBookmarkIcon /> : <AddBookmarkIcon />}
		</button>
	)
}
