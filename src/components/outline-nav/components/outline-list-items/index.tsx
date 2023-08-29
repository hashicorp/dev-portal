/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { OutlineLink, OutlineLinkWithNesting } from '..'
import type { OutlineLinkItem } from 'components/outline-nav/types'

/**
 * Render an array of OutlineNav list items.
 *
 * Each item can be either a plain link item, or
 * a link item with nested links.
 *
 * All items are wrapped in an <li /> element.
 */
function OutlineListItems({ items }: { items: OutlineLinkItem[] }) {
	return (
		<>
			{items.map((item: OutlineLinkItem, index: number) => {
				return (
					<li key={`${index}-${item.url}`}>
						{'items' in item ? (
							<OutlineLinkWithNesting {...item} />
						) : (
							<OutlineLink {...item} />
						)}
					</li>
				)
			})}
		</>
	)
}

export { OutlineListItems }
