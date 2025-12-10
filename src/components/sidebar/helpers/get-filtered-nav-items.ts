/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { FilteredNavItem, NavItemWithMetaData, SubmenuNavItemWithMetaData } from '../types'

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

	const normalizedFilterValue = filterValue.toLowerCase()
	const filteredItems = []
	const includesFilter = (value?: string) =>
		typeof value === 'string' &&
		value.toLowerCase().includes(normalizedFilterValue)

	for (const item of items) {
		const isSubmenuNavItem = 'routes' in item
		const isLinkNavItem = 'path' in item || 'href' in item
		const doesNotHaveTitle = !('title' in item)
		if (doesNotHaveTitle || !(isSubmenuNavItem || isLinkNavItem)) {
			continue
		}

		const doesTitleMatchFilter = includesFilter(item.title)
		const doesAliasMatchFilter =
			'alias' in item && includesFilter(item.alias)

		// Flag items where either title or alias matches the active filter value.
		if (doesTitleMatchFilter || doesAliasMatchFilter) {
			filteredItems.push({ ...item, matchesFilter: true })
			continue
		}

		/**
		 * If an item's title or alias matches the filter, we include it in the
		 * results and mark it with `matchesFilter`. This metadata is consumed by
		 * `SidebarNavSubmenu` to control which submenus start open while searching.
		 *
		 * When neither title nor alias matches we recurse into submenu children to
		 * surface any descendants that do match and annotate the parent so it stays
		 * open.
		 */
		if (isSubmenuNavItem) {
			const submenuItem = item as SubmenuNavItemWithMetaData
			const matchingChildren = getFilteredNavItems(
				submenuItem.routes,
				filterValue
			)
			const hasChildrenMatchingFilter = matchingChildren.length > 0

			if (hasChildrenMatchingFilter) {
				filteredItems.push({
					...submenuItem,
					hasChildrenMatchingFilter,
					routes: matchingChildren,
				})
			}
		}
	}

	return filteredItems as FilteredNavItem[]
}
