/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import BadgeCount from 'components/badge-count'
import s from './tab-heading-with-count.module.css'

/**
 * Display heading text alongside an optional count badge.
 *
 * Note: could consider `<Badge />` here, but designs differ slightly,
 * with more rounding, so have styled independently of `<Badge />` for now.
 */
function TabHeadingWithCount({
	heading,
	count,
}: {
	heading: string
	count?: number
}) {
	return (
		<span className={s.root}>
			{heading}
			{typeof count === 'number' ? (
				<BadgeCount text={String(count)} size="small" />
			) : null}
		</span>
	)
}

export default TabHeadingWithCount
