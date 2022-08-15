import { RemoveBookmarkIcon, AddBookmarkIcon } from './icons'
import s from './bookmark-button.module.css'

/**
 * TODO
 * - add button markup
 * - add prop for link handling
 * - create a 'plugged' in HOC that can render modals, update bookmark state etc.
 */

interface BookmarkButtonProps {
	isBookmarked: boolean
}

export default function BookmarkButton({ isBookmarked }: BookmarkButtonProps) {
	// NOTE! - hiding this component from prod until auth is enabled
	if (!__config.flags.enable_auth) {
		return null
	}
	return (
		<span className={s.bookmarkIconWrap}>
			{isBookmarked ? <RemoveBookmarkIcon /> : <AddBookmarkIcon />}
		</span>
	)
}
