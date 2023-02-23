import { OutlineLinkItem } from '../types'

/**
 * Given an array of outline items, each of which has a `url` property,
 * and a string representing #hash portion of the current URL,
 *
 * Return the array of items with `isActive` property set to `true` on any
 * items that have a matching URL.
 */
function highlightActiveItems(
	items: OutlineLinkItem[],
	currentUrl: string
): OutlineLinkItem[] {
	return items.map((item) => {
		if ('items' in item) {
			const activeItems = highlightActiveItems(item.items, currentUrl)
			return { ...item, items: activeItems }
		} else {
			const isActive = item.url === currentUrl
			return { ...item, isActive }
		}
	})
}

export { highlightActiveItems }
