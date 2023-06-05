/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconBookmarkAdd16 } from '@hashicorp/flight-icons/svg-react/bookmark-add-16'
import { IconBookmarkFill16 } from '@hashicorp/flight-icons/svg-react/bookmark-fill-16'
import Button from 'components/button'
import { Connected } from './helpers/connected-bookmark-button'
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
		baseIcon: <IconBookmarkFill16 />,
		iconWithHover: <RemoveBookmarkIcon />,
	},
}

/**
 * This bookmark icon for now is used in tutorial cards
 * only. The hover icon state for this is unique, see
 * the /icons file for more context.
 */

export function BookmarkButtonIconOnly({
	handleOnClick,
	isBookmarked,
}: BookmarkButtonProps) {
	const { add, remove } = bookmarkButtonConfig
	const ariaLabel = isBookmarked ? remove.text : add.text

	return (
		<button
			aria-pressed={isBookmarked}
			onClick={handleOnClick}
			aria-label={ariaLabel}
			className={s.button}
		>
			{isBookmarked ? remove.iconWithHover : add.iconWithHover}
		</button>
	)
}

/**
 * This component is a regular button, currently used
 * only in the tutorial meta component.
 *
 * 05-16-23 - we removed the label associated with this button to clean up the metadata area.
 * This comes with the tradeoff of this button being more difficult for voice recognition users to interact with it
 * as they need to guess the associated aria label to do so. See all the tradeoffs documented here:
 *  https://www.figma.com/file/NAFjIPkbwjyY8jPl6T9nlP/Tutorial-Variants?type=design&node-id=357-36771&t=R7V6tJoa5Omj5Fe4-0
 */

function BookmarkButtonSecondaryIcon({
	handleOnClick,
	isBookmarked,
}: BookmarkButtonProps) {
	const { add, remove } = bookmarkButtonConfig
	const buttonProps = isBookmarked
		? { ['aria-label']: remove.text, icon: remove.baseIcon }
		: { ['aria-label']: add.text, icon: add.baseIcon }

	return (
		<Button
			color="secondary"
			size="small"
			onClick={handleOnClick}
			{...buttonProps}
		/>
	)
}

/**
 * The above components are only responsible for rendering the bookmark UI
 * The below components are wrapped with an HOC - `withDialog`,
 * which passes the `handleOnClick` logic, checks for authentication,
 * and opens a dialog to prompt authentication.
 *
 * It also fetches the bookmark state and updates the API
 * upon user interaction, if authenticated.
 */
export const TutorialCardBookmarkButton = Connected(BookmarkButtonIconOnly)
export const TutorialMetaBookmarkButton = Connected(BookmarkButtonSecondaryIcon)
