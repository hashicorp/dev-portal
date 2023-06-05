/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Badge from 'components/badge'
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
				<Badge className={s.countBadge} text={String(count)} />
			) : null}
		</span>
	)
}

export default TabHeadingWithCount
