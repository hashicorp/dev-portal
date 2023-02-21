import { OutlineLinkItem } from '../types'

/**
 * Flatten an array of OutlineLinkItem[] into an array of #hash slugs
 */
function getItemSlugs(items: OutlineLinkItem[]) {
	return items.reduce((acc: string[], item: OutlineLinkItem) => {
		// Note that baseUrl isn't important, we're just using it to get the hash
		const urlObject = new URL(item.url, 'https://www.example.com')
		const slug = urlObject.hash.replace('#', '') // get hash without leading #
		if (slug !== '') {
			acc.push(slug)
		}
		if ('items' in item) {
			acc = acc.concat(getItemSlugs(item.items))
		}
		return acc
	}, [])
}

export { getItemSlugs }
