/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Badge from 'components/badge'
import s from './heading-with-badge.module.css'

/**
 * Render a heading with an optional badge.
 *
 * Note: we accept `elem` and allow rendering of the heading as a `<p />`
 * because there's an `h1` later on the page, used for the service name.
 * We should likely fix this up in a future iteration of API page work.
 */
function HeadingWithBadge({
	text,
	badgeText,
	elem,
}: {
	text: string
	badgeText?: string
	elem: 'p' | 'h1'
}) {
	const Elem = elem
	return (
		<Elem className={s.root}>
			{text}
			{badgeText ? (
				<span className={s.badgeContainer}>
					<Badge text={badgeText} type="outlined" />
				</span>
			) : null}
		</Elem>
	)
}

export { HeadingWithBadge }
