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
				if ('items' in item) {
					return (
						<li key={item.url}>
							<OutlineLinkWithNesting {...item} />
						</li>
					)
				} else {
					return (
						<li key={item.url}>
							<OutlineLink {...item} />
						</li>
					)
				}
			})}
		</>
	)
}

export { OutlineListItems }
