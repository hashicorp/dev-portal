import { OutlineLinkItem } from '../types'

/**
 * Flatten an array of OutlineLinkItem[] into an array of #hash slugs
 */
function getItemSlugs(items: OutlineLinkItem[]) {
	return items.reduce((acc: string[], item: OutlineLinkItem) => {
		/**
		 * TODO: use a URL util here?
		 */
		const slug = item.url.split('#')[1]
		acc.push(slug)
		if ('items' in item) {
			acc = acc.concat(getItemSlugs(item.items))
		}
		return acc
	}, [])
}

export { getItemSlugs }
