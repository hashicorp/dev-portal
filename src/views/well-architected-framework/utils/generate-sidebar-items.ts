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
	sidebarCategories.map((category: SidebarCategory) => {
		const sectionHeading = [{ divider: true }, { heading: category.name }]
		const sectionItems = category.collections
			.map((collectionSlug: string) => {
				// find the categorized collection based on its slug
				const item = collections.find(
					(collection: ApiCollection) => collection.slug === collectionSlug
				)
				if (!item) {
					return
				}

				// remove categozied item from 'uncategorized'list
				uncategorizedItems.delete(collectionSlug)
				return item
			})
			.sort(sortAlphabetically('name'))

		categorizedItems.push(
			...sectionHeading,
			...sectionItems.map((item: ApiCollection) => ({
				title: item.name,
				isActive: false,
				href: item.slug,
			}))
		)
	})

	return [...Array.from(uncategorizedItems.values()), ...categorizedItems]
}
