/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import HDSBadge from '@hashicorp/react-design-system-components/src/components/badge'
import { BadgeProps } from './types'
import s from './badge.module.css'

const Badge = ({
	ariaLabel,
	className,
	color = 'neutral',
	icon,
	size = 'medium',
	text,
	type = 'filled',
}: BadgeProps) => {
	const classes = classNames(
		s.root,
		s[size],
		s[`${type}-${color}`],
		type === 'base' && s.base,
		className
	)
	const hasIcon = !!icon
	const hasText = !!text
	const hasLabel = !!ariaLabel
	const isIconOnly = hasIcon && !hasText

	if (!hasIcon && !hasText) {
		throw new Error(
			'`Badge` must have either `text` or an `icon` with accessible labels.'
		)
	}

	if (isIconOnly && !hasLabel) {
		throw new Error(
			'Icon-only `Badge`s require an accessible label. Either provide the `text` or `ariaLabel` prop.'
		)
	}

	// return (
	// 	<>
	// 		<span className="g-screen-reader-only">{ariaLabel ?? text}</span>
	// 		<span aria-hidden className={classes}>
	// 			{icon}
	// 			{text && <span>{text}</span>}
	// 		</span>
	// 	</>
	// )

	return (
		<HDSBadge
			text={text}
			icon={icon}
			size={size}
			type={type === 'base' ? 'filled' : type}
			iconOnly={isIconOnly}
			className={className}
		/>
	)
}

export type { BadgeProps }
export default Badge
