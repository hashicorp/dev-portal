/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import Link from 'components/link'
import { ToastColor, developmentToast } from 'components/toast'
import {
	type StandaloneLinkContentsProps,
	type StandaloneLinkProps,
} from './types'
import s from './standalone-link.module.css'

const DEFAULT_COLOR_VARIANT = 'primary'
const DEFAULT_SIZE_VARIANT = 'medium'

const StandaloneLinkContents = ({
	className,
	color,
	icon,
	iconPosition,
	inheritColor = false,
	size = DEFAULT_SIZE_VARIANT,
	text,
	textClassName,
}: StandaloneLinkContentsProps) => {
	if (color && inheritColor) {
		developmentToast({
			color: ToastColor.warning,
			title: 'Warning in `StandaloneLinkContents`',
			description:
				'`StandaloneLinkContents` does not accept both `color` and `inheritColor`; `inheritColor` takes precedence.',
		})
	}

	const containerClasses = classNames(
		s.standaloneLinkContents,
		s[size],
		!inheritColor && s[color ?? DEFAULT_COLOR_VARIANT],
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
	download,
	href,
	icon,
	iconPosition,
	onClick,
	opensInNewTab = false,
	size = DEFAULT_SIZE_VARIANT,
	text,
	textClassName,
}: StandaloneLinkProps) => {
	const classes = classNames(s.standaloneLink, s[color], className)
	const rel = opensInNewTab ? 'noreferrer noopener' : undefined

	return (
		<Link
			aria-label={ariaLabel}
			className={classes}
			download={download}
			href={href}
			onClick={onClick}
			rel={rel}
			opensInNewTab={opensInNewTab}
		>
			<StandaloneLinkContents
				icon={icon}
				iconPosition={iconPosition}
				inheritColor
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
