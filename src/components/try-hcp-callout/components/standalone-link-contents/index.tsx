import classNames from 'classnames'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import s from './standalone-link-contents.module.css'

interface StandaloneLinkContentsProps {
	text: string
	size?: 'small' | 'medium'
}

/**
 * A text element that looks like a standalone link,
 * designed for use in CardLink.
 *
 * Note that the hover effect is dependent being nested within
 * an element with a `class` attribute that contains the string `"card-link"`.
 */
export function StandaloneLinkContents({
	text,
	size = 'medium',
}: StandaloneLinkContentsProps) {
	return (
		<span className={classNames(s.root, s[size])}>
			{text} <IconArrowRight16 />
		</span>
	)
}
