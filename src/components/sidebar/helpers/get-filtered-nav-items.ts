/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import commandScore from 'command-score'

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

		const score = commandScore(
			(item as SubmenuNavItemWithMetaData | LinkNavItemWithMetaData).title,
			filterValue
		)

		if (score > 0) {
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
