/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import s from './badge-count.module.css'
import { BadgeCountProps } from './types'

/**
 * A numeric label used to display things like version number or collection enumerations.
 *
 * Implements https://helios.hashicorp.design/components/badge-count.
 * (Not intended as a final React implementation. Current intent is to meet
 * immediate design needs for unified search implementation).
 */
export default function BadgeCount({
	text,
	size = 'medium',
	type = 'filled',
	color = 'neutral',
}: BadgeCountProps) {
	return (
		<span
			className={classNames(
				s['hds-badge-count'],
				s[`hds-badge-count--color-${color}`],
				s[`hds-badge-count--size-${size}`],
				s[`hds-badge-count--type-${type}`]
			)}
		>
			{text}
		</span>
	)
}
