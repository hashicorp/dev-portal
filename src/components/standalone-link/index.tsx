/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import Link from 'components/link'
import s from './standalone-link.module.css'
import { SharedBaseProps, type StandaloneLinkProps } from './types'

const DEFAULT_COLOR_VARIANT = 'primary'

const StandaloneLinkContents = ({
	className,
	color = DEFAULT_COLOR_VARIANT,
	icon,
	iconPosition,
	size,
	text,
	textClassName,
}: SharedBaseProps) => {
	const containerClasses = classNames(
		s.standaloneLinkContents,
		s[size],
		s[color],
		className
	)
	const textClasses = classNames(s.text, textClassName)

	return (
		<div className={containerClasses}>
			{iconPosition === 'leading' && icon}
			<span className={textClasses}>{text}</span>
			{iconPosition === 'trailing' && icon}
		</div>
	)
}

const StandaloneLink = ({
	ariaLabel,
	className,
	color = DEFAULT_COLOR_VARIANT,
	'data-heap-track': dataHeapTrack,
	download,
	href,
	icon,
	iconPosition,
	onClick,
	opensInNewTab = false,
	size = 'medium',
	text,
	textClassName,
}: StandaloneLinkProps) => {
	const classes = classNames(s.standaloneLink, s[color], className)
	const rel = opensInNewTab ? 'noreferrer noopener' : undefined

	return (
		<Link
			aria-label={ariaLabel}
			className={classes}
			data-heap-track={`standalone-link ${dataHeapTrack ?? ''}`}
			download={download}
			href={href}
			onClick={onClick}
			rel={rel}
			opensInNewTab={opensInNewTab}
		>
			<StandaloneLinkContents
				icon={icon}
				iconPosition={iconPosition}
				color={color}
				size={size}
				text={text}
				textClassName={textClassName}
			/>
		</Link>
	)
}

export { StandaloneLinkContents }
export type {
	SharedBaseProps as StandaloneLinkContentsProps,
	StandaloneLinkProps,
}
export default StandaloneLink
