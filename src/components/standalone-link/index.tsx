import { ReactElement } from 'react'
import classNames from 'classnames'
import Link from 'components/link'
import { StandaloneLinkProps } from './types'
import s from './standalone-link.module.css'

const StandaloneLink = ({
	ariaLabel,
	className,
	color = 'primary',
	'data-heap-track': dataHeapTrack,
	download,
	href,
	icon,
	iconPosition,
	onClick,
	openInNewTab = false,
	size = 'medium',
	text,
	textClassName,
}: StandaloneLinkProps): ReactElement => {
	const classes = classNames(s.root, s[`color-${color}`], s[size], className)
	const rel = openInNewTab ? 'noreferrer noopener' : undefined

	return (
		<Link
			aria-label={ariaLabel}
			className={classes}
			data-heap-track={`standalone-link ${dataHeapTrack ?? ''}`}
			download={download}
			href={href}
			onClick={onClick}
			rel={rel}
			opensInNewTab={openInNewTab}
		>
			{iconPosition === 'leading' && icon}
			<span className={classNames(s.text, textClassName)}>{text}</span>
			{iconPosition === 'trailing' && icon}
		</Link>
	)
}

export type { StandaloneLinkProps }
export default StandaloneLink
