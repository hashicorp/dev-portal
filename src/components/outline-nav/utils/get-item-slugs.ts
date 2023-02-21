import { OutlineLinkItem } from '../types'

/**
 * Flatten an array of OutlineLinkItem[] into an array of #hash slugs
 */
function getItemSlugs(items: OutlineLinkItem[]) {
	return items.reduce((acc: string[], item: OutlineLinkItem) => {
		const urlObject = new URL(item.url)
		const slug = urlObject.hash.replace('#', '') // get hash without leading #
		acc.push(slug)
		if ('items' in item) {
			acc = acc.concat(getItemSlugs(item.items))
		}
		return acc
	}, [])
}

export { getItemSlugs }
