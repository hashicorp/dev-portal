import { Tutorial } from 'lib/learn-client/types'
import { useBookmarkMutations, useIsBookmarked } from 'hooks/bookmarks'
import { AUTH_ENABLED } from 'hooks/use-authentication'
import { RemoveBookmarkIcon, AddBookmarkIcon } from './icons'
import s from './bookmark-button.module.css'

interface BookmarkButtonProps {
	tutorialId: Tutorial['id']
}

export default function BookmarkButton({ tutorialId }: BookmarkButtonProps) {
	const { isBookmarked } = useIsBookmarked({ tutorialId })
	const { addBookmark, removeBookmark } = useBookmarkMutations()

	// NOTE! - hiding this component from prod until auth is enabled
	if (!AUTH_ENABLED) {
		return null
	}

	const ariaLabel = isBookmarked ? `Remove bookmark` : `Add bookmark`
	const ariaPressed = isBookmarked
	const handleClick = () => {
		if (isBookmarked) {
			removeBookmark(tutorialId)
		} else {
			addBookmark(tutorialId)
		}
	}

	return (
		<button
			aria-label={ariaLabel}
			aria-pressed={ariaPressed}
			className={s.button}
			onClick={handleClick}
		>
			{isBookmarked ? <RemoveBookmarkIcon /> : <AddBookmarkIcon />}
		</button>
	)
}
