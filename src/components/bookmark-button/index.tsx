import { RemoveBookmarkIcon, AddBookmarkIcon } from './icons'
import s from './bookmark-button.module.css'

interface BookmarkButtonProps {
	isBookmarked: boolean
}

export default function BookmarkButton({ isBookmarked }: BookmarkButtonProps) {
	return (
		<span className={s.bookmarkIconWrap}>
			{isBookmarked ? <RemoveBookmarkIcon /> : <AddBookmarkIcon />}
		</span>
	)
}
