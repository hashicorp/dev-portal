import classNames from 'classnames'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import s from './standalone-link-contents.module.css'

interface StandaloneLinkContentsProps {
	text: string
	size?: 'small' | 'medium'
	isHovered?: boolean
}

/**
 * A text element that looks like a standalone link,
 * with an `isHovered` prop to trigger the arrow animation for the link.
 */
export function StandaloneLinkContents({
	text,
	size = 'medium',
	isHovered,
}: StandaloneLinkContentsProps) {
	return (
		<span className={classNames(s.root, s[size], { [s.isHovered]: isHovered })}>
			{text} <IconArrowRight16 />
		</span>
	)
}
