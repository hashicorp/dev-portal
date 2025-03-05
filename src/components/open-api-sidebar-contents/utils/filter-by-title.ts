/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */


/**
 * Given a flat array of items, and a `filterValue`,*
 * Return an array of filtered items, including only those items that
 * are objects with a `title` attribute that matches the `filterValue`.
 *
 * If the provided `filterValue` is falsy, we return all items unchanged.
 */
export function filterByTitle<T = unknown>(
	items: T[],
	filterValue: string
): T[] {
	if (!filterValue) {
		// If there's no filter value, return items unchanged
		return items
	} else {
		// Otherwise, filter for items that have a matching title
		return items.filter((item: T) => {
			return isObjectWithTitle(item) && isTitleMatch(item.title, filterValue)
		})
	}
}

/**
 * Given a title and a filterValue,
 * Return `true` if they're considered a match, or `false` otherwise.
 */
function isTitleMatch(title: string, filterValue: string): boolean {
	return title.toLowerCase().includes(filterValue.toLowerCase())
}

/**
 * Type guard to assert that a given item is an object with a title.
 */
function isObjectWithTitle<T extends { title?: unknown }>(
	item: T
): item is T & { title: string } {
	return typeof item.title === 'string'
}
