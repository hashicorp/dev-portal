import { IconBookmark16 } from '@hashicorp/flight-icons/svg-react/bookmark-16'
import { IconBookmarkFill16 } from '@hashicorp/flight-icons/svg-react/bookmark-fill-16'
import s from './bookmark-button.module.css'

/**
 *
 * TODO- handle hover states
 */

interface BookmarkButtonProps {
	isBookmarked: boolean
}

export default function BookmarkButton({ isBookmarked }: BookmarkButtonProps) {
	return (
		<span className={s.bookmarkButton}>
			{isBookmarked ? <IconBookmarkFill16 /> : <IconBookmark16 />}
		</span>
	)
}
