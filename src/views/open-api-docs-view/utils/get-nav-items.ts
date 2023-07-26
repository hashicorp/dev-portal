import { ProductSlug } from 'types/products'
import { OperationGroup, OperationNavItem } from '../types'

/**
 * Build nav items for each operation, group-by-group.
 */
export function getNavItems(
	operationGroups: OperationGroup[]
): OperationNavItem[] {
	// Build the top-level page nav item
	// TODO: use productData here or something
	const pageNavItem = {
		title: 'HCP Vault Secrets API',
		fullPath: '/hcp/api-docs/vault-secrets',
		theme: 'hcp' as ProductSlug,
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
): OperationNavItem[] {
	const navItems: OperationNavItem[] = []
	// Build items for each group
	for (const { heading, items } of Object.values(operationGroups)) {
		// Start each group with a divider and heading
		navItems.push({ divider: true })
		navItems.push({ heading })
		// Then include each group's items
		for (const { slug, operationId } of items) {
			navItems.push({ title: operationId, fullPath: `#${slug}` })
		}
	}
	return navItems
}
