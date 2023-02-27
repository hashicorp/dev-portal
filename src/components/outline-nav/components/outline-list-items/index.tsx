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
			{items.map((item: OutlineLinkItem) => {
				return (
					<li key={item.url}>
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
