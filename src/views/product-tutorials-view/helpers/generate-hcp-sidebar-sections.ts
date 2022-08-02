import { Collection as ApiCollection } from 'lib/learn-client/types'

/**
 * TODO: extract to src/content folder?
 */
const SIDEBAR_CATEGORIES = [
	{
		name: 'Collections',
		collections: ['cloud/networking', 'cloud/consul-cloud'],
	},
]

/**
 * TODO: need final designs for /hcp/tutorials, this is placeholder
 */
export function generateHcpSidebarSections(apiCollections: ApiCollection[]) {
	const sidebarCategories = SIDEBAR_CATEGORIES
	//
	const sidebarSections = sidebarCategories.map((category) => {
		// get the items for this section
		const items = category.collections.map((collectionSlug) => {
			const item = apiCollections.find(
				(collection) => collection.slug === collectionSlug
			)
			return {
				text: item.name,
				isActive: false,
				href: item.slug.replace('cloud', '/hcp/tutorials'),
			}
		})
		// return the section
		return {
			title: category.name,
			items,
		}
	})

	return sidebarSections
}
