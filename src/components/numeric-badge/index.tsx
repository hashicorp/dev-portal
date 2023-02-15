/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import Badge from 'components/badge'
import { NumericBadgeProps } from './types'
import s from './numeric-badge.module.css'

const NumericBadge = ({
	color = 'neutral',
	size = 'medium',
	text,
	type = 'filled',
}: NumericBadgeProps) => {
	const classes = classNames(s.root, s[size])

	return (
		<Badge
			className={classes}
			color={color}
			size={size}
			text={text}
			type={type}
		/>
	)
}

export type { NumericBadgeProps }
export default NumericBadge
