import { Collection as ApiCollection } from 'lib/learn-client/types'
import { sortAlphabetically } from 'views/product-tutorials-view/helpers'
import { wafData } from '..'

/**
 * The sidebar consists first of a list of uncategorized collections, sorted
 * alphabetically. Then follows with the categorized collections defined
 * in the `sidebarCategories` data above.
 */
export function generateWafSidebarData(
	sidebarSections: ApiCollection[],
	sidebarCategories
) {
	const uncategorizedItems = new Map(
		sidebarSections
			.sort(sortAlphabetically('name'))
			.map((collection) => [
				collection.slug,
				{ title: collection.name, fullPath: collection.slug, isActive: false },
			])
	)
	const categorizedItems = []

	// go into the categories, build a section
	sidebarCategories.map((category) => {
		const items = category.collections
			.map((collectionSlug) => {
				const item = sidebarSections.find(
					(section) => section.slug === collectionSlug
				)
				// if it exists in the category, remove it from 'uncategorized'list
				if (item) {
					uncategorizedItems.delete(collectionSlug)
				}
				return item
			})
			.sort(sortAlphabetically('name'))
		categorizedItems.push(
			{ divider: true },
			{ heading: category.name },
			...items.map((item) => ({
				title: item.name,
				isActive: false,
				fullPath: item.slug,
			}))
		)
	})

	return {
		title: wafData.name,
		levelButtonProps: {
			levelUpButtonText: 'Main Menu',
			levelDownButtonText: 'Previous',
		},
		menuItems: [
			{ title: 'Overview', isActive: true, fullPath: `/${wafData.slug}` },
			...Array.from(uncategorizedItems.values()),
			...categorizedItems,
		],
		showFilterInput: false,
	}
}
