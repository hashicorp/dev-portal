import { OutlineLinkItem } from '../types'

/**
 * Get the had from a relative URL string
 */
function getHash(url: string): string {
	// Note: arbitrary URL used, we expect to handle relative links
	const urlObject = new URL(url, 'https://www.example.com')
	return urlObject.hash
}

/**
 * Flatten an array of OutlineLinkItem[] into an array of #hash slugs
 */
function getItemSlugs(items: OutlineLinkItem[]) {
	const itemSlugs = []
	for (const item of items) {
		// Get the hash without leading the `#`
		const slug = getHash(item.url).replace('#', '')
		// Not all item URLs have a defined hash, only push meaningful slugs
		if (slug !== '') {
			itemSlugs.push(slug)
		}
		// Some items have nested items, push slugs for these
		if ('items' in item) {
			itemSlugs.push(...getItemSlugs(item.items))
		}
	}
	return itemSlugs
}

export { getItemSlugs }
