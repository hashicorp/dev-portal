/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * A NOTE ON THIS FILE
 *
 * We still have some significant cleanup to do with our `MenuItem`
 * types. Previously, this function was intertwined with those types,
 * which made this file seem simpler on the surface, but also
 * made this function more difficult to reason about in isolation.
 *
 * This function has been revised to accept any incoming data, as long as it
 * matches the type signatures required for this function to behave as expected.
 * At the same time, we want to give consumers the ability to preserve original
 * type information in the return data they receive.
 *
 * Due to the possibility of recursive nested within the "nav branch" types
 * that this function handles, the types in this file get a little more complex
 * than we typically see in this code base.
 *
 * A high-level overview of how this works:
 * - Consumers of this function pass `L` and `B` type arguments to ensure
 *   type information of their `navItems` tree is preserved
 * - The `L` type argument represents the consumer's `L`eaf node types.
 *   Passing this argument allows the preservation of complex leaf node types.
 *   For example, in many use cases we have `href` or `fullPath` properties.
 * - The `B` type argument represents the consumer's `B`ranch node types.
 *   Passing this argument allows the preservation of complex leaf node types.
 * - This function builds on the provided `L` and `B` types when filtering,
 *   augmenting them with `matchesFilter` and `hasRoutesMatchingFilter` props.
 */

/**
 * Incoming types
 *
 * We expect incoming `navItems` to be either:
 * - A `NavLeaf` node (additional properties are passed by the `L` type)
 * - A `NavBranch` node (custom properties are passed by the `B` type)
 *     - Note this type requires `L` and `B` type args due to nesting
 * - An arbitrary object (such as for `heading` and `divider` nodes)
 */

type NavLeaf<L> = {
	title: string
} & L

type NavBranch<L, B> = {
	title: string
	routes: NavItem<L, B>[]
} & B

type NavOther = object

type NavItem<L, B> = NavLeaf<L> | NavBranch<L, B> | NavOther

/**
 * Type guards for incoming types
 */

/**
 * Assert that the incoming item matches a generic `NavLeaf` type.
 */
function isNavLeaf<L>(item: unknown): item is NavLeaf<L> {
	return typeof item == 'object' && 'title' in item && !('routes' in item)
}

/**
 * Assert that the incoming item matches the `NavBranch` type.
 */
function isNavBranch<L, B>(item: unknown): item is NavBranch<L, B> {
	return typeof item == 'object' && 'title' in item && 'routes' in item
}

/**
 * Filtered types
 *
 * After filtering, we expect the items to be narrower, being either:
 * - A `FilteredNavLeaf` node
 *     - The `L` type arg allows preservation of incoming types
 * - A `FilteredNavBranch` node
 *     - The `L` and `B` type args allows preservation of incoming types
 */

type FilteredNavLeaf<T> = {
	title: string
	matchesFilter: boolean
} & T

type FilteredNavBranch<L, B> = {
	title: string
	matchesFilter: boolean
	hasRoutesMatchingFilter: boolean
	routes: FilteredNavItem<L, B>[]
} & B

type FilteredNavItem<L, B> = FilteredNavLeaf<L> | FilteredNavBranch<L, B>

/**
 * Given an array of NavItems, which may include NavLeaf and NavBranch items,
 * and given a valid filterValue, filter the incoming items and return them.
 *
 * If the `filterValue` is empty, return the items unchanged.
 *
 * If the `filterValue` is not empty, return only the items that match,
 * and filter items such that only `NavLeaf` and `NavBranch` items remain.
 * The returned items will have additional properties related to filtering,
 * see the `FilteredNavItem` type for details.
 */
export function filterNestedNavItems<L, B>(
	items: NavItem<L, B>[],
	filterValue: string
): FilteredNavItem<L, B>[] {
	// Otherwise, work through each item, and include items that match the filter
	const filteredItems: FilteredNavItem<L, B>[] = []
	for (const item of items) {
		if (isNavBranch<L, B>(item)) {
			// Handle submenus, which have a `title` and nested `routes` to match
			const matchesFilter = isTitleMatch(item.title, filterValue)
			const routesFiltered = filterNestedNavItems<L, B>(
				item.routes,
				filterValue
			)
			// Note: `hasRoutesMatchingFilter` is used to auto-expand matched submenus
			filteredItems.push({
				...item,
				matchesFilter,
				hasRoutesMatchingFilter: routesFiltered.length > 0,
				routes: routesFiltered,
			})
		} else if (isNavLeaf<L>(item)) {
			// Handle all other items with a `title`, which we'll match directly
			const matchesFilter = isTitleMatch(item.title, filterValue)
			filteredItems.push({ ...item, matchesFilter })
		}
	}

	// Return filtered items
	return filteredItems
}

/**
 *
 * FLAT NAV ITEMS
 *
 * In cases where we have no nesting in our nav items, it's quite a bit simpler
 * to filter arbitrary while retaining type information. We still want the
 * consumer to be able to preserve custom `L`eaf node type information,
 * but we don't have to worry about branch nodes and the associated nesting,
 * and we don't need to return with an additional `matchesTitle` property,
 * since all returned items will be matches.
 */

type NavItemFlat<L> = NavLeaf<L> | NavOther

/**
 * Given a flat array of nav items, without nesting,
 * Return an array of filtered navItems.
 *
 * If the provided `filterValue` is falsy, we return the items unchanged.
 */
export function filterFlatNavItems<L = Record<string, never>>(
	items: NavItemFlat<L>[],
	filterValue: string
): NavItemFlat<L>[] {
	// If there's no filter value, return items unchanged
	if (!filterValue) {
		return items
	} else {
		return items.filter((item: NavItemFlat<L>) => {
			return isNavLeaf<L>(item) && isTitleMatch(item.title, filterValue)
		})
	}
}

/**
 *
 * UTILITIES
 *
 */

/**
 * Given a title and a filterValue,
 * Return `true` if they're considered a match, or `false` otherwise.
 */
function isTitleMatch(title: string, filterValue: string): boolean {
	return title.toLowerCase().includes(filterValue.toLowerCase())
}
