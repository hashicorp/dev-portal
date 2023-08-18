const IS_DEV = process.env.NODE_ENV !== 'production'

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
	// If we're in dev, and none of the items have a `title` property,
	// throw an error cause there's probably something unintentional happening.
	if (IS_DEV) {
		if (!items.some(isObjectWithTitle)) {
			throw new Error(
				'Error: None of the items passed to filterByTitle were found to have a `title` attribute. Please ensure at least one of the items being passed has a `title` attribute.'
			)
		}
	}

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
