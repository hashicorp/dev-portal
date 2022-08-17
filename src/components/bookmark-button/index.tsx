import { IconBookmarkAdd16 } from '@hashicorp/flight-icons/svg-react/bookmark-add-16'
import { IconBookmarkRemove16 } from '@hashicorp/flight-icons/svg-react/bookmark-remove-16'
import { AUTH_ENABLED } from 'hooks/use-authentication'
import Button from 'components/button'
import { withState } from './with-state'
import { RemoveBookmarkIcon, AddBookmarkIcon } from './icons'
import s from './bookmark-button.module.css'

export interface BookmarkButtonProps {
	isBookmarked: boolean
	handleOnClick(): void
}

function BookmarkButtonIconOnly({
	isBookmarked,
	handleOnClick,
}: BookmarkButtonProps) {
	// NOTE! - hiding this component from prod until auth is enabled
	if (!AUTH_ENABLED) {
		return null
	}
	const helpText = isBookmarked ? `Remove bookmark` : `Add bookmark`
	return (
		<button
			aria-pressed={isBookmarked}
			onClick={handleOnClick}
			aria-label={helpText}
			className={s.button}
		>
			{isBookmarked ? <RemoveBookmarkIcon /> : <AddBookmarkIcon />}
		</button>
	)
}

function BookmarkButtonTextAndIcon({
	isBookmarked,
	handleOnClick,
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
			onClick={handleOnClick}
		/>
	)
}

export const TutorialCardBookmarkButton = withState(BookmarkButtonIconOnly)
export const TutorialMetaBookmarkButton = withState(BookmarkButtonTextAndIcon)
