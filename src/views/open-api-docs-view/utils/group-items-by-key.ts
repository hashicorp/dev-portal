/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Given a flat array of items, and a getItemGroupKey function,
 * Return an array of item groups, with item groups being constructed
 * based on keys derived from the provided getItemGroupKey function.
 */
export function groupItemsByKey<Item>(
	items: Item[],
	getItemGroupKey: (item: Item) => string
): { key: string; items: Item[] }[] {
	// Set up an array to hold the item groups
	const itemGroups: { key: string; items: Item[] }[] = []
	// Iterate over our items, adding them to groups as we go
	for (const item of items) {
		const groupKey = getItemGroupKey(item)
		const existingGroup = itemGroups.find((g) => g.key === groupKey)
		if (existingGroup) {
			// If we already have an existing group, add the item to it
			existingGroup.items.push(item)
		} else {
			// Otherwise, start a new group item
			itemGroups.push({
				key: groupKey,
				items: [item],
			})
		}
	}
	// Return the array of item groups
	return itemGroups
}
