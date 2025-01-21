/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MenuItem } from 'components/sidebar'
import { EnrichedNavItem } from 'components/sidebar/types'
import { Collection as ApiCollection } from 'lib/learn-client/types'
import { sortAlphabetically } from 'lib/sort-alphabetically'

interface SidebarCategory {
	name: string
	collections: string[]
}

/**
 * The sidebar consists first of a list of uncategorized collections, sorted
 * alphabetically. Then follows with the categorized collections defined
 * in the `sidebarCategories` data above.
 */
export function buildCategorizedValidatedPatternsSidebar(
	collections: ApiCollection[],
	sidebarCategories: SidebarCategory[],
	currentSlug?: string
): EnrichedNavItem[] {
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
				{
					title: collection.name,
					fullPath: `/${collection.slug}`,
					isActive: collection.slug === currentSlug,
					id: collection.id,
				},
			])
	)
	const categorizedItems = []

	// build a sidebar section per category
	sidebarCategories.forEach((category: SidebarCategory) => {
		const sectionHeading = [{ divider: true }, { heading: category.name }]
		const sectionItems: MenuItem[] = category.collections
			.map((collectionSlug: string) => {
				// find the categorized collection based on its slug
				const collection = collections.find(
					(collection: ApiCollection) => collection.slug === collectionSlug
				)
				if (!collection) {
					return
				}

				// remove item from 'uncategorized'list
				uncategorizedItems.delete(collectionSlug)
				return {
					title: collection.name,
					isActive: collection.slug === currentSlug,
					fullPath: `/${collection.slug}`,
					id: collection.id,
				}
			})
			.sort(sortAlphabetically('title'))

		categorizedItems.push(...sectionHeading, ...sectionItems)
	})

	return [...Array.from(uncategorizedItems.values()), ...categorizedItems]
}
