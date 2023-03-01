/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	EnrichedNavItem,
	FilteredNavItem,
	LinkNavItemWithMetaData,
	NavItemWithMetaData,
	SubmenuNavItemWithMetaData,
} from '../types'

/**
 * This does not use Array.filter because we need to add metadata to each item
 * that is used for determining the open/closed state of submenu items.
 */
export const getFilteredNavItems = (
	items: NavItemWithMetaData[],
	filterValue: string
): (NavItemWithMetaData | FilteredNavItem)[] => {
	if (!filterValue) {
		return items as NavItemWithMetaData[]
	}

	const filteredItems = []

	items.forEach((item: EnrichedNavItem) => {
		const isSubmenuNavItem = item.hasOwnProperty('routes')
		const isLinkNavItem =
			item.hasOwnProperty('path') || item.hasOwnProperty('href')
		const doesNotHaveTitle = !(isSubmenuNavItem || isLinkNavItem)
		if (doesNotHaveTitle) {
			return
		}

		const doesTitleMatchFilter = (
			item as SubmenuNavItemWithMetaData | LinkNavItemWithMetaData
		).title
			?.toLowerCase()
			.includes(filterValue.toLowerCase())

		/**
		 * If an item's title matches the filter, we want to include it and its
		 * children in the filter results. `matchesFilter` is added to all items
		 * with a title that matches, and is used in `SidebarNavSubmenu` to
		 * determine if a submenu should be open when searching.
		 *
		 * If an item's title doesn't match the filter, then we need to recursively
		 * look at the children of a submenu to see if any of those have titles or
		 * subemnus that match the filter.
		 *
		 * TODO: write test cases to document this functionality more clearly
		 */
		if (doesTitleMatchFilter) {
			filteredItems.push({ ...item, matchesFilter: true })
		} else if (isSubmenuNavItem) {
			const matchingChildren = getFilteredNavItems(
				(item as SubmenuNavItemWithMetaData).routes,
				filterValue
			)
			const hasChildrenMatchingFilter = matchingChildren.length > 0

			if (hasChildrenMatchingFilter) {
				filteredItems.push({
					...item,
					hasChildrenMatchingFilter,
					routes: matchingChildren,
				})
			}
		}
	})

	return filteredItems as FilteredNavItem[]
}
