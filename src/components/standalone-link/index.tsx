/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import classNames from 'classnames'
import Link from 'components/link'
import {
	type StandaloneLinkContentsProps,
	type StandaloneLinkProps,
} from './types'
import s from './standalone-link.module.css'

const StandaloneLinkContents = ({
	className,
	color,
	icon,
	iconPosition,
	size,
	text,
	textClassName,
}: StandaloneLinkContentsProps) => {
	const containerClasses = classNames(
		s.contents,
		s[`color-${color}`],
		s[size],
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
	'data-heap-track': dataHeapTrack,
	color = 'primary',
	download,
	href,
	icon,
	iconPosition,
	onClick,
	opensInNewTab = false,
	size = 'medium',
	text,
	textClassName,
}: StandaloneLinkProps): ReactElement => {
	const classes = classNames(s.root, className)
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
				color={color}
				icon={icon}
				iconPosition={iconPosition}
				size={size}
				text={text}
				textClassName={textClassName}
			/>
		</Link>
	)
}

export type { StandaloneLinkContentsProps, StandaloneLinkProps }
export { StandaloneLinkContents }
export default StandaloneLink
