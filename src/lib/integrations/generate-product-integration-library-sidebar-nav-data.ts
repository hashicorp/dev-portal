/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MenuItem } from 'components/sidebar/types'
import { ProductData } from 'types/products'

/**
 * Generate the sidebar nav data level for product integrations landing views,
 * such as `/vault/integrations`.
 */
export function generateProductIntegrationLibrarySidebarNavData(
	product: ProductData
) {
	const title = `${product.name} Integrations`
	// Set up menuItems for the sidebar
	const menuItems: MenuItem[] = [
		{
			title,
			fullPath: `/${product.slug}/integrations`,
			theme: product.slug,
			isActive: true,
		},
	]
	// Add Config SidebarLinks if they're provided
	if (product.integrationsConfig && product.integrationsConfig.sidebarLinks) {
		menuItems.push({ divider: true })
		menuItems.push({ heading: 'Integration Resources' })
		product.integrationsConfig.sidebarLinks.forEach((s) => {
			menuItems.push({ ...s, isActive: false })
		})
	}

	return {
		backToLinkProps: {
			text: `${product.name} Home`,
			href: `/${product.slug}`,
		},
		levelButtonProps: {
			levelUpButtonText: `${product.name} Home`,
			levelDownButtonText: 'Previous',
		},
		menuItems,
		/* We always visually hide the title, as we've added in a
			"highlight" item that would make showing the title redundant. */
		visuallyHideTitle: true,
		showFilterInput: false,
		title,
	}
}
