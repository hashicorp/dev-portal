/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'
import { MenuItem, EnrichedNavItem } from 'components/sidebar/types'

/**
 * Determine whether a `menuItem` is an "overview" item.
 */
function isOverviewItem(item: MenuItem) {
	const isPathMatch =
		item.path === '' ||
		item.path === '/' ||
		item.path === '/index' ||
		item.path === 'index'
	return isPathMatch
}

/**
 * Determine whether a `menuItem` is an "heading" item.
 */
function isHeadingItem(item: MenuItem) {
	return typeof item.heading == 'string'
}

/**
 * We always include a brand-themed "highlight" item,
 * which serves as a menu item representing the top-level docs category.
 *
 * If the first item in docsSidebarLevel.menuItems is an "Overview" item,
 * then we remove it, as it would be redundant with the "highlight" item
 * we're adding.
 */
export default function addBrandedOverviewSidebarItem(
	items: MenuItem[],
	itemToAdd: { title: string; fullPath: string; theme: ProductSlug | 'generic' }
): MenuItem[] {
	let processedMenuItems: MenuItem[]

	/**
	 * Remove redundant items
	 */
	if (isOverviewItem(items[0])) {
		// Handle removal for "first item is Overview" case
		processedMenuItems = items.slice(1)
	} else if (isHeadingItem(items[0]) && isOverviewItem(items[1])) {
		// Handle removals for the "first item is Heading, second is Overview" case
		processedMenuItems = items.slice(2)
	} else {
		// Otherwise, no redundant items, so clone the incoming items, no removals
		processedMenuItems = items.slice()
	}

	/**
	 * Add the branded overview item
	 */
	processedMenuItems.unshift(itemToAdd)

	// Return the processed items
	return processedMenuItems
}
