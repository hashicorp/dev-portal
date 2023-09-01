/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'
import { OperationGroup, OpenApiNavItem } from '../types'

/**
 * Build nav items for each operation, group-by-group.
 */
export function getNavItems({
	topOfPageId,
	operationGroups,
	productSlug,
	title,
}: {
	topOfPageId: string
	operationGroups: OperationGroup[]
	productSlug: ProductSlug
	title: string
}): OpenApiNavItem[] {
	// Build the top-level page nav item
	const pageNavItem = {
		title,
		fullPath: `#${topOfPageId}`,
		theme: productSlug,
	}
	// Include grouped operation items
	const operationGroupItems = getOperationGroupItems(operationGroups)
	// Return the full set of nav items
	return [pageNavItem, ...operationGroupItems]
}

/**
 * Build nav items for each operation, group-by-group.
 */
function getOperationGroupItems(
	operationGroups: OperationGroup[]
): OpenApiNavItem[] {
	const navItems: OpenApiNavItem[] = []
	// Build items for each group
	for (const { heading, items } of Object.values(operationGroups)) {
		// Start each group with a divider and heading
		navItems.push({ divider: true })
		navItems.push({ heading })
		// Then include each group's items
		for (const { slug, summary } of items) {
			navItems.push({ title: summary, fullPath: `#${slug}` })
		}
	}
	return navItems
}
