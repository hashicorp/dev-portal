import { IconBookmarkAdd16 } from '@hashicorp/flight-icons/svg-react/bookmark-add-16'
import { IconBookmarkRemove16 } from '@hashicorp/flight-icons/svg-react/bookmark-remove-16'
import Button from 'components/button'
import { withState } from './with-state'
import { RemoveBookmarkIcon, AddBookmarkIcon } from './icons'
import { BookmarkButtonConfigType, BookmarkButtonProps } from './types'
import s from './bookmark-button.module.css'

const bookmarkButtonConfig: BookmarkButtonConfigType = {
	add: {
		text: 'Add bookmark',
		baseIcon: <IconBookmarkAdd16 />,
		iconWithHover: <AddBookmarkIcon />,
	},
	remove: {
		text: 'Remove bookmark',
		baseIcon: <IconBookmarkRemove16 />,
		iconWithHover: <RemoveBookmarkIcon />,
	},
}

function BookmarkButtonIconOnly({
	isBookmarked,
	handleOnClick, // this is configured by the `withState` hoc
}: BookmarkButtonProps) {
	const { add, remove } = bookmarkButtonConfig
	const helpText = isBookmarked ? remove.text : add.text
	return (
		<button
			aria-pressed={isBookmarked}
			onClick={handleOnClick}
			aria-label={helpText}
			className={s.button}
		>
			{isBookmarked ? remove.iconWithHover : add.iconWithHover}
		</button>
	)
}

function BookmarkButtonTextAndIcon({
	isBookmarked,
	handleOnClick, // this is configured by the `withState` hoc
}: BookmarkButtonProps) {
	const { add, remove } = bookmarkButtonConfig
	const props = isBookmarked
		? { text: remove.text, icon: remove.baseIcon }
		: { text: add.text, icon: add.baseIcon }
	return <Button color="secondary" onClick={handleOnClick} {...props} />
}

export const TutorialCardBookmarkButton = withState(BookmarkButtonIconOnly)
export const TutorialMetaBookmarkButton = withState(BookmarkButtonTextAndIcon)
