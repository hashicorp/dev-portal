import { MenuItem } from 'components/sidebar'
import { Collection as ApiCollection } from 'lib/learn-client/types'
import { sortAlphabetically } from 'views/product-tutorials-view/helpers'

interface SidebarCategory {
	name: string
	collections: string[]
}

/**
 * The sidebar consists first of a list of uncategorized collections, sorted
 * alphabetically. Then follows with the categorized collections defined
 * in the `sidebarCategories` data above.
 */
export function buildCategorizedWafSidebar(
	collections: ApiCollection[],
	sidebarCategories: SidebarCategory[]
): MenuItem[] {
	/**
	 * Create a map of all the collections. As they are added to
	 * categorized sections, they will be deleted from this map.
	 * This ensures all collections will render in the sidebar even
	 * if they don't have a category
	 *  */
	const uncategorizedItems = new Map(
		collections
			.sort(sortAlphabetically('name'))
			.map((collection: ApiCollection) => [
				collection.slug,
				{ title: collection.name, href: collection.slug, isActive: false },
			])
	)
	const categorizedItems = []

	// build a sidebar section per category
	sidebarCategories.forEach((category: SidebarCategory) => {
		const sectionHeading = [{ divider: true }, { heading: category.name }]
		const sectionItems: MenuItem[] = category.collections
			.map((collectionSlug: string) => {
				// find the categorized collection based on its slug
				const item = collections.find(
					(collection: ApiCollection) => collection.slug === collectionSlug
				)
				if (!item) {
					return
				}

				// remove item from 'uncategorized'list
				uncategorizedItems.delete(collectionSlug)
				return {
					title: item.name,
					isActive: false,
					href: item.slug,
				}
			})
			.sort(sortAlphabetically('title'))

		categorizedItems.push(...sectionHeading, ...sectionItems)
	})

	return [...Array.from(uncategorizedItems.values()), ...categorizedItems]
}
