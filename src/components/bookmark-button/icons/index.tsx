import { IconBookmark16 } from '@hashicorp/flight-icons/svg-react/bookmark-16'
import { IconBookmarkAdd16 } from '@hashicorp/flight-icons/svg-react/bookmark-add-16'
import { IconBookmarkFill16 } from '@hashicorp/flight-icons/svg-react/bookmark-fill-16'
import { IconBookmarkRemoveFill16 } from '@hashicorp/flight-icons/svg-react/bookmark-remove-fill-16'
import classNames from 'classnames'
import s from './icons.module.css'

export function AddBookmarkIcon() {
	return (
		<>
			<IconBookmark16 className={classNames(s.icon, s.base)} />
			<IconBookmarkAdd16 className={classNames(s.icon, s.hover)} />
		</>
	)
}

export function RemoveBookmarkIcon() {
	return (
		<>
			<IconBookmarkFill16 className={classNames(s.icon, s.base)} />
			<IconBookmarkRemoveFill16 className={classNames(s.icon, s.hover)} />
		</>
	)
}
